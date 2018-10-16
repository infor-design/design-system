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
const fs = require('fs');
const path = require('path');
const rename = require('rename');
const swlog = require('./stopwatch-log.js');
const yaml = require('js-yaml');
const glob = require('glob');

// -------------------------------------
//   Constants/Variables
// -------------------------------------

const top = [
  'font',
  'size',
  'color'
];

const states = [
  'active',
  'disabled',
  'readonly',
  'focus',
  'hover',
  'selected',
  'visited',
  'checked',
];

const subItems = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'unchecked',
  'checked'
];

const types = [
  'bg',
  'text',
  'border',
  'shadow',
  'fill',
  'padding'

];

const parseYml = file => {
  const data = fs.readFileSync(file, 'utf8');
  try {
    return yaml.load(data);
  } catch (e) {
    console.error(e);
  }
};

// Compares strings to an array
const checkForStr = (str, arr) => {
  let x
  arr.map(n => {
    if (str.includes(n)) {
      x = n;
    }
  });
  if (x === undefined) {
    return 'base';
  } else {
    if (x === 'bg') {
      x = 'background';
    }
  }
  return x;
};

// Remove "!" from old Alias variables
const cleanupVar = str => {
  return str.replace('!', '');
}

// Convert {!PALETTE_AZURE_6} to color.base.azure.06.value
const convertPalette = str => {
  str = str.toLowerCase();

  var inBrackets = str.match(/\{(.*?)\}/);
  if (inBrackets) {
    str = inBrackets[1];
  }
  arr = str.split('_');

  arr[0] = arr[0].replace('palette', 'color.base');

  if (arr.length === 3) {
    arr[2] += '0';
  }

  let newVar = `${arr.join('.')}.value`;
  if (inBrackets) {
    return `{${newVar}}`;
  }
  return newVar;
}

// Create the object from an array list of hierarchy
let lastKeyIndex = 0;
const createObj = (obj, keyPath, value) => {
  lastKeyIndex = keyPath.length - 1;
  for (var i = 0; i < lastKeyIndex; ++ i) {
    key = keyPath[i];
    if (!(key in obj))
      obj[key] = {}
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
};

const files = glob.sync('design-tokens/theme-soho/variants/dark/props/*.yml')

// -------------------------------------
//   Main
// -------------------------------------

const startTaskName = swlog.logTaskStart('Converting');

const promises = files.map(file => {

  return new Promise((resolve, reject) => {

    const newFile = rename(file, {
      basename: path.basename(file, '.yml'),
      extname: `.json`
    });

    const data = parseYml(file);
    const obj = {};

    for (const d in data.props) {

      const arr = d.split('-');

      let setupArr = [];

      setupArr.push(arr[0]);

      if (n = checkForStr(d, top)) {
        setupArr.push(n);
      }

      if (n = checkForStr(d, subItems)) {
        setupArr.push(n);
      }

      if (n = checkForStr(d, states)) {
        setupArr.push(n);
      }
      if (n = checkForStr(d, types)) {
        setupArr.push(n);
      }

      const val = {
        value: cleanupVar(data.props[d].value),
        deprecated: d
      };

      if (val.value.includes('PALETTE')) {
        val.value = convertPalette(val.value);
      }

      createObj(obj, setupArr, val);
    }

    fs.writeFile(newFile, JSON.stringify(obj, null, 4), (err) => {
      if (err) throw new Error(err);

      const f = path.parse(newFile);
      swlog.success(`${f.dir}/${f.base}`);
      resolve();
    });
  });
});

Promise.all(promises).then(() => {
  swlog.logTaskEnd(startTaskName);
}).catch(err => swlog.error(err));
