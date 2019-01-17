#!/usr/bin/env node

/**
 * @overview Copies the font files into the dist/ directory
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const copydir = require('copy-dir');
const path = require('path');
const swlog = require('./utilities/stopwatch-log.js');

// -------------------------------------
//   Main
// -------------------------------------

/**
 * Generate fonts for a theme
 * @param {String} src - The source path
 * @param {String} dest - The destination path
 * @returns {Promise}
 */
function generateFonts(src, dest) {
  return new Promise((resolve, reject) => {
    const startTaskName = swlog.logTaskStart('copying font');
    let fileCount = 0;

    const filterFiles = (stat, filepath, filename) => {
      if (stat === 'file' && path.extname(filepath) === '.md') {
        swlog.logTaskAction('Ignore', filename, 'magenta');
        return false;
      }

      fileCount += 1;
      return true;
    }

    copydir(src, dest, filterFiles, err => {
      if (err) {
        reject(`Error! ${err}`);
        process.exit(1);
      } else {
        swlog.logTaskAction('Copied', `${fileCount} font files`)
        swlog.logTaskEnd(startTaskName);
        resolve();
      }
    });
  })
}

module.exports = generateFonts;
