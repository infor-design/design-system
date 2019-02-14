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
const glob = require('glob');
const gIcons = require('./build-icons');
const gFonts = require('./build-font');
const gTokens = require('./build-tokens');
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
  const themeDest = `${rootDest}/${theme}`;
  const iconsDest = `${themeDest}/icons`;
  createDirs([themeDest, iconsDest]);

  const iconsSrcFiles = glob.sync(`./sketch/${theme}/ids-icons-*.sketch`);

  iconsSrcFiles.forEach(iconsSrc => {
    const reg = /ids-icons-(\w+)\.sketch/;
    const match = iconsSrc.match(reg);
    let iconType = match[1];

    if (args.build.includes('icons') && fs.existsSync(iconsSrc)) {
      const typeDest = `${iconsDest}/${iconType}`;
      createDirs([typeDest]);

      promises.push(() => {
        return gIcons(iconsSrc, typeDest);
      });
    }
  });

  const fontSrc = `./font/${theme}`;
  if (args.build.includes('fonts') && fs.existsSync(fontSrc)) {
    const dest = `${themeDest}/fonts`;
    createDirs([dest]);

    promises.push(() => {
      return gFonts(fontSrc, dest);
    });
  }

  const tokensSrc = `./design-tokens/${theme}`;
  if (args.build.includes('tokens') && fs.existsSync(tokensSrc)) {
    const dest = `${themeDest}/tokens`;
    createDirs([dest]);

    promises.push(() => {
      return gTokens(tokensSrc, dest).then(() => {
        // Verify/validate token files against eachother
        return compareTokens(`${rootDest}/*/tokens/web/theme-*.simple.json`).catch(console.error);
      });
    });

  }
});

runSync(promises);
