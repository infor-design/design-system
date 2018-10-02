#!/usr/bin/env node

/**
 * @fileoverview This script uses theo to generate
 * different types of output from design tokens.
 * https://github.com/salesforce-ux/theo
 *
 * NOTE: More than likely there is a command in the package.json
 * to run this script with NPM.
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const glob = require('glob');
const fs = require('fs');
const swlog = require('./utilities/stopwatch-log.js');
const path = require('path');

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const configGlob = './design-properties/**/*.config.json';
const configs = glob.sync(configGlob);

// -------------------------------------
//   Main
// -------------------------------------
const taskName = swlog.logTaskStart('creating formats');

configs.forEach(config => {
  const themeName = path.basename(config, '.config.json');
  const themeConfig = JSON.parse(fs.readFileSync(config, 'utf8'));

  const platforms = {
    scss: {
      transformGroup: "scss",
      buildPath: "dist/tokens/web/",
      files: [{
        destination: `${themeName}.scss`,
        format: "scss/variables"
      },
      {
        destination: `${themeName}.json`,
        format: "json"
      },
      {
        destination: `${themeName}.custom-properties.css`,
        format: "css/variables"
      }]
    }
  };

  themeConfig.platforms = platforms;

  const dict = require('style-dictionary').extend(themeConfig);

  try {
    dict.buildAllPlatforms();
  } catch(e) {
    console.error(e);
  }
});

swlog.logTaskEnd(taskName);
