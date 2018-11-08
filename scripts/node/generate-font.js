#!/usr/bin/env node

/**
 * @overview Copies the font files into the dist/ directory
 */
const args = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
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
  } else {
    swlog.logTaskEnd('copying font');
  }
});

/**
 * Translate yes/no to boolean
 * @param {string} val
 * @return {boolean}
 */
function yesOrNo(val) {
  return (val === true) || (val === 'Yes') || (val === 'yes') || (val === 'YES');
}
