#!/usr/bin/env node

/**
 * @fileoverview The build all process
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const args = require('minimist')(process.argv.slice(2));
const glob = require('glob');
const del = require('del');
const fs = require('fs');
const compareTokens = require('./utilities/compare-tokens');
const gFonts = require('./build-font');
const gIcons = require('./build-icons');
const gMeta = require('./build-meta');
const gMixins = require('./build-mixins');
const gTokens = require('./build-tokens');
const gFigmaIcons = require('./build-figma-icons');
const gFigmaPngs = require('./fetch-figma-pngs');

const pkgjson = require('../../package.json');

const themesArr = ['theme-classic', 'theme-new'];

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

// -------------------------------------
//   Main
// -------------------------------------
// Clean up dist
const rootDest = './dist';
del.sync([rootDest]);
createDirs([rootDest]);

const promises = [];

if (args.build.includes('figma')) {
  promises.push(() => gFigmaPngs());
  promises.push(() => gFigmaIcons());
}

if (args.build.includes('meta')) {
  promises.push(() => {
    const filename = 'metadata.json';
    return gMeta(`design-tokens/${filename}`, `dist/${filename}`, pkgjson.version);
  });
}

if (args.build.includes('mixin')) {
  promises.push(() => {
    const filename = 'dist/theme-new/tokens/web/theme-new-mixins.scss';
    return gMixins(filename);
  });

  promises.push(() => {
    const filename = 'dist/theme-classic/tokens/web/theme-classic-mixins.scss';
    return gMixins(filename);
  });
}

themesArr.forEach((theme) => {
  const themeDest = `${rootDest}/${theme}`;
  const iconsDest = `${themeDest}/icons`;
  createDirs([themeDest, iconsDest]);

  if (args.build.includes('icons')) {
    const iconsSrcFiles = glob.sync(`./sketch/${theme}/ids-icons-*.sketch`);
    iconsSrcFiles.forEach((iconsSrc) => {
      const reg = /ids-icons-(\w+)\.sketch/;
      const match = iconsSrc.match(reg);
      const iconType = match[1];

      if (fs.existsSync(iconsSrc)) {
        const typeDest = `${iconsDest}/${iconType}`;
        createDirs([typeDest]);

        promises.push(() => gIcons.generateIcons(iconsSrc, typeDest));
      }
    });
  }

  if (args.build.includes('fonts')) {
    const fontSrc = './fonts/';
    if (fs.existsSync(fontSrc) && themeDest === './dist/theme-new') {
      const dest = `${themeDest}/fonts`;
      createDirs([dest]);

      promises.push(() => gFonts(fontSrc, dest));
    }
  }

  if (args.build.includes('tokens')) {
    const tokensSrc = `./design-tokens/${theme}`;
    if (fs.existsSync(tokensSrc)) {
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
  }
});

runSync(promises).then(() => {
  // Any thing we do last goes here
});
