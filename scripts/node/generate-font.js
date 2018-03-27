#!/usr/bin/env node

/**
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const args = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const copydir = require('copy-dir');
const font_dir = `${process.cwd()}/font`;
const output_dir = `${process.cwd()}/dist/font`;
const path = require('path');
const swLog = require('./utilities/stopwatch-log.js');

swLog.logTaskStart('copying font');

const filterFiles = (stat, filepath, filename) => {
  if (stat === 'file' && path.extname(filepath) === '.md') {
    swLog.logTaskAction('Ignore', filename, 'magenta');
    return false;
  }

  swLog.logTaskAction('Copying', filename);
  return true;
}

copydir(font_dir, output_dir, filterFiles, err => {
  if (err) {
    swLog.logTaskAction('Error!', err, 'red');
  } else {
    swLog.logTaskEnd('copying font');
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
