#!/usr/bin/env node

/**
 * @fileoverview Create svg icons from a sketch file
 * For options, see https://developer.sketchapp.com/guides/sketchtool/
 *
 * NOTE: More than likely there is a command in the package.json
 * to run this script with NPM.
 */

const args = require('minimist')(process.argv.slice(2));

if (!args.srcfile) {
  throw Error('Error! No sketch source file specified.');
}

const chalk       = require('chalk');
const fs          = require('fs');
const svgo        = require('svgo');
const swLog       = require('./utilities/stopwatch-log.js');
const which       = require('npm-which')(process.cwd());
const {Promise}   = require('es6-promise');
const {spawn}     = require('child_process');
const glob        = require('glob-fs')({ gitignore: true });


const APP_PATH    = '/Applications/Sketch.app';
const TOOL_PATH   = `${ APP_PATH }/Contents/Resources/sketchtool/bin/sketchtool`;
const OUTPUT_DIR = `./dist/tmp`;

const stopwatch  = {};
swLog.logTaskStart('creating icons');

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
        swLog.logTaskEnd('creating icons');
        optimizeSVGs();

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
 * Optimize the generated .svg icon files
 */
function optimizeSVGs() {
  swLog.logTaskStart('optimize svgs');
  const svgoOptimize = new svgo({});

  const onlySVG = file => {
    if (/.svg/.test(file.path)) {
      file.include = true;
    }
    return file;
  };

  return glob
    .use(onlySVG)
    .readdir(`./dist/tmp`, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach(filepath => {
        fs.readFile(filepath, 'utf8', (err, data) => {
          if (err) {
            throw err;
          }

          svgoOptimize
            .optimize(data, {path: './dist/icons'})
            .then(result => {
              fs.writeFileSync(filepath, result.data, 'utf-8');
              swLog.logTaskAction('Optimized', filepath);
            });
        });
      });
  });
}

/**
 * Translate yes/no to boolean
 * @param {string} val
 * @return {boolean}
 */
function yesOrNo(val) {
  return (val === true) || (val === 'Yes') || (val === 'yes') || (val === 'YES');
}
