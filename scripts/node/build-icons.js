#!/usr/bin/env node
/* eslint-disable quotes */

/**
 * @fileoverview Create svg icons from a sketch file
 * For options, see https://developer.sketchapp.com/guides/sketchtool/
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------

const { execSync } = require('child_process');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const svgo = require('svgo');
const swlog = require('./utilities/stopwatch-log');

// Old Path was:
// Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool'
const options = {
  binaryPath: '/Applications/Sketch.app/Contents/MacOS/sketchtool',
  iconFormats: ['svg', 'png'],
};

/** @constant
 *  @desciption Remove fill="none" for custom styling. Requires`fill: transparent` in CSS
 *  @see https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md
*/
const customSvgoRemoveGroupFill = {
  type: 'perItem',
  fn: (item) => {
    if (item.isElem('g')) {
      item.removeAttr('fill');
    }
  },
};

/** @constant
 *  @desciption Add attribute to stroke paths to prevent unwanted scaling
 *  @see https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md
*/
const customSvgoNonScalingStroke = {
  type: 'perItem',
  fn: (item) => {
    if (item.hasAttr('stroke')) {
      item.addAttr({
        name: 'vector-effect',
        value: 'non-scaling-stroke',
        prefix: '',
        local: '',
      });
    }
  },
};

/** @constant
 *  @desciption Adds stroke attr to fill items to prevent overrides
 *  @see https://github.com/svg/svgo/blob/master/docs/how-it-works/en.md
*/
const customSvgoFillStroke = {
  type: 'perItem',
  fn: (item) => {
    if (item.hasAttr('fill') && !item.hasAttr('vector-effect')) {
      item.addAttr({
        name: 'stroke',
        value: 'none',
        prefix: '',
        local: '',
      });
    }
  },
};

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
function sketchtoolExec(command) {
  return execSync(`${options.binaryPath} ${command}`).toString();
}

/**
 * Optimize the generated .svg icon files
 * @param {String} src - The source directory for svgs
 */
function optimizeSVGs(src) {
  const startOptimizeTaskName = swlog.logSubStart('optimize SVGs');

  // Optimize with svgo:
  const svgoOptimize = new svgo({ //eslint-disable-line
    js2svg: { useShortTags: false },
    plugins: [
      { removeViewBox: false },
      { convertColors: { currentColor: '#000' } },
      { removeDimensions: true },
      { moveGroupAttrsToElems: true },
      { removeUselessStrokeAndFill: true },
      { mergePaths: true },
      { customSvgoRemoveGroupFill },
      { customSvgoNonScalingStroke },
      { customSvgoFillStroke },
    ],
  });

  const svgFiles = glob.sync(`${src}/*.svg`);
  let iconJSON = '{\n';

  // Divide each optimization into a promise
  svgFiles.sort();
  const last = svgFiles.length;

  const svgPromises = svgFiles.map(async (filepath, mapIndex) => { //eslint-disable-line
    try {
      const data = fs.readFileSync(filepath, 'utf8');
      const dataOptimized = await svgoOptimize.optimize(data);
      const countStr = '<path';
      const count = /<path/g;

      const pathStatement = dataOptimized.data
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '');

      iconJSON += `"${path.basename(filepath, '.svg')}": "${pathStatement.replace(/"/g, '\\"')}"${mapIndex + 1 === (last) ? '' : ','}\n`;

      // checking for more than one path in the file exported from sketch
      if (dataOptimized.data.includes(countStr)) {
        if (count.exec(dataOptimized.data).length !== 1) {
          swlog.error(`Found an Icon with not exactly one path in file: ${filepath}`);
        }
      }

      let svgFile = dataOptimized.data;
      svgFile = svgFile.replaceAll('stroke="#000"', 'stroke="currentColor"');
      const hasStroke = svgFile.indexOf('stroke="currentColor"') > -1;
      const isEmpty = filepath.indexOf(`icons${path.sep}empty`) > 1;
      const isClassic = filepath.indexOf(`theme-classic`) > 1;

      if (hasStroke && !isEmpty) {
        if (!isClassic) svgFile = dataOptimized.data.replace(`xmlns="http://www.w3.org/2000/svg"`, `xmlns="http://www.w3.org/2000/svg" style="color: #28282A; fill: transparent"`);
        svgFile = svgFile.replaceAll('stroke="currentColor"', 'stroke="currentColor" fill="transparent"');
      } else if (!isEmpty && !isClassic) {
        svgFile = dataOptimized.data.replace(`xmlns="http://www.w3.org/2000/svg"`, `xmlns="http://www.w3.org/2000/svg" style="color: transparent; fill: #28282A;"`);
      }
      console.log(`Optimizing ${filepath}${svgFile.indexOf('stroke="#000"') > -1}`);

      await fs.writeFileSync(filepath, svgFile, 'utf-8');
    } catch (err) {
      swlog.error(err);
    }
  });

  return Promise.all(svgPromises).then(() => {
    iconJSON = iconJSON.replace(',\n}', '\n}');
    fs.writeFileSync(`${src}/path-data.json`, `${iconJSON}}`, 'utf-8');
    swlog.logSubEnd(startOptimizeTaskName);
  }).catch(swlog.error);
}

/**
 * Create the svg files from sketch layers
 * @see {@link https://developer.sketchapp.com/reference/api/#export}
 * @param {String} srcFile - The sketch file
 * @param {String} dest - The destination
 * @returns {Promise}
 */
function createIconFiles(srcFile, dest) {
  const thisTaskName = swlog.logSubStart('create icon files');

  return new Promise((resolve) => {
    const exportArtboardsOptions = [
      'export',
      'artboards',
      srcFile,
      `--formats=${options.iconFormats.join(',')}`,
      '--include-symbols=NO',
      '--save-for-web=YES',
      `--output=${dest}`,
    ];

    const outputStr = sketchtoolExec(exportArtboardsOptions.join(' '));
    resolve(outputStr);
  })
    .then((output) => { //eslint-disable-line
      options.iconFormats.forEach((format) => {
        const regex = new RegExp(`\\.${format}`, 'g');
        const count = (output.match(regex) || []).length;
        swlog.logTaskAction('Created', `${count} ${format.toUpperCase()} files`);
      });

      swlog.logSubEnd(thisTaskName);

      if (options.iconFormats.indexOf('svg') !== -1) {
        return optimizeSVGs(dest);
      }
    });
}

/**
 * Replace whitespace and underscores with dashes, then lowercase
 * @param {String} str
 */
function sanitize(str) {
  return str.replace(/\s+|_+/g, '-').toLowerCase();
}

/**
 * Create directories if they don't exist
 * @param  {array} arrPaths - the directory path(s)
 */
function createDirs(arrPaths) {
  arrPaths.forEach((dirPath) => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
}

/**
 * Move icon types into proper directory
 * @param {String} srcDir - Directory of files
 * @param {Array} formats - Array of file formats
 */
function sortByFileFormat(srcDir, format) {
  const initialFiles = `${srcDir}/*.${format}`;
  const files = glob.sync(initialFiles);
  const dest = `${srcDir}/${format}`;
  let count = 0;

  createDirs([dest]);

  // Loop through and move each file
  const promises = files.map((f) => { //eslint-disable-line
    return new Promise((resolve, reject) => {
      const filename = sanitize(path.basename(f));
      const reg = /[\w-]+-(16|24|32)\.[\w]+/;
      const match = filename.match(reg);
      let thisDest = dest;

      if (match) {
        const size = match[1];
        thisDest = `${thisDest}/${size}`;
        createDirs([thisDest]);
      }

      fs.rename(f, `${thisDest}/${filename}`, (err) => {
        if (err) {
          reject(err);
        }
        count += 1;
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
  return new Promise((resolve) => {
    const thisTaskName = swlog.logSubStart('create metadata file');
    const outputStr = sketchtoolExec(`metadata ${src}`);
    const ignoredPages = ['Symbols', 'Icon Sheet', '------------'];

    const customObj = { categories: [] };
    const dataObj = JSON.parse(outputStr);

    // Loop through pages, then arboards, to create a
    // simple mapping of names (ignoring certain pages)
    // and naming pages "categories" and artboards "icons"
    for (const pageId in dataObj.pagesAndArtboards) {
      if (dataObj.pagesAndArtboards.hasOwnProperty(pageId) //eslint-disable-line
        && !ignoredPages.includes(dataObj.pagesAndArtboards[pageId].name)) {
        const tempObj = {
          name: dataObj.pagesAndArtboards[pageId].name,
          icons: [],
        };

        for (const ab in dataObj.pagesAndArtboards[pageId].artboards) { //eslint-disable-line
          if (dataObj.pagesAndArtboards[pageId].artboards.hasOwnProperty(ab)) { //eslint-disable-line
            tempObj.icons.push(dataObj.pagesAndArtboards[pageId].artboards[ab].name);
          }
        }
        tempObj.icons.sort();
        customObj.categories.push(tempObj);
      }
    }
    fs.writeFileSync(`${dest}/metadata.json`, JSON.stringify(customObj, null, 4), 'utf-8');
    swlog.logSubEnd(thisTaskName);
    resolve();
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
  return new Promise((resolve, reject) => { //eslint-disable-line

    const startTaskName = swlog.logTaskStart(`build icons from ${sketchfile}`);

    if (!hasSketchtool()) {
      return reject('No sketchtool installed. Skipping create icons...'); //eslint-disable-line
    }

    Promise.all([
      createPagesMetadata(sketchfile, dest),
      createIconFiles(sketchfile, dest),
    ])
      .then(() => {
        const thisTask = swlog.logSubStart('organize icon files');

        const promises = options.iconFormats.map((format) => { //eslint-disable-line
          return sortByFileFormat(dest, format);
        });

        return Promise.all(promises).then(() => {
          swlog.logSubEnd(thisTask);
        });
      })
      .then(() => {
        resolve();
        swlog.logTaskEnd(startTaskName);
      });
  }).catch(swlog.error);
}

module.exports = generateIcons;

module.exports = {
  generateIcons,
  optimizeSVGs
};
