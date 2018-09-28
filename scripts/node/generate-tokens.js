#!/usr/bin/env node

/**
 * @fileoverview This script uses theo to generate
 * different types of output from design tokens.
 * https://github.com/salesforce-ux/theo
 *
 * NOTE: More than likely there is a command in the package.json
 * to run this script with NPM.
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const argv = require('minimist')(process.argv.slice(2));
const compareTokens = require('./compare-tokens');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));
const rename = require('rename');
const swlog = require('./utilities/stopwatch-log.js');
const theo = require('theo');


// -------------------------------------
//   Constants/Variables
// -------------------------------------
const banner = `/**
 * ${pkg.name} - ${pkg.description}
 *
 * @version ${pkg.version}
 * @homepage ${pkg.repository.url}
 * @license ${pkg.license}
 */`;

const distPath = path.join(process.cwd(), './dist/tokens/web');
const formatArr = getFormats(argv.format);
const tokensPath = './design-tokens';
const tokenFiles = {
  colors: `${tokensPath}/**/color-palette.alias.yml`,
  themes: `${tokensPath}/*.yml`,
  variables: `${tokensPath}/**/variables.alias.yml`
}


// -------------------------------------
//   Main
// -------------------------------------

Promise.all([
  createDirs(distPath),
  compareTokens(glob.sync(tokenFiles.colors)),
  compareTokens(glob.sync(tokenFiles.themes)),
  compareTokens(glob.sync(tokenFiles.variables))
]).then(data => {
  convertTokens();
}).catch(err => swlog.error(err));

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Convert the yaml tokens into different
 * design token formats.
 */
function convertTokens() {
  swlog.logTaskStart('creating formats');

  const files = glob.sync(tokenFiles.themes);

  const promises = files.map(file => {
    return formatArr.map(format => {
      return convertFileToFormat(file, format);
    });
  });

  const flat = [].concat(...promises);

  Promise.all(flat).then(() => {
    swlog.logTaskEnd('creating formats');
  }).catch(err => swlog.error(err));
}

/**
 * Convert token files into a specific format
 * @param {string} srcFile - The file to convert
 * @param {string} toFormat - The format to conver to
 * @returns {Promise}
 */
function convertFileToFormat(srcFile, toFormat) {
  theo.registerTransform("web", ["color/hex"]);

  return theo.convert({
    transform: {
      type: 'web',
      file: srcFile
    },
    format: {
      type: toFormat,
    }
  })
  .then(data => {
    let newFile = rename(srcFile, {
      dirname: distPath,
      extname: `.${toFormat}`
    });

    // Only add the comment banner to non-json files
    const contents = (toFormat.includes('json')) ? data : banner + data;

    return new Promise((resolve, reject) => {
      fs.writeFile(newFile, contents, (err) => {
        if (err) throw new Error(err);
        swlog.success(path.parse(newFile).base);
        resolve();
      });
    });
  });
}

/**
 * Create directories in a string path
 * @param {string} path
 * @returns {Promise}
 */
function createDirs(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get the comma separated list of formats
 * to convert to
 * @param {string} formats
 * @returns {array}
 */
function getFormats(formats = 'raw.json') {
  return formats.split(',');
}
