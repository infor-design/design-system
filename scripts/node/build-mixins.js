#!/usr/bin/env node

/**
 * @overview Generates Sass Mixins From the Config File
 * metadata.json to dist/
 */
const fs = require('fs');
const path = require('path');

const swlog = require('./utilities/stopwatch-log.js');

// Dummy function to resolve the theme functions
global.theme = (property) => ({ theme: property });

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
  borderWidth: 'borderW',
  bottom: 'bottom',
  boxShadow: 'shadow',
  borderColor: 'borderC',
  bg: 'background-color',
  colResize: 'col-resize',
  eResize: 'e-resize',
  nsResize: 'ns-resize',
  ewResize: 'ew-resize',
  fontFamily: 'font',
  fontSize: 'text',
  fontWeight: 'font',
  left: 'left',
  letterSpacing: 'tracking',
  lineHeight: 'leading',
  listStyleType: 'list',
  margin: 'm',
  minHeight: 'min-h',
  minWidth: 'min-w',
  padding: 'p',
  placeholderOpacity: 'placeholder-opacity',
  position: 'position',
  rigth: 'right',
  spacing: 'm',
  strokeWidth: 'stroke',
  textColor: 'text',
  textOpacity: 'text-opacity',
  top: 'top',
  verticalAlign: 'align',
  width: 'w',
  zIndex: 'z',
};

const cssKeys = {
  'text-color': 'color',
  m: 'margin',
  bg: 'background-color',
  'bg-opacity': 'opacity',
  bottom: 'bottom',
  rounded: 'border-radius',
  right: 'right',
  borderC: 'border-color',
  borderW: 'border-width',
  shadow: 'box-shadow',
  top: 'top',
  text: 'font-size',
  font: 'font-family',
  tracking: 'letter-spacing',
  leading: 'line-height',
  left: 'left',
  list: 'list-style-type',
  'min-h': 'min-height',
  'min-w': 'min-width',
  p: 'padding',
  position: 'position',
  stroke: 'stroke-width',
  w: 'width',
  z: 'z-index'
};

const mapCssName = (key, prop) => {
  if (prop === 'fontWeight') {
    return 'font-weight';
  }
  if (prop === 'stroke' && key === 'stroke') {
    return 'stroke';
  }

  if ((prop === 'textColor' || prop === undefined) && key === 'text') {
    return 'color';
  }

  if (prop === 'borderColor' && key === 'border') {
    return 'border-color';
  }

  if (prop === 'borderWidth' && key === 'border') {
    return 'border-width';
  }

  if (cssKeys[key] !== undefined) {
    return cssKeys[key];
  }
  return key;
};

const mapKeyValue = (key) => {
  if (key.indexOf('--ids-') === 0) {
    return `var(${key})`;
  }

  return key;
};

const mapPropName = (key) => {
  if (key === 'borderColor') {
    return 'border';
  }
  if (key === 'borderWidth') {
    return 'border';
  }

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

function makeDirProps(name, entries) {
  let mixinData = '';
  const dProps = [
    { short: 'l', long: 'left' },
    { short: 'r', long: 'right' },
    { short: 't', long: 'top' },
    { short: 'b', long: 'bottom' },
    { short: 'x', long: 'left', long2: 'right' },
    { short: 'y', long: 'top', long2: 'bottom' }
  ];

  for (let i = 0; i < entries.length; i++) {
    for (let j = 0; j < dProps.length; j++) {
      if (dProps[j].short === 'x' || dProps[j].short === 'y') {
        mixinData += `@mixin ${name}${dProps[j].short}-${entries[i]} {
  ${name === 'm' ? 'margin-' : 'padding-'}${dProps[j].long}: ${entries[i]}px;
  ${name === 'm' ? 'margin-' : 'padding-'}${dProps[j].long2}: ${entries[i]}px;
}
`;
        continue;
      }
      mixinData += `@mixin ${name}${dProps[j].short}-${entries[i]} {
  ${name === 'm' ? 'margin-' : 'padding-'}${dProps[j].long}: ${entries[i]}px;
}
`;
    }
  }
  return mixinData;
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
@mixin antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
@mixin self-center {
  align-self: center;
}
@mixin text-uppercase {
  text-transform: uppercase;
}
@mixin text-lowercase {
  text-transform: lowercase;
}
@mixin text-capitalize {
  text-transform: capitalize;
}
@mixin border-solid {
  border-style: solid;
}
@mixin border-none {
  border-style: none;
}
@mixin block {
  display: block;
}
@mixin inline-flex {
  display: inline-flex;
}
@mixin outline-none {
  outline: 0;
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
    const entries = Object.entries(uiConfigUplift.theme);
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

      for (const key of Object.keys(entries[i][1])) {
        if (typeof entries[i][1][key] === 'object') {
          if (Array.isArray(entries[i][1][key])) {
            mixinData += `@mixin ${mapPropName(entries[i][0])}-${mapPropName(key)} {
  ${mapCssName(name)}: ${mapKeyValue(entries[i][1][key])};
}
`;
            continue;
          }

          for (const key2 of Object.keys(entries[i][1][key])) {
            mixinData += `@mixin ${mapPropName(entries[i][0])}-${mapPropName(key)}-${key2.padEnd(2, '0')} {
  ${mapCssName(name, entries[i][0])}: ${mapKeyValue(entries[i][1][key][key2])};
}
`;
          }
          continue;
        }

        mixinData += `@mixin ${mapPropName(entries[i][0])}${mapPropName(key) ? `-${mapPropName(key)}` : ''} {
  ${mapCssName(name, entries[i][0])}: ${mapKeyValue(entries[i][1][key])};
}
`;
      }

      if (name === 'm' || name === 'p') {
        mixinData += makeDirProps(name, Object.keys(entries[i][1]));
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
