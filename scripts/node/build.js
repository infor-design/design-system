#!/usr/bin/env node

/**
 * @fileoverview The build all process
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const args = require('minimist')(process.argv.slice(2));
const compareTokens = require('./utilities/compare-tokens');
const copydir = require('copy-dir');
const del = require('del');
const fs = require('fs');
const gFonts = require('./build-font');
const gIcons = require('./build-icons');
const gTokens = require('./build-tokens');
const glob = require('glob');
const swlog = require('./utilities/stopwatch-log.js');

const isVersionThreeOrNewer = parseInt(pkgjson.version.charAt(0)) > 2;
const pkgjson = require('../../package.json');
const themesArr = ['theme-soho', 'theme-uplift'];

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Create directories if they don't exist
 * @param  {array} arrPaths - the directory path(s)
 */
const createDirs = arrPaths => {
  arrPaths.forEach(path => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });
};

/**
 * Process promises synchronously
 * @param {object} arr
 */
const runSync = async arr => {
  let results = [];
  for (let i = 0; i < arr.length; i++) {
      let r = await arr[i]();
      results.push(r);
  }
  return results; // will be resolved value of promise
}


/**
 * Copy one path to another
 * @param {string} from - path to directory
 * @param {string} to - path to directory
 */
const copyDirExists = (from, to) => {
  if (fs.existsSync(to)) {
    copydir.sync(to, from);
  }
};

// -------------------------------------
//   Main
// -------------------------------------

// Clean up dist
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
        const tokensToCompare = `${rootDest}/*/tokens/web/theme-*.simple.json`;
        // Verify/validate token files against eachother
        return compareTokens(tokensToCompare).catch(console.error);
      });
    });

  }
});

runSync(promises).then(() => {
  // Adapt version 2 to 3 by supporting old token paths in dist
  const startTaskName = swlog.logTaskStart(`Support deprecated tokens`);
  copyDirExists(`./dist/tokens`, `./dist/theme-soho/tokens`);
  copyDirExists(`./dist/tokens`, `./dist/theme-uplift/tokens`);
  swlog.logTaskEnd(startTaskName);

  if (isVersionThreeOrNewer) {
    swlog.error('DEPRECATON TODO: Remove v2 Token path support!!!');
  }
});
