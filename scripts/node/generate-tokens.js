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
const configGlob = './design-tokens/**/*.config.json';
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
      transformGroup: 'scss',
      buildPath: 'dist/tokens/web/',
      files: [{
        destination: `${themeName}.scss`,
        format: 'scss/variables'
      }, {
        destination: `${themeName}.json`,
        format: 'json'
      }, {
        destination: `${themeName}.custom-properties.css`,
        format: 'css/variables'
      }, {
        destination: `${themeName}.module.js`,
        format: 'javascript/module'
      }]
    },
    json: {
      transformGroup: 'scss',
      buildPath: 'dist/tokens/web/',
      files: [{
        destination: `${themeName}.simple.json`,
        template: 'website/simplejson'
      }, {
        destination: `${themeName}.json`,
        format: 'json'
      }]
    },
    javascript: {
      transformGroup: 'scss',
      buildPath: 'dist/tokens/web/',
      files: [{
        destination: `${themeName}.module.js`,
        format: 'javascript/module'
      }]
    }
  };

  themeConfig.platforms = platforms;

  const dict = require('style-dictionary').extend(themeConfig);

  dict.registerTemplate({
    name: 'website/simplejson',
    template: __dirname + '/utilities/tokens/simple.json.template'
  })

  try {
    dict.buildAllPlatforms();
  } catch(e) {
    console.error(e);
  }
});

swlog.logTaskEnd(taskName);


