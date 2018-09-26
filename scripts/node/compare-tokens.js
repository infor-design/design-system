#!/usr/bin/env node

/**
 * @fileoverview This script is used to compare the
 * different aspects of our design token structures,
 * specifically "props" and "aliases", to one another
 * ensuring all themes are equal.
 */

const fs = require('fs');
const swlog = require('./utilities/stopwatch-log.js');
const yaml = require('js-yaml');

/**
 * Compare the keys of one object to another
 * @param {Object} a
 * @param {Object} b
 * @returns {Boolean}
 */
const compareKeys = (a, b) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

/**
 * Compare the keys of a certain property
 * @param {Object} a
 * @param {Object} b
 * @returns {Boolean}
 */
const compare = (a, b) => {
  if (a.hasOwnProperty('aliases')) {
    return compareKeys(a.aliases, b.aliases)
  } else {
    return compareKeys(a.props, b.props)
  }
};


const cleanUri = uri => {
  return uri.replace('./design-tokens/', '')
}

/**
 * Parse a yaml string into an Object
 * @param {String} data - A string of yaml
 * @returns {Object}
 */
const parseYml = file => {
  const data = fs.readFileSync(file, 'utf8');
  try {
    return yaml.load(data);
  } catch (e) {
    console.log(e);
  }
};

module.exports = (paths = []) => {
  if (paths.length === 0) {
    throw new Error('No files to compare.');
  }

  return new Promise((resolve, reject) => {
    let didErr = false;
    const themesData = paths.map(p => {
      return {
        path: p,
        data: parseYml(p)
      };
    });

    // Use the first item as the control structure
    const compareTo = themesData.splice(0, 1)[0];
    swlog.logTaskStart(`compare to "${cleanUri(compareTo.path)}"`);

    // Compare the other items against the control
    themesData.forEach(d => {
      if (compare(compareTo.data, d.data)) {
        swlog.success(cleanUri(d.path));
      } else {
        swlog.error(cleanUri(d.path));
        didErr = true;
      }
    });
    swlog.logTaskEnd(`compare to "${compareTo.path}"`);

    if (didErr) {
      throw new Error('Discrepancies were found with tokens/aliases. See above for details.');
    } else {
      resolve(1);
    }
  }).catch(err => {
    console.error(err);
    return 0;
  });
};



