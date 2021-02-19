#!/usr/bin/env node

/**
 * @fileoverview This script is used to compare the
 * different aspects of our design token structures,
 * specifically "props" and "aliases", to one another
 * ensuring all themes are equal.
 */

const fs = require('fs');
const glob = require('glob');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const swlog = require('./stopwatch-log.js');


const readJSONFile = file => {
  const data = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(data);
  } catch(e) {
    swlog.error(e);
  }
};

const msg = (orig, oFile, compare, cFile) => {
  let msg = `  ${logSymbols.error} ${chalk['red']('Error')}:`
  msg += ` Discrepancy found comparing ${chalk['red'](orig)}`;
  msg += ` (${oFile})`;
  msg += `  to ${chalk['red'](compare)}`;
  msg += ` (${cFile})\n`;
  return msg;
}

const showStats = (clasicTheme, otherThemes) => {
  let str = `\n  ${logSymbols.success} ${chalk.green(clasicTheme.props.length)} tokens in ${clasicTheme.file}`;

  for (let n = 0; n < otherThemes.length; n++) {
    const theme = otherThemes[n];
    const len = theme.props.length;

    if (len === clasicTheme.props.length) {
      str += `\n  ${logSymbols.success} ${chalk.green(len)} tokens in ${theme.file}`;
    } else {
      str += `\n  ${logSymbols.error} ${chalk.red(len)} tokens in ${theme.file}`;
    }
  }
  str += '\n';
  console.log(str);
};

/**
 * @param {String} distTokens - Glob path to built tokens files
 * @returns {Promise}
 */
function compareTokens(distTokens) {
  const startTask = swlog.logTaskStart(`verify ${distTokens} tokens`);
  const allObjects = [];
  const files = glob.sync(distTokens);

  const promises = files.map(f => {
    return new Promise((resolve, reject) => {
      if (obj = readJSONFile(f)) {
        allObjects.push({
          file: f,
          props: obj
        });
        resolve();
      } else {
        reject('Data not found in file.');
      }
    });
  });

  return Promise.all(promises)
    .then(() => {
      // Use classic as a base comparison
      const classicIdx = allObjects.findIndex((n, idx) => {
        return n.file.includes('theme-classic.simple.json');
      });

      // Keep from comparing classic to itself
      const classic = allObjects.splice(classicIdx, 1)[0];

      // Loop through all properties of the first theme
      for (let idx = 0; idx < allObjects[0].props.length; idx++) {
        const prop = allObjects[0].props[idx];

        // Loop through each theme data object and compare
        // the token in each position to make sure they match
        for (let n = 1; n < allObjects.length; n++) {
          let compareToProp = allObjects[n].props[idx].name.javascript;

          if (compareToProp !== prop.name.javascript) {
            console.error(msg(prop.name.javascript, allObjects[0].file, compareToProp, allObjects[n].file));
          }
        }
      }
      showStats(classic, allObjects);
      swlog.logTaskEnd(startTask);
    })
    .catch(console.error);
};

module.exports = compareTokens;
