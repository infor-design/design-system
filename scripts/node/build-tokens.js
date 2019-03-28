#!/usr/bin/env node

/**
 * @fileoverview This script generates
 * different types of output from design tokens.
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const swlog = require('./utilities/stopwatch-log.js');
const _ = require('lodash');

const customTransforms = require('./utilities/tokens/custom-transforms');
const customFormats = require('./utilities/tokens/custom-formats');

const getPlatforms = (dest, name) => {
  return {
    scss: {
      transformGroup: 'scss',
      buildPath: `${dest}/web/`,
      files: [{
        destination: `${name}.scss`,
        format: 'scss/variables'
      }, {
        destination: `${name}.json`,
        format: 'json'
      }, {
        destination: `${name}.custom-properties.css`,
        format: 'css/variables'
      }, {
        destination: `${name}.module.js`,
        format: 'javascript/module'
      }]
    },
    json: {
      transformGroup: 'scss',
      buildPath: `${dest}/web/`,
      files: [{
        destination: `${name}.simple.json`,
        format: 'simple-json'
      }, {
        destination: `${name}.json`,
        format: 'json'
      }]
    },
    javascript: {
      transformGroup: 'scss',
      buildPath: `${dest}/web/`,
      files: [{
        destination: `${name}.module.js`,
        format: 'javascript/module'
      }]
    },
    xml: {
      transformGroup: 'scss',
      buildPath: `${dest}/web/`,
      files: [{
        destination: `${name}.xml`,
        format: 'mongoose-xml'
      }]
    },
    mongooseXml: {
      transforms: [
        'attribute/cti',
        'name/cti/kebab',
        'time/seconds',
        'content/icon',
        'mongoose:size/remToInt',
        'mongoose:color/hex8android'
      ],
      buildPath: `${dest}/web/`,
      files: [{
        destination: `${name}.mongoose.xml`,
        format: 'mongoose-xml'
      }]
    }
  };
};

// -------------------------------------
//   Main
// -------------------------------------

/**
 * Generate the tokens for a theme
 * @param {String} src - The source path
 * @param {String} dest - The destination path
 * @param {String} themeName - The theme name
 * @returns {Promise}
 */
function generateTokens(src, dest) {
  return new Promise((resolve) => {
    const startTaskName = swlog.logTaskStart(`creating tokens from ${src}`);
    const configGlob = `${src}/**/*.config.json`;
    const configs = glob.sync(configGlob);

    configs.forEach(config => {
      const configName = path.basename(config, '.config.json');

      const themeConfig = JSON.parse(fs.readFileSync(config, 'utf8'));
      themeConfig.platforms = getPlatforms(dest, configName);

      const dict = require('style-dictionary').extend(themeConfig);

      customTransforms.forEach(t => {
        dict.registerTransform(t);
      });

      customFormats.forEach(f => {
        dict.registerFormat(f);
      });

      dict.buildAllPlatforms();
    });

    swlog.logTaskEnd(startTaskName);
    resolve();
  })
  .catch(swlog.error);
}

module.exports = generateTokens;
