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
  const startTaskName = swlog.logTaskStart('creating formats');

  const configGlob = `${src}/**/*.config.json`;
  const configs = glob.sync(configGlob);

  configs.forEach(config => {
    const configName = path.basename(config, '.config.json');
    const themeConfig = JSON.parse(fs.readFileSync(config, 'utf8'));

    themeConfig.platforms = {
      scss: {
        transformGroup: 'scss',
        buildPath: `${dest}/web/`,
        files: [{
          destination: `${configName}.scss`,
          format: 'scss/variables'
        }, {
          destination: `${configName}.json`,
          format: 'json'
        }, {
          destination: `${configName}.custom-properties.css`,
          format: 'css/variables'
        }, {
          destination: `${configName}.module.js`,
          format: 'javascript/module'
        }]
      },
      json: {
        transformGroup: 'scss',
        buildPath: `${dest}/web/`,
        files: [{
          destination: `${configName}.simple.json`,
          template: 'custom-simplejson'
        }, {
          destination: `${configName}.json`,
          format: 'json'
        }]
      },
      javascript: {
        transformGroup: 'scss',
        buildPath: `${dest}/web/`,
        files: [{
          destination: `${configName}.module.js`,
          format: 'javascript/module'
        }]
      },
      xml: {
        transformGroup: 'scss',
        buildPath: `${dest}/web/`,
        files: [{
          destination: `${configName}.xml`,
          template: 'custom-xml'
        }]
      }
    };

    const dict = require('style-dictionary').extend(themeConfig);

    dict.registerTemplate({
      name: 'custom-simplejson',
      template: __dirname + '/utilities/tokens/simple.json.template'
    });

    dict.registerTemplate({
      name: 'custom-xml',
      template: __dirname + '/utilities/tokens/xml.template'
    })

    try {
      dict.buildAllPlatforms();
    } catch(e) {
      swlog.error(e);
      process.exit(1);
    }
  });
  swlog.logTaskEnd(startTaskName);
}

module.exports = generateTokens;
