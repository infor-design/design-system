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
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob-fs')({ gitignore: true });
const path = require('path');
const pkg = require(path.join(process.cwd(), 'package.json'));
const rename = require('rename');
const theo = require('theo');
const mkdirp = require('mkdirp');

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const banner = `
/**
 * ${pkg.name} - ${pkg.description}
 *
 * @version ${pkg.version}
 * @homepage ${pkg.repository.url}
 * @license ${pkg.license}
 */
`;

const stopwatch = {};
const distPath = path.join(process.cwd(), './dist/tokens/web');
const tokensPath = './design-tokens';
const formatArr = getFormats(argv.format);

let tokenFiles = `${tokensPath}/*.yml`;
if (argv.files) {
  tokenFiles = argv.files;
}

// -------------------------------------
//   Main
// -------------------------------------
logTaskStart('creating tokens');
createDirs(distPath);

glob.readdir(tokenFiles, (err, files) => {
  files.forEach(file => {
    formatArr.forEach(format => {
      convertFileToFormat(file, format);
    });
  });
  logTaskEnd('creating tokens');
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
  theo
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
      let newFile = rename(srcFile, {
        dirname: distPath,
        extname: `.${toFormat}`
      });

      let contents = res;

      // Do not add comment to invalidate .json files
      if (toFormat.substr('json') > -1) {
        contents = banner + res;
      }

      fs.writeFile(newFile, contents, (err) => {
        if (err) {
          throw err;
        }
        logTaskAction('Created', `${path.parse(newFile).base}.`);
      });
    })
    .catch(error => console.log(`Something went wrong: ${error}`));
}

/**
 * Create directories in a string path
 * @param {string} path
 */
function createDirs(path) {
  mkdirp(path, function (err) {
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

/**
 * Log an individual task's action
 * @param {string} action - the action
 * @param {string} desc - a brief description or more details
 * @param {string} [color] - one of the chalk module's color aliases
 */
function logTaskAction(action, desc, color = 'green') {
  console.log('-', action, chalk[color](desc));
}

/**
 * Console.log a finished action and display its run time
 * @param {string} taskName - the name of the task that matches its start time
 */
function logTaskEnd(taskName) {
  console.log('Finished', chalk.cyan(taskName), `after ${chalk.magenta(timeElapsed(stopwatch[taskName]))}`);
}

/**
 * Console.log a staring action and track its start time
 * @param {string} taskName - the unique name of the task
 */
function logTaskStart(taskName) {
  stopwatch[taskName] = Date.now();
  console.log('Starting', chalk.cyan(taskName), '...');
}


/**
 * Calculate the difference in seconds
 * @param {number} t - a time in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 * @return {string}
 */
function timeElapsed(t) {
  const elapsed = ((Date.now() - t)/1000).toFixed(2);
  return elapsed + 's';
}
