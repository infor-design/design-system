#!/usr/bin/env node

// Dependencies
const ARGS = require('minimist')(process.argv.slice(2));
const FS = require('fs');
const GLOB = require('glob-fs')({ gitignore: true });
const PATH = require('path');
const PKG = require(PATH.join(process.cwd(), 'package.json'));
const RENAME = require('rename');
const THEO = require('theo');
const MKDIRP = require('mkdirp');


// Variables
const distPath = 'platforms/web';
const banner = `
/**
 * ${PKG.name} - ${PKG.description}
 * 
 * @version ${PKG.version}
 * @homepage ${PKG.repository.url}
 * @license ${PKG.license}
 */
`;

// Actions
createDirs(distPath);

const tokenFiles = './design-tokens/*.yml';
const formatArr = getFormats(ARGS.format);

GLOB.readdir(tokenFiles, (err, files) => {
  files.forEach(file => {
    formatArr.forEach(format => {
      console.log(`Converting ${file} to ${format}.`);
      convertFileToFormat(file, format);
    });
  });
});


// Helpers
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
        dirname: 'platforms/web',
        extname: `.${toFormat}`
      });
      let contents = banner + res;

      FS.writeFileSync(newFile, contents, (err) => {
        if (err) {
          throw err;
        }
        console.log(`The ${newFile} has been saved!`);
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