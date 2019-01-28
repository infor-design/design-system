#!/usr/bin/env node

/**
 * @fileoverview Create svg icons from a sketch file
 * For options, see https://developer.sketchapp.com/guides/sketchtool/
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------

const execSync = require('child_process').execSync;
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const svgo = require('svgo');
const swlog = require('./utilities/stopwatch-log.js');
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const options = {
  binaryPath: `/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool`,
  iconFormats: ['svg', 'png']
}

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Check to see if a sketchtool is installed and where
 */
function hasSketchtool() {
  return !!fs.existsSync(options.binaryPath);
}

/**
 * Execute sketchtool binary command
 * @param  {string} command
 * @return {string}
 */
function sketchtoolExec (command) {
  return execSync(`${options.binaryPath} ${command}`).toString();
}

/**
 * Create the svg files form sketch layers
 * @see {@link https://developer.sketchapp.com/reference/api/#export}
 * @param {String} srcFile - The sketch file
 * @param {String} dest - The destination
 * @returns {Promise}
 */
function createIconFiles(srcFile, dest) {
  const thisTaskName = swlog.logTaskStart('create icon files');

  return new Promise((resolve, reject) => {
    const exportArtboardsOptions = [
      'export',
      'artboards',
      srcFile,
      `--formats=${options.iconFormats.join(',')}`,
      '--include-symbols=NO',
      '--save-for-web=YES',
      `--output=${dest}`
    ];

    const outputStr = sketchtoolExec(exportArtboardsOptions.join(' '));
    resolve(outputStr);
  })
  .then(output => {
    options.iconFormats.forEach(format => {
      const regex = new RegExp(`\\.${format}`, 'g');
      const count = (output.match(regex) || []).length;
      swlog.logTaskAction('Created', `${count} ${format.toUpperCase()} files`);
    })

    swlog.logTaskEnd(thisTaskName);

    if (options.iconFormats.indexOf('svg') !== -1) {
      return optimizeSVGs(dest);
    }
  });
}

/**
 * Move icon types into proper directory
 * @param {String} srcDir - Directory of files
 * @param {Array} formats - Array of file formats
 */
function sortByFileFormat(srcDir, format) {
  const initialFiles = `${srcDir}/*.${format}`
  const dest = `${srcDir}/${format}`;
  const files = glob.sync(initialFiles);
  let count = 0;

  createDirs([dest]);

  // Loop through and move each file
  const promises = files.map(f => {
    return new Promise((resolve, reject) => {
      const filename = path.basename(f);
      fs.rename(f, `${dest}/${filename}`, err => {
        if (err) {
          reject(err);
        }
        count++;
        resolve(`${dest}/${filename}`);
      });
    });
  });

  return Promise.all(promises).then(() => {
    swlog.logTaskAction('Moved', `${count}/${files.length} ${format.toUpperCase()} files`);
  });
}

/**
 * Get the metadata from the sketch file to map
 * icons names to page names
 * @param {String} src - The source of the sketch file
 * @param {String} dest - The destination
 * @returns {Promise}
 */
function createPagesMetadata(src, dest) {
  return new Promise((resolve, reject) => {
    const thisTaskName = swlog.logTaskStart('create metadata file');
    const outputStr = sketchtoolExec(`metadata ${src}`)

    let customObj = { pages: [] };
    const dataObj = JSON.parse(outputStr);

    // Loop through pages, then arboards, to create a
    // simple mapping of names (ignoring "Symbols")
    for (const pageId in dataObj.pagesAndArtboards) {
      if (dataObj.pagesAndArtboards.hasOwnProperty(pageId)
        && dataObj.pagesAndArtboards[pageId].name !== 'Symbols') {

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
    fs.writeFileSync(`${dest}/metadata.json`, JSON.stringify(customObj, null, 4), 'utf-8');
    swlog.logTaskEnd(thisTaskName);
    resolve();
  });
}

/**
 * Create directories if they don't exist
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
 * @param {String} src - The source directory for svgs
 */
function optimizeSVGs(src) {
  const startOptimizeTaskName = swlog.logTaskStart('optimize SVGs');

  // Optimize with svgo
  const svgoOptimize = new svgo({
    plugins: [
      { removeViewBox: false }
    ]
  });

  const svgFiles = glob.sync(`${src}/*.svg`);

  // Divide each optimization into a promise
  const svgPromises = svgFiles.map(async filepath => {
    try {
      const data = await readFile(filepath, 'utf8');
      const dataOptimized = await svgoOptimize.optimize(data);

      // Add attribute to stroke paths to prevent unwanted scaling
      let dataTweak = dataOptimized.data.replace('stroke=', 'vector-effect="non-scaling-stroke" stroke=');
      await writeFile(filepath, dataTweak, 'utf-8');
    } catch(err) {
      swlog.error(err);
      process.exit(1);
    }
  });

  return Promise.all(svgPromises).then(() => {
    swlog.logTaskEnd(startOptimizeTaskName);
  }).catch(err => {
    swlog.error(err);
    process.exit(1);
  });
}

// -------------------------------------
//   Main
// -------------------------------------

/**
 * Generate icons for a theme
 * @param {String} sketchfile - The sketchfile source
 * @param {String} dest - The destination path for assets
 * @returns {Promise}
 */
function generateIcons(sketchfile, dest) {
  const startTaskName = swlog.logTaskStart('build icons');

  if (!hasSketchtool()) {
    swlog.error('No sketchtool installed. Exiting...');
    process.exit(1);
  }

  return Promise.all([
    createPagesMetadata(sketchfile, dest),
    createIconFiles(sketchfile, dest)
  ])
  .then(res => {
    const thisTask = swlog.logTaskStart(`organize icon files`);

    const promises = options.iconFormats.map(format => {
      return sortByFileFormat(dest, format);
    });

    return Promise.all(promises).then(() => {
      swlog.logTaskEnd(thisTask)
    });
  })
  .then(res => {
    swlog.logTaskEnd(startTaskName);
  })
  .catch(swlog.error);
}

module.exports = generateIcons;
