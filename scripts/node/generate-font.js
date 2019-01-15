#!/usr/bin/env node

/**
 * @overview Copies the font files into the dist/ directory
 */
const args = require('minimist')(process.argv.slice(2));
const copydir = require('copy-dir');
const font_dir = `${process.cwd()}/font`;
const output_dir = `${process.cwd()}/dist/font`;
const path = require('path');
const swlog = require('./utilities/stopwatch-log.js');

const startTaskName = swlog.logTaskStart('copying font');

let fileCount = 0;

const filterFiles = (stat, filepath, filename) => {
  if (stat === 'file' && path.extname(filepath) === '.md') {
    swlog.logTaskAction('Ignore', filename, 'magenta');
    return false;
  }

  if (args.verbose) {
    swlog.logTaskAction('Copying', filename);
  }
  fileCount += 1;
  return true;
}

copydir(font_dir, output_dir, filterFiles, err => {
  if (err) {
    swlog.error(`Error! ${err}`);
    process.exit(1);
  } else {
    swlog.logTaskAction('Copied', `${fileCount} font files`)
    swlog.logTaskEnd(startTaskName);
  }
});



