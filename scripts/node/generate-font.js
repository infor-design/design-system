#!/usr/bin/env node

/**
 * @overview Copies the font files into the dist/ directory
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const copydir = require('copy-dir');
const font_dir = `${process.cwd()}/font`;
const output_dir = `${process.cwd()}/dist/font`;
const path = require('path');
const swlog = require('./utilities/stopwatch-log.js');

const cleanUri = uri => {
  return uri.replace(`${process.cwd()}`, '.');
};

const filterFiles = (stat, filepath, filename) => {
  if (stat === 'file' && path.extname(filepath) === '.md') {
    swlog.logTaskAction('Ignore', `${stat} ${filename}`, 'magenta');
    return false;
  }

  if (stat === "directory") {
    swlog.logTaskAction('Copying', `${stat} ${cleanUri(filepath)}`);
  }
  return true;
}

// -------------------------------------
//   Main
// -------------------------------------

const startTaskName = swlog.logTaskStart('copying font');

copydir(font_dir, output_dir, filterFiles, err => {
  if (err) {
    swlog.error(`Error! ${err}`);
  }
  swlog.logTaskEnd(startTaskName);
});
