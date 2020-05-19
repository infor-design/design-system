/*
 * Custom Transforms for Style Dictionary
 */

const fs = require('fs');
const _ = require('lodash');

module.exports = [
/**
   * Creates simple, flat json file for use in IDS website
   *
   * @example
   * ```json
   * [
   *   {
   *    "name": {
   *       "human": "",
   *       "sass": "",
   *       "javascript": ""
   *     },
   *     "value": "",
   *     "category": "",
   *     "type": "",
   *     "original": {
   *       "value": ""
   *     }
   *   }
   * ]
   * ```
   */
  {
    name: 'simple-json',
    formatter: _.template(fs.readFileSync(`${__dirname}/simple.json.template`))
  },

  /**
   * Creates a Mongoose-specific xml file
   *
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <tokens>
   *  <token>
   *   <name></name>
   *    <category></category>
   *    <type></type>
   *    <value></value>
   *  </token>
   * ```
   */
  {
    name: 'mongoose-xml',
    formatter: _.template(fs.readFileSync(`${__dirname}/mongoose.xml.template`))
  }
];
