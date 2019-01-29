#!/usr/bin/env node

/**
 * @fileoverview The build all process
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const del = require('del');
const gIcons = require('./generate-icons');
const gFonts = require('./generate-font');
const gTokens = require('./generate-tokens');
const compareTokens = require('./utilities/compare-tokens');

const themesArr = ['theme-soho', 'theme-uplift'];

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Create directories if they don't exist
 * @param  {array} arrPaths - the directory path(s)
 */
function createDirs(arrPaths) {
  arrPaths.forEach(path => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });
}

/**
 * Process promises synchronously
 * @param {object} arr
 */
async function runSync(arr) {
  let results = [];
  for (let i = 0; i < arr.length; i++) {
      let r = await arr[i]();
      results.push(r);
  }
  return results; // will be resolved value of promise
}

// -------------------------------------
//   Main
// -------------------------------------

// CLean up dist
const rootDest = './dist';
del.sync([rootDest]);
createDirs([rootDest]);

let promises = [];

themesArr.forEach(theme => {
  // const themeDest = `${rootDest}/${theme}`; // ToDo v3.0
  // createDirs([themeDest]); // ToDo v3.0

  const iconsSrc = `./sketch/${theme}/ids-icons.sketch`;
  if (args.build.includes('icons') && fs.existsSync(iconsSrc)) {
    // const dest = `${themeDest}/icons`; // ToDo v3.0
    const dest = `${rootDest}/icons`;
    createDirs([dest]);

    promises.push(() => {
      return gIcons(iconsSrc, dest);
    });
  }

  const fontSrc = `./font/${theme}`;
  if (args.build.includes('fonts') && fs.existsSync(fontSrc)) {
    // const dest = `${themeDest}/fonts`; // ToDo v3.0
    const dest = `${rootDest}/font`;
    createDirs([dest]);

    promises.push(() => {
      return gFonts(fontSrc, dest);
    });
  }

  const tokensSrc = `./design-tokens/${theme}`;
  if (args.build.includes('tokens') && fs.existsSync(tokensSrc)) {
    // const dest = `${themeDest}/tokens`; // ToDo v3.0
    const dest = `${rootDest}/tokens`;
    createDirs([dest]);

    promises.push(() => {
      return gTokens(tokensSrc, dest).then(() => {
        // Verify/validate token files against eachother
        // compareTokens(`${rootDest}/*/tokens/web/theme-*.simple.json`).catch(console.error); // ToDo v3.0
        return compareTokens(`${dest}/web/theme-*.simple.json`).catch(console.error);
      });
    });

  }
});

runSync(promises);
