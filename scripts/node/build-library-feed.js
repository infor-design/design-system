#!/usr/bin/env node

/**
 * @fileoverview This script generates
 * an RSS feed for the Sketch Library
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------

const package = require('../../package.json');
const rss = require('rss');
const fs = require('fs');

const localFeedFile = 'site/sketch-library.rss';
const siteRoot = 'http://localhost/api/docs';
const feedName = 'ids-library.rss';
const siteDest = `${siteRoot}/${package.name}`;
const name = 'IDS UI Design Library';
const releaseUrl = `https://github.com/infor-design/design-system/releases/tag/${package.version}`
const libraryPath = 'sketch/theme-soho/ids-design-kit.sketch';

var feed = new rss({
  title: name,
  description: name,
  site_url: 'http://design.infor.com',
  // image_url: 'http://example.com/icon.png',
  // language: 'en',
  pubDate: new Date()
});

feed.item({
  title: name ,
  description: name,
  url: releaseUrl,
  date: new Date(),
  enclosure: {url: `${siteDest}/latest/` }
});

fs.writeFile(localFeedFile, feed.xml(), function(err) {
    if (err) {
        console.log(err);
    }
});
