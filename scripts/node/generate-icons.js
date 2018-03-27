#!/usr/bin/env node

/**
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const args = require('minimist')(process.argv.slice(2));
if (!args.srcfile) {
  throw Error('Error! No sketch source file specified.');
}

const fs          = require('fs');
const chalk       = require('chalk');
const which       = require('npm-which')(process.cwd());
const {Promise}   = require('es6-promise');
const {spawn}     = require('child_process');

const APP_PATH    = '/Applications/Sketch.app';
const TOOL_PATH   = `${ APP_PATH }/Contents/Resources/sketchtool/bin/sketchtool`;
const OUTPUT_DIR = `${process.cwd()}/dist/icons`;

const stopwatch  = {};
logTaskStart('creating icons');

// build a command with arguments
const cmdArgs = [];
if (args.export) {
  cmdArgs.push('export');
  cmdArgs.push(args.export);
}
if (args.trimmed) { cmdArgs.push(`--trimmed=${args.trimmed}`); }
if (args.compression) { cmdArgs.push(`--compression=${args.compression}`); }
if (args.scales) { cmdArgs.push(`--scales=${args.scales}`); }
if (args.formats) { cmdArgs.push(`--formats=${args.formats}`); }
if (args.item) { cmdArgs.push(`--item=${args.item}`); }
if (yesOrNo(args.progressive)) { cmdArgs.push('--progressive'); }
if (yesOrNo(args.compact)) { cmdArgs.push('--compact'); }
if (args.background) { cmdArgs.push(`--background=${args.background}`); }
if (yesOrNo(args.groupContentsOnly)) { cmdArgs.push('--group-contents-only'); }
if (args.items) { cmdArgs.push(`--items=${args.items}`); }
if (yesOrNo(args.saveForWeb)) { cmdArgs.push('--save-for-web'); }
if (args.bounds) { cmdArgs.push(`--bounds=${args.bounds}`); }

args.clean = yesOrNo(args.clean);

return checkSketchTool()
  .catch(err => {
    console.log('Error!', err);
  })
  .then(cmnd => {
    const program = spawn(cmnd, cmdArgs.concat(args.srcfile, `--output=${OUTPUT_DIR}`));

    // Verbose Output
    program.stdout.on('data', function(data) {
      if (args.verbose) {
        return console.log(data.toString());
      }
    });

    program.on('close', (code) => {
      if (code === 0) {
        logTaskEnd('creating icons');
      } else {
        console.log(`Icon generation process exited with code ${code}`);
      }
    });
});

/**
 * Check to see if a sketchtool is installed and where
 */
function checkSketchTool() {
  return new Promise(function(resolve, reject) {
    // Check the tool bundled with Sketch.app (>= ver 3.5)
    return fs.access(TOOL_PATH, fs.F_OK, function(err) {
      if (!err) {
        resolve(TOOL_PATH);
        return;
      }
      // Check the tool installed via install.sh
      return which('sketchtool', function(err2, pathTo) {
        if (err2) {
          return reject('No sketchtool installed.');
        } else {
          cmnd = pathTo;
          return resolve(cmnd);
        }
      });
    });
  });
}

/**
 * Log an individual task's action
 * @param {string} action - the action
 * @param {string} desc - a brief description or more details
 * @param {string} [color] - one of the chalk module's color aliases
 */
function logTaskAction(action, desc, color = 'green') {
  if (argv.verbose) {
    console.log('-', action, chalk[color](desc));
  }
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
