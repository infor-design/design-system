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
const styleDict = require('style-dictionary');

const swlog = require('./utilities/stopwatch-log.js');
const customTransforms = require('./utilities/tokens/custom-transforms');
const customFormats = require('./utilities/tokens/custom-formats');

const getPlatforms = (dest, name) => ({
  scss: {
    transformGroup: 'scss',
    buildPath: `${dest}/web/`,
    files: [{
      destination: `${name}.scss`,
      format: 'scss/variables',
    }, {
      destination: `${name}.json`,
      format: 'json',
    }, {
      destination: `${name}.variables.css`,
      format: 'css/variables',
    }, {
      destination: `${name}.module.js`,
      format: 'javascript/module',
    }],
  },
  json: {
    transformGroup: 'scss',
    buildPath: `${dest}/web/`,
    files: [{
      destination: `${name}.simple.json`,
      format: 'simple-json',
    }, {
      destination: `${name}.json`,
      format: 'json',
    }],
  },
  javascript: {
    transformGroup: 'scss',
    buildPath: `${dest}/web/`,
    files: [{
      destination: `${name}.module.js`,
      format: 'javascript/module',
    }],
  },
  xml: {
    transformGroup: 'scss',
    buildPath: `${dest}/web/`,
    files: [{
      destination: `${name}.xml`,
      format: 'mongoose-xml',
    }],
  },
  mongooseXml: {
    transforms: [
      'attribute/cti',
      'name/cti/kebab',
      'time/seconds',
      'content/icon',
      'mongoose:size/remToInt',
      'mongoose:color/hex8android',
    ],
    buildPath: `${dest}/web/`,
    files: [{
      destination: `${name}.mongoose.xml`,
      format: 'mongoose-xml',
    }],
  },
});

const makeHostCss = (_src, dest) => {
  const theme = dest.indexOf('soho') > -1 ? 'soho' : 'uplift';
  const files = [
    `${dest}/web/theme-${theme}-dark.variables.css`,
    `${dest}/web/theme-${theme}-contrast.variables.css`,
    `${dest}/web/theme-${theme}.variables.css`,
  ];

  files.forEach((file) => {
    let fileContents = fs.readFileSync(file, 'utf8');
    let destFileContents = '';
    const destFile = file.replace('variables.css', 'host.variables.css');

    fileContents = fileContents.replace(':root {', ':host {');
    fileContents.split(/\r?\n/).forEach((line) => {
      if (line.indexOf('--ids-color') > -1
         || line.indexOf('--ids-size') > -1
         || line.indexOf('--ids-number') > -1
         || line.indexOf('{') > -1
         || line.indexOf('}') > -1) {
        destFileContents += `${line}\n`;
      }
    });

    fs.writeFile(destFile, destFileContents, (err) => {
      if (err) {
        swlog.logTaskAction(`Error during host variable creation ${err}`);
      } else {
      //  swlog.logTaskAction('Generated', destFile);
      }
    });
  });
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

    configs.forEach((config) => {
      const configName = path.basename(config, '.config.json');

      const themeConfig = JSON.parse(fs.readFileSync(config, 'utf8'));
      themeConfig.platforms = getPlatforms(dest, configName);

      const dict = styleDict.extend(themeConfig);

      customTransforms.forEach((t) => {
        dict.registerTransform(t);
      });

      customFormats.forEach((f) => {
        dict.registerFormat(f);
      });

      dict.buildAllPlatforms();
    });

    makeHostCss(src, dest);
    swlog.logTaskEnd(startTaskName);
    resolve();
  })
    .catch(swlog.error);
}

module.exports = generateTokens;
