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
    const startTaskName = swlog.logTaskStart(`copying ${src} font`);
    let fileCount = 0;

    const filterFiles = (stat, filepath, filename) => {
      if (stat === 'file' && path.extname(filepath) === '.md') {
        swlog.logTaskAction('Ignore', filename, 'gray');
        return false;
      }

      fileCount += 1;
      return true;
    }

    copydir(src, dest, filterFiles, err => {
      if (err) {
        reject(`Error! ${err}`);
      } else {
        swlog.logTaskAction('Copied', `${fileCount} font files`)
        swlog.logTaskEnd(startTaskName);
        resolve();
      }
    });
  })
}

module.exports = generateFonts;
