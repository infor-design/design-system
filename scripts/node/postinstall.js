#!/usr/bin/env node

/**
 * @overview Logs messages about deprecations in the system
 */

// -------------------------------------
//   Constants/Variables
// -------------------------------------
const fs = require('fs');
const pkgjson = require('../../package.json');
const compareVersions = require('compare-versions');
const chalk = require('chalk');
const logSymbols = require('log-symbols');

/**
 * Whether or not the current version is
 * within the announcement's specified versions
 * @param {object} obj - An announcement object
 * @returns {boolean}
 */
const versionInRange = obj => {
  return compareVersions(pkgjson.version, obj.versionNotifyStart) !== -1
    && (obj.versionNotifyEnd === ''
      || compareVersions(pkgjson.version, obj.versionNotifyEnd)
    );
};

/**
 * Interpolates any self-referenced properties of the object
 * in the message property.
 * @param {object} obj - An announcement object
 * @returns {string}
 */
const parseMessage = obj => {
  let str = obj.message;
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key !== 'message') {
      str = str.replace(`{${key}}`, obj[key]);
    }
  }
  return str;
}

/**
 * Show and log announcements
 * @param {array[]} announcements
 * @param {string} announcements[].title - Title of the announcement
 * @param {string} announcements[].message - Message
 * @param {string} announcements[].versionNotifyStart - Valid semver string
 * @param {string} announcements[].versionNotifyEnd - Valid semver string
 * @param {boolean} announcements[].isCritical - Whether it is critical or not
 * @returns {string}
 */
 const showAnnouncements = (announcements) => {
  const warnings = [];
  const alerts = [];

  announcements.map(ann => {
    if (versionInRange(ann)) {
      const msg = parseMessage(ann);
      if (ann.isCritical) {
        alerts.push(`${logSymbols.error} ${chalk['red']('Alert')}: ${msg}`);
      } else {
        warnings.push(`${logSymbols.warning} ${chalk['yellow']('Warning')}: ${msg}`);
      }
    }
  });

  if (warnings.length + alerts.length > 0) {
    console.log(`\n${chalk['cyan']('Package "ids-identity" announcements...')}\n`);

    warnings.forEach(msg => {
      console.error(msg, '\n');
    });

    alerts.forEach(msg => {
      console.error(msg, '\n');
    });
  }
};

// -------------------------------------
//   Main
// -------------------------------------
const announcementsObj = JSON.parse(fs.readFileSync('./announcements.json', 'utf-8'));
showAnnouncements(announcementsObj);
