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
const path = require('path');
const font_dir = `${process.cwd()}/font`;
const output_dir = `${process.cwd()}/dist/font`;
const stopwatch  = {};

logTaskStart('copying font');

const filterFiles = (stat, filepath, filename) => {
  if (stat === 'file' && path.extname(filepath) === '.md') {
    logTaskAction('Ignore', filename, 'magenta');
    return false;
  } else {
    logTaskAction('Copying', filename);
  }
}

copydir(font_dir, output_dir, filterFiles, err => {
  if (err) {
    logTaskAction('Error!', err, 'red');
  } else {
    logTaskEnd('copying font');
  }
});


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

/**
 * Translate yes/no to boolean
 * @param {string} val
 * @return {boolean}
 */
function yesOrNo(val) {
  return (val === true) || (val === 'Yes') || (val === 'yes') || (val === 'YES');
}
