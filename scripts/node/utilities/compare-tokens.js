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

const readJSONFile = file => {
  const data = fs.readFileSync(file, 'utf8');
  try {
    return JSON.parse(data);
  } catch(e) {
    console.error(e);
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

const showStats = (sohoTheme, otherThemes) => {
  let str = `\n  ${logSymbols.success} ${chalk.green(sohoTheme.props.length)} tokens in ${sohoTheme.file}`;

  for (let n = 0; n < otherThemes.length; n++) {
    const theme = otherThemes[n];
    const len = theme.props.length;

    if (len === sohoTheme.props.length) {
      str += `\n  ${logSymbols.success} ${chalk.green(len)} tokens in ${theme.file}`;
    } else {
      str += `\n  ${logSymbols.error} ${chalk.red(len)} tokens in ${theme.file}`;
    }
  }
  str += '\n';
  console.log(str);
};

module.exports = () => {
  const allObjects = [];

  return new Promise((resolve, reject) => {
    const files = glob.sync('./dist/tokens/web/theme-*.simple.json');

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

    Promise.all(promises)
      .then(res => {
        const sohoIdx = allObjects.findIndex((n, idx) => {
          return n.file.includes('theme-soho.simple.json');
        });
        const soho = allObjects.splice(sohoIdx, 1)[0];

        showStats(soho, allObjects);

        // Loop through all properties of the first theme
        for (let idx = 0; idx < allObjects[0].props.length; idx++) {
          const prop = allObjects[0].props[idx];

          // Loop through each theme data object and compare
          // the token in each position to make sure they match
          for (let n = 1; n < allObjects.length; n++) {
            let compareToProp = allObjects[n].props[idx].name.javascript;

            if (compareToProp !== prop.name.javascript) {
              return reject(msg(prop.name.javascript, allObjects[0].file, compareToProp, allObjects[n].file));
            }
          }
        }
        resolve();
    });
  });
};



