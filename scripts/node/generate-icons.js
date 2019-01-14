#!/usr/bin/env node

/**
 * @fileoverview Create svg icons from a sketch file
 * For options, see https://developer.sketchapp.com/guides/sketchtool/
 *
 * NOTE: More than likely there is a command in the package.json
 * to run this script with NPM.
 */

const args = require('minimist')(process.argv.slice(2));

if (!args.srcfile) {
  swlog.error('Error! No sketch source file specified.');
  process.exit(1);
}

// -------------------------------------
//   Constants/Variables
// -------------------------------------

const {spawn} = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const svgo = require('svgo');
const swlog = require('./utilities/stopwatch-log.js');
const util = require("util");
const which = require('npm-which')(process.cwd());

const APP_PATH = '/Applications/Sketch.app';
const TOOL_PATH = `${ APP_PATH }/Contents/Resources/sketchtool/bin/sketchtool`;
const DIST_DIR = `./dist`;
const OUTPUT_DIR = `${DIST_DIR}/icons`;
const OUTPUT_FORMATS_DIR = {};

const stats = {};
const iconFormatsArr = args.formats.split(',');


// -------------------------------------
//   Main
// -------------------------------------
const startTaskName = swlog.logTaskStart('build icons');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
createDirs([DIST_DIR, OUTPUT_DIR]);

iconFormatsArr.forEach(format => {
  stats[format] = {
    attempted: 0,
    numOptimized: 0,
    total: 0
  }

  OUTPUT_FORMATS_DIR[format] = `${OUTPUT_DIR}/${format}`;
  createDirs([OUTPUT_FORMATS_DIR[format]]);
});

// build an export command with arguments
const exportIconsArgs = [];
if (args.export) {
  exportIconsArgs.push('export');
  exportIconsArgs.push(args.export);
}
if (args.trimmed) { exportIconsArgs.push(`--trimmed=${args.trimmed}`); }
if (args.compression) { exportIconsArgs.push(`--compression=${args.compression}`); }
if (args.scales) { exportIconsArgs.push(`--scales=${args.scales}`); }
if (args.formats) { exportIconsArgs.push(`--formats=${args.formats}`); }
if (args.item) { exportIconsArgs.push(`--item=${args.item}`); }
if (yesOrNo(args.progressive)) { exportIconsArgs.push('--progressive'); }
if (yesOrNo(args.compact)) { exportIconsArgs.push('--compact'); }
if (args.background) { exportIconsArgs.push(`--background=${args.background}`); }
if (yesOrNo(args.groupContentsOnly)) { exportIconsArgs.push('--group-contents-only'); }
if (args.items) { exportIconsArgs.push(`--items=${args.items}`); }
if (yesOrNo(args.saveForWeb)) { exportIconsArgs.push('--save-for-web'); }
if (args.bounds) { exportIconsArgs.push(`--bounds=${args.bounds}`); }

args.clean = yesOrNo(args.clean);

return sketchToolExists()
  .catch(err => {
    swlog.error(err);
    // Note: Do not exit if there isn't a sketch tool
  })
  .then(sketchtoolCmd => {
    createIconFiles(sketchtoolCmd);
    createPagesMetadata(sketchtoolCmd);
});


// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Check to see if a sketchtool is installed and where
 * @returns {string} path to sketchtool
 */
function sketchToolExists() {
  return new Promise((resolve, reject) => {
    // Check the tool bundled with Sketch.app (>= ver 3.5)
    return fs.access(TOOL_PATH, fs.F_OK, (err) => {
      if (!err) {
        resolve(TOOL_PATH);
        return;
      }
      // Check the tool installed via install.sh
      return which('sketchtool', (err2, pathTo) => {
        if (err2) {
          return reject('No sketchtool installed.');
        } else {
          cmnd = pathTo;
          return resolve(cmnd);
        }
      });
    });
  });
}

/**
 * Create the svg files form sketch layers
 * @param {string} sketchTool - path too sketchtool binary
 */
function createIconFiles(sketchTool) {
  const thisTaskName = swlog.logTaskStart('create icon files');
  const exportIcons = spawn(sketchTool, exportIconsArgs.concat(args.srcfile, `--output=${OUTPUT_DIR}`));
  exportIcons.stdout.on('data', data => {
    const dataStr = data.toString();

    // Count the number of read files per format
    iconFormatsArr.forEach(format => {
      const reg = new RegExp(`\\.${format}`, 'g');
      stats[format].attempted += (dataStr.match(reg) || []).length;
    });

    // Log out each icon filename per line
    if (args.verbose) {
      console.log(dataStr);
    }
  });

  exportIcons.on('close', code => {
    if (code === 0) {
      swlog.logTaskEnd(thisTaskName);

      organizeFormatsIntoDirs(iconFormatsArr);

      if (args.formats.indexOf('svg') !== -1) {
        // Only optimize svgs if svgs were a selected format
        optimizeSVGs();
      } else {
        logAllStats();
      }
    } else {
      swlog.error(`Icon generation process exited with code ${code}`);
      process.exit(1);
    }
  });
}

/**
 * Move icon types into proper directory
 */
function organizeFormatsIntoDirs(formats) {
  const thisStartTask = swlog.logTaskStart('organize icon files');

  formats.forEach(format => {
    const files = glob.sync(`${OUTPUT_DIR}/*.${format}`);

    files.forEach(f => {
      const filename = path.basename(f);
      fs.rename(f, `${OUTPUT_FORMATS_DIR[format]}/${filename}`, err => {
        if (err) throw err;
      });
    });

    stats[format].total = files.length;
    swlog.logTaskAction('Moved', `${stats[format].total} ${format.toUpperCase()} files`);
  });
  swlog.logTaskEnd(thisStartTask);
}

/**
 * Get the metadata from the sketch file to map
 * icons names to page names
 * @param {string} sketchTool - path too sketchtool binary
 */
function createPagesMetadata(sketchTool) {
  const thisTaskName = swlog.logTaskStart('create metadata file');

  const exec = require('child_process').exec;
  exec(`${sketchTool} metadata ${args.srcfile}`, (e, stdout, stderr)=> {
    if (e instanceof Error) {
        console.error(e);
        throw e;
    }

    let customObj = { pages: [] };
    const dataObj = JSON.parse(stdout);

    // Loop through pages, then arboards, to create a
    // simple mapping of names (ignoring "Symbols")
    for (const pageId in dataObj.pagesAndArtboards) {
      if (dataObj.pagesAndArtboards.hasOwnProperty(pageId) && dataObj.pagesAndArtboards[pageId].name !== 'Symbols') {
        const tempObj = {
          name: dataObj.pagesAndArtboards[pageId].name,
          artboards: []
        };

        for (const ab in dataObj.pagesAndArtboards[pageId].artboards) {
          if (dataObj.pagesAndArtboards[pageId].artboards.hasOwnProperty(ab)) {
            tempObj.artboards.push(dataObj.pagesAndArtboards[pageId].artboards[ab].name);
          }
        }

        customObj.pages.push(tempObj);
      }
    }
    fs.writeFileSync(`${OUTPUT_DIR}/metadata.json`, JSON.stringify(customObj, null, 4), 'utf-8');
    swlog.logTaskEnd(thisTaskName);
  });
}

/**
 * Create directories if they exist
 * @param  {array} arrPaths - the directory path(s)
 */
function createDirs(arrPaths) {
  arrPaths.forEach(path => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });
}

/**
 * Optimize the generated .svg icon files
 */
function optimizeSVGs() {
  const startOptimizeTaskName = swlog.logTaskStart('optimize SVGs');

  // Optimize with svgo
  const svgoOptimize = new svgo({
    plugins: [
      { removeViewBox: false }
    ]
  });

  const svgFiles = glob.sync(`${OUTPUT_FORMATS_DIR.svg}/*.svg`);
  // stats.svg.total = svgFiles.length;

  // Divide each optimization into a promise
  const svgPromises = svgFiles.map(async filepath => {
    try {
      const data = await readFile(filepath, 'utf8');
      const dataOptimized = await svgoOptimize.optimize(data);
      await writeFile(filepath, dataOptimized.data, 'utf-8');
      if (args.verbose) {
        swlog.success(`Optimized ${filepath}`);
      }
      stats.svg.numOptimized++;
    } catch(err) {
      swlog.error(err);
      process.exit(1);
    }
  });

  Promise.all(svgPromises).then(() => {
    if (!args.verbose) {
      swlog.logTaskAction('Optimized', `${stats.svg.numOptimized} SVGs`);
    }
    swlog.logTaskEnd(startOptimizeTaskName);
    logAllStats();
  }).catch(err => {
    swlog.error(err);
    process.exit(1);
  });
}

/**
 * Translate yes/no to boolean
 * @param {string} val
 * @return {boolean}
 */
function yesOrNo(val) {
  return (val === true) || (val === 'Yes') || (val === 'yes') || (val === 'YES');
}

/**
 * Log all stats for all formats
 */
function logAllStats() {
  swlog.logTaskEnd(startTaskName);
  iconFormatsArr.forEach(format => {
    logStats(format);
  });
}

/**i
 * Console.log statistics for a format
 * Note: leave indentation alone.
 * @param {string} format - The icon file type
 */
function logStats(format) {
  let statStr = `
${format.toUpperCase()}s ${chalk.green('attempted')}: ${stats[format].attempted}
${format.toUpperCase()}s ${chalk.green('created')}:   ${stats[format].total}
${format.toUpperCase()}s ${chalk.yellow('skipped')}:   ${stats[format].attempted - stats[format].total}
`;

  if (format === 'svg') {
    statStr += `${format.toUpperCase()}s ${chalk.green('optimized')}: ${stats[format].numOptimized}/${stats[format].total}`;
  }
  console.log(statStr);
}
