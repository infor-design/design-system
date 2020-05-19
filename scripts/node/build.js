#!/usr/bin/env node

/**
 * @fileoverview The build all process
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const args = require('minimist')(process.argv.slice(2));
const glob = require('glob');
const copydir = require('copy-dir');
const del = require('del');
const fs = require('fs');
const compareTokens = require('./utilities/compare-tokens');
const gFonts = require('./build-font');
const gIcons = require('./build-icons');
const gMeta = require('./build-meta.js');
const gTokens = require('./build-tokens');
const swlog = require('./utilities/stopwatch-log.js');

const pkgjson = require('../../package.json');

const themesArr = ['theme-soho', 'theme-uplift'];

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Create directories if they don't exist
 * @param  {array} arrPaths - the directory path(s)
 */
const createDirs = (arrPaths) => {
  arrPaths.forEach((path) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  });
};

/**
 * Process promises synchronously
 * @param {object} arr
 */
const runSync = async (arr) => {
  const results = [];
  for (let i = 0; i < arr.length; i++) {
    let r = await arr[i](); //eslint-disable-line
    results.push(r);
  }
  return results; // will be resolved value of promise
};

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
const isVersionThreeOrNewer = parseInt(pkgjson.version.charAt(0), 10) > 2;

// Clean up dist
const rootDest = './dist';
del.sync([rootDest]);
createDirs([rootDest]);

const promises = [];

if (args.build.includes('meta')) {
  promises.push(() => {
    const filename = 'metadata.json';
    return gMeta(`design-tokens/${filename}`, `dist/${filename}`, pkgjson.version);
  });
}

themesArr.forEach((theme) => {
  const themeDest = `${rootDest}/${theme}`;
  const iconsDest = `${themeDest}/icons`;
  createDirs([themeDest, iconsDest]);

  const iconsSrcFiles = glob.sync(`./sketch/${theme}/ids-icons-*.sketch`);

  iconsSrcFiles.forEach((iconsSrc) => {
    const reg = /ids-icons-(\w+)\.sketch/;
    const match = iconsSrc.match(reg);
    const iconType = match[1];

    if (args.build.includes('icons') && fs.existsSync(iconsSrc)) {
      const typeDest = `${iconsDest}/${iconType}`;
      createDirs([typeDest]);

      promises.push(() => gIcons(iconsSrc, typeDest));
    }
  });

  const fontSrc = `./font/${theme}`;
  if (args.build.includes('fonts') && fs.existsSync(fontSrc)) {
    const dest = `${themeDest}/fonts`;
    createDirs([dest]);

    promises.push(() => gFonts(fontSrc, dest));
  }

  const tokensSrc = `./design-tokens/${theme}`;
  if (args.build.includes('tokens') && fs.existsSync(tokensSrc)) {
    const dest = `${themeDest}/tokens`;
    createDirs([dest]);

    promises.push(() => { //eslint-disable-line
      return gTokens(tokensSrc, dest).then(() => {
        const tokensToCompare = `${rootDest}/*/tokens/web/theme-*.simple.json`;
        // Verify/validate token files against eachother
        return compareTokens(tokensToCompare).catch(console.error); //eslint-disable-line
      });
    });
  }
});

runSync(promises).then(() => {
  // Any thing we do last goes here
});
