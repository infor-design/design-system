/*
 * Custom Transforms for Style Dictionary
 */

const fs = require('fs');
const _  = require('lodash');

module.exports = [
/**
   * Creates simple, flat json file for use in IDS website
   *
   * @example
   * ```json
   * [
   *   {
   *    "name": {
   *       "human": "Theme Color Palette Amber 10",
   *       "sass": "$theme-color-palette-amber-10",
   *       "javascript": "theme.color.palette.amber.10"
   *     },
   *     "value": "#fbe9bf",
   *     "category": "theme",
   *     "type": "color",
   *     "original": {
   *       "value": "#fbe9bf"
   *     }
   *   }
   * ]
   * ```
   */
  {
    name: 'simple-json',
    formatter: _.template(fs.readFileSync(__dirname + '/simple.json.template' ))
  },

/**
   * Creates a Mongoose-specific xml file
   *
   * @example
   * ```xml
   * <?xml version="1.0" encoding="UTF-8"?>
   * <tokens>
   *  <token>
   *   <name>theme-color-palette-amber-10</name>
   *    <category>theme</category>
   *    <type>color</type>
   *    <value>#fbe9bfff</value>
   *  </token>
   * ```
   */
  {
    name: 'mongoose-xml',
    formatter: _.template(fs.readFileSync(__dirname + '/mongoose.xml.template' ))
  }
];
