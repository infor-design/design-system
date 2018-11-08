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
const svgo = require('svgo');
const swlog = require('./utilities/stopwatch-log.js');
const util = require("util");
const which = require('npm-which')(process.cwd());

const APP_PATH = '/Applications/Sketch.app';
const TOOL_PATH = `${ APP_PATH }/Contents/Resources/sketchtool/bin/sketchtool`;
const OUTPUT_DIR = `./dist/icons`;

const stats = {
  numOptimized: 0,
  total: 0
};

const spawnCb = code => {
  if (code === 0) {
    swlog.logTaskEnd(startTaskName);
    optimizeSVGs();
  } else {
    swlog.error(`Icon generation process exited with code ${code}`);
    process.exit(1);
  }
};

// -------------------------------------
//   Main
// -------------------------------------

const startTaskName = swlog.logTaskStart('exporting SVGs');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// build a command with arguments
const cmdArgs = [];
if (args.export) {
  cmdArgs.push('export');
  cmdArgs.push(args.export);
}
if (args.trimmed) { cmdArgs.push(`--trimmed=${args.trimmed}`); }
if (args.compression) { cmdArgs.push(`--compression=${args.compression}`); }
if (args.scales) { cmdArgs.push(`--scales=${args.scales}`); }
if (args.formats) { cmdArgs.push(`--formats=${args.formats}`); }
if (args.item) { cmdArgs.push(`--item=${args.item}`); }
if (yesOrNo(args.progressive)) { cmdArgs.push('--progressive'); }
if (yesOrNo(args.compact)) { cmdArgs.push('--compact'); }
if (args.background) { cmdArgs.push(`--background=${args.background}`); }
if (yesOrNo(args.groupContentsOnly)) { cmdArgs.push('--group-contents-only'); }
if (args.items) { cmdArgs.push(`--items=${args.items}`); }
if (yesOrNo(args.saveForWeb)) { cmdArgs.push('--save-for-web'); }
if (args.bounds) { cmdArgs.push(`--bounds=${args.bounds}`); }

args.clean = yesOrNo(args.clean);

// -------------------------------------
//   Functions
// -------------------------------------

return checkSketchTool()
  .catch(err => {
    swlog.error(err);
    // Note: Do not exit if there isn't a sketch tool
  })
  .then(cmnd => {
    const program = spawn(cmnd, cmdArgs.concat(args.srcfile, `--output=${OUTPUT_DIR}`));

    // Verbose Output
    program.stdout.on('data', function(data) {
      const dataStr = data.toString();

      // Count the number of "svg" exports
      stats.total = (dataStr.match(/.svg/g) || []).length;

      if (args.verbose) {
        return console.log(dataStr);
      } else {
        const msg = chalk.green(`${stats.total} SVGs`);
        return console.log(`- Exported ${msg}`);
      }
    });

    program.on('close', spawnCb);
});

/**
 * Check to see if a sketchtool is installed and where
 */
function checkSketchTool() {
  return new Promise((resolve, reject) => {
    // Check the tool bundled with Sketch.app (>= ver 3.5)
    return fs.access(TOOL_PATH, fs.F_OK, function(err) {
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
 * Optimize the generated .svg icon files
 */
function optimizeSVGs() {
  const startOptimizeTaskName = swlog.logTaskStart('optimizing svgs');

  const svgoOptimize = new svgo({
    plugins: [
      { removeViewBox: false }
    ]
  });

  const svgFiles = glob.sync(`${OUTPUT_DIR}/*.svg`);
  stats.total = svgFiles.length;

  const svgPromises = svgFiles.map(async filepath => {
    try {
      const data = await readFile(filepath, 'utf8');
      const dataOptimized = await svgoOptimize.optimize(data);
      await writeFile(filepath, dataOptimized.data, 'utf-8');
      if (args.verbose) {
        swlog.logTaskAction('Optimized', filepath);
      }
      stats.numOptimized++;
    } catch(err) {
      swlog.error(err);
      process.exit(1);
    }
  });

  Promise.all(svgPromises).then(() => {
    if (!args.verbose) {
      swlog.logTaskAction('Optimized', `${stats.numOptimized} SVGs`);
    }
    swlog.logTaskEnd(startOptimizeTaskName);
    logStats();
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
 * Console.log statistics from the build
 */
function logStats() {
  console.log(`
Icons ${chalk.green('created')}:   ${stats.total}
Icons ${chalk.green('optimized')}: ${stats.numOptimized}/${stats.total}
Icons ${chalk.yellow('skipped')}:   ${stats.total - stats.numOptimized}
`);
}
