#!/usr/bin/env node

/**
 * @overview Generates Sass Mixins From the Config File
 * metadata.json to dist/
 */
const fs = require('fs');
const swlog = require('./utilities/stopwatch-log.js');
const path = require('path');

// Dummy function to resolve the theme functions
global.theme = function(property) {
  return {theme : property};
};
const uiConfigUplift = require('../../design-tokens/ui.config.js');
const propKeys = {
  screens: '',
  colors: 'text-color',
  currentColor: 'current',
  transparent: 'transparent',
  backgroundColor: 'bg',
  backgroundOpacity: 'bg-opacity',
  borderOpacity: 'border-opacity',
  borderRadius: 'rounded',
  borderWidth: 'border',
  boxShadow: 'shadow',
  bg: 'background-color',
  colResize: 'col-resize',
  eResize: 'e-resize',
  nsResize: 'ns-resize',
  ewResize: 'ew-resize',
  fontFamily: 'font',
  fontSize: 'text',
  fontWeight: 'font',
  letterSpacing: 'tracking',
  lineHeight: 'leading',
  listStyleType: 'list',
  margin: 'm',
  minHeight: 'min-h',
  minWidth: 'min-w',
  padding: 'p',
  placeholderOpacity: 'placeholder-opacity',
  spacing: 'm',
  strokeWidth: 'stroke',
  textColor: 'text',
  textOpacity: 'text-opacity',
  verticalAlign: 'align',
  zIndex: 'z'
};

const cssKeys = {
  'text-color': 'color',
  'm': 'margin',
  'bg': 'background-color',
  'bg-opacity': 'opacity',
  'rounded': 'border-radius',
  'border': 'border-width',
  'shadow': 'box-shadow',
  'text': 'font-size',
  'font': 'font-family',
  'tracking': 'letter-spacing',
  'leading': 'line-height',
  'list': 'list-style-type',
  'min-h': 'min-height',
  'min-w': 'min-width',
  'p': 'padding',
  'stroke': 'stroke-width'
};

const mapCssName = function(key, prop) {
  if (prop === 'fontWeight') {
    return 'font-weight';
  }
  if (prop === 'stroke' && key === 'stroke') {
    return 'stroke';
  }

  if ((prop === 'textColor' || prop === undefined) && key === 'text') {
    return 'color';
  }

  if (cssKeys[key] !== undefined) {
    return cssKeys[key];
  }
  return key;
};

const mapPropName = function(key) {
  if (propKeys[key] !== undefined) {
    return propKeys[key];
  }
  return key;
};

/**
 * Create directories if they don't exist
 * @param  {array} arrPaths - the directory path(s)
 */
function createDirs(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const staticProps = `@mixin align-baseline {
  vertical-align: baseline;
}
@mixin align-top {
  vertical-align: top;
}
@mixin align-middle {
  vertical-align: middle;
}
@mixin align-bottom {
  vertical-align: bottom;
}
`;

/**
 * Generate sass mixins
 * @param {String} dest - The destination file path
 * @returns {Promise}
 */
function generateMixins(dest) {
  return new Promise((resolve, reject) => {
      const startTaskName = swlog.logTaskStart('creating sass mixins');
      const entries = Object.entries(uiConfigUplift.theme)
      let mixinData = '';

      for (let i = 0; i < entries.length; i++) {
        if (typeof entries[i][1] === 'function') {
          const prop = entries[i][1].toString().replace('theme => theme(\'', '').replace('\')', '');
          entries[i][1] = uiConfigUplift.theme[prop];
        }
        const name = mapPropName(entries[i][0]);

        if (!name || !entries[i][1] || name === 'text-color') {
          continue;
        }

        for (let key of Object.keys(entries[i][1])) {
          if (typeof entries[i][1][key] === 'object') {
            if (Array.isArray(entries[i][1][key])) {
              mixinData +=`@mixin ${mapPropName(entries[i][0])}-${mapPropName(key)} {
  ${mapCssName(name)}: ${entries[i][1][key]};
}
`;
              continue;
            }

            for (let key2 of Object.keys(entries[i][1][key])) {
              mixinData +=`@mixin ${mapPropName(entries[i][0])}-${mapPropName(key)}-${key2.padEnd(2, '0')} {
  ${mapCssName(name)}: ${entries[i][1][key][key2]};
}
`;
            }
            continue;
          }

          mixinData +=`@mixin ${mapPropName(entries[i][0])}-${mapPropName(key)} {
  ${mapCssName(name, entries[i][0])}: ${entries[i][1][key]};
}
`;
        }
      }

      mixinData += staticProps;

      createDirs(path.dirname(dest));
      fs.writeFile(dest, mixinData, (err) => {
          if (err) {
            reject(new Error(`Error during mixin creation ${err}`));
          } else {
            swlog.logTaskAction('Generated', `'${dest}'`);
            swlog.logTaskEnd(startTaskName);
            resolve();
          }
      });
  });
}

module.exports = generateMixins;
