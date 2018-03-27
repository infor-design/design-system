#!/usr/bin/env node

/**
 * @fileoverview This script uses theo to generate
 * different types of out from design tokens.
 * https://github.com/salesforce-ux/theo
 *
 * NOTE: More than likely there is a command in the package.json
 * to run this script with NPM.
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const ARGS = require('minimist')(process.argv.slice(2));
const FS = require('fs');
const GLOB = require('glob-fs')({ gitignore: true });
const PATH = require('path');
const PKG = require(PATH.join(process.cwd(), 'package.json'));
const RENAME = require('rename');
const THEO = require('theo');
const MKDIRP = require('mkdirp');

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const banner = `
/**
 * ${PKG.name} - ${PKG.description}
 *
 * @version ${PKG.version}
 * @homepage ${PKG.repository.url}
 * @license ${PKG.license}
 */
`;

const distPath = PATH.join(process.cwd(), './dist/tokens/web');
const tokensPath = './design-tokens';
const formatArr = getFormats(ARGS.format);

let tokenFiles = `${tokensPath}/*.yml`;
if (ARGS.files) {
  tokenFiles = ARGS.files;
}

// -------------------------------------
//   Main
// -------------------------------------
createDirs(distPath);

GLOB.readdir(tokenFiles, (err, files) => {
  files.forEach(file => {
    formatArr.forEach(format => {
      convertFileToFormat(file, format);
    });
  });
});

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Convert token files into a specific format
 * @param {string} srcFile - The file to convert
 * @param {string} toFormat - The format to conver to
 */
function convertFileToFormat(srcFile, toFormat) {
  THEO
    .convert({
      transform: {
        type: 'web',
        file: srcFile
      },
      format: {
        type: toFormat,
      }
    })
    .then(res => {
      let newFile = RENAME(srcFile, {
        dirname: distPath,
        extname: `.${toFormat}`
      });

      let contents = res;

      // Do not add comment to invalidate .json files
      if (toFormat.substr('json') > -1) {
        contents = banner + res;
      }

      FS.writeFile(newFile, contents, (err) => {
        if (err) {
          throw err;
        }
        console.log(`Finished ${PATH.parse(newFile).base}.`);
      });
    })
    .catch(error => console.log(`Something went wrong: ${error}`));
}

/**
 * Create directories in a string path
 * @param {string} path
 */
function createDirs(path) {
  MKDIRP(path, function (err) {
    if (err) console.error(err)
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
