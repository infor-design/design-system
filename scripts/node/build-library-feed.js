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

const localFeedPath = 'site';
const localFeedFile = `${localFeedPath}/sketch-library.rss`;
const siteRoot = 'https://staging.design.infor.com/api/docs';
const feedName = 'ids-library.rss';
const siteDest = `${siteRoot}/${package.name}`;
const name = 'IDS UI Design Library';
const releaseUrl = `https://github.com/infor-design/design-system/releases/tag/${package.version}`
const libraryPath = 'sketch/theme-soho/ids-design-kit.sketch';
const stats = fs.statSync(libraryPath);
const fileSizeInBytes = stats.size;
const date = new Date();
const pubDate = date.toUTCString();

var feed = new rss({
  title: name,
  description: name,
  site_url: 'http://design.infor.com',
  // image_url: 'http://example.com/icon.png',
  // language: 'en',
  date: date,
});

feed.item({
  title: name ,
  description: name,
  image_url: 'https://placekitten.com/408/287',
  url: releaseUrl,
  guid: package.version,
  pubDate: pubDate,
  enclosure: {url: `${siteDest}/latest/${libraryPath}`, size: fileSizeInBytes, type: "application/octet-stream", sparkle:version="1"}
});

let xml = feed.xml()
xml = xml.replace ('<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">',
  '<rss xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0" xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle">');
xml = xml.replace('type="application/octet-stream"', `type="application/octet-stream" sparkle:version="${package.version}"`);

if (!fs.existsSync(localFeedPath)){
  fs.mkdirSync(localFeedPath, (err) => {
    if (err) throw err;
  });
}

fs.writeFile(localFeedFile, xml, function(err) {
    if (err) {
        console.log(err);
    }
});
