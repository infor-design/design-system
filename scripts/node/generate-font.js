#!/usr/bin/env node

/**
 * @overview Copies the font files into the dist/ directory
 */
const copydir = require('copy-dir');
const font_dir = `${process.cwd()}/font`;
const output_dir = `${process.cwd()}/dist/font`;
const path = require('path');
const swlog = require('./utilities/stopwatch-log.js');

swlog.logTaskStart('copying font');

const filterFiles = (stat, filepath, filename) => {
  if (stat === 'file' && path.extname(filepath) === '.md') {
    swlog.logTaskAction('Ignore', filename, 'magenta');
    return false;
  }

  swlog.logTaskAction('Copying', filename);
  return true;
}

copydir(font_dir, output_dir, filterFiles, err => {
  if (err) {
    swlog.logTaskAction('Error!', err, 'red');
    process.exit(1);
  } else {
    swlog.logTaskEnd('copying font');
  }
});



