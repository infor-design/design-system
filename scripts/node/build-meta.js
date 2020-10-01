#!/usr/bin/env node

/**
 * @overview Copies the tokens theme
 * metadata.json to dist/
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const fs = require('fs');
const swlog = require('./utilities/stopwatch-log.js');

// -------------------------------------
//   Main
// -------------------------------------

/**
 * Generate a themes metadata.json for dist/
 * @param {String} src - The source file path
 * @param {String} dest - The destination file path
 * @param {String} version - The current lib release version
 * @returns {Promise}
 */
function generateMeta(src, dest, version) {
  return new Promise((resolve, reject) => {
    const startTaskName = swlog.logTaskStart('creating themes metadata file}');

    const metaObj = JSON.parse(fs.readFileSync(src, 'utf8'));
    metaObj.version = version;

    fs.writeFile(dest, JSON.stringify(metaObj, null, 4), (err) => {
      if (err) {
        reject(new Error(`Error during metadata creation ${err}`));
      } else {
        swlog.logTaskAction('Generated', `'${dest}'`);
        swlog.logTaskEnd(startTaskName);
        resolve();
      }
    });
  });
}

module.exports = generateMeta;
