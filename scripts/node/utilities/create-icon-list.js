#!/usr/bin/env node

/**
 * @fileoverview A utility to create a JSON list of all
 * generated SVG files.
 *
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------

const chalk = require('chalk');
const fs = require('fs');
const glob = require('glob');
const swlog = require('./stopwatch-log.js');
const path = require('path');

const OUTPUT_DIR = `./dist/icons`;
const OUTPUT_JSON_FILE = `./design-tokens/theme-soho/icons.json`;

const logStats = () => {
  console.log(`
Icons ${chalk.green('listed')}:  ${stats.numListed}
Icons ${chalk.yellow('ignored')}: ${stats.total - stats.numListed}
Icons ${chalk.green('total')}:   ${stats.total}
`);
}

// -------------------------------------
//   Main
// -------------------------------------

const startTaskName = swlog.logTaskStart('JSON-izing SVGs');
const svgFiles = glob.sync(`${OUTPUT_DIR}/*.svg`);

const stats = {
  numListed: 0,
  total: svgFiles.length
};

if (stats.total === 0) {
  swlog.error(`No SVGs were found at "${OUTPUT_DIR}". You probably need to run the icon generation script.`);

} else {
  const jsonObj = { "icons": {} };

  svgFiles.forEach(filePath => {
    let filename = path.basename(filePath, '.svg');
    jsonObj.icons[filename] = { value: filename };
    stats.numListed++;
  });

  fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(jsonObj, null, 4), 'utf-8');
}

logStats();
swlog.logTaskEnd(startTaskName);
