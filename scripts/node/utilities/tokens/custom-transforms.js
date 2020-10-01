/*
 * Custom Transforms for Style Dictionary
 */

const tinyColor = require('tinycolor2');

function isFontSize(prop) {
  const isThemeFontSize = prop.attributes.type === 'font' && prop.attributes.item === 'size';
  const isComponentFontSize = prop.attributes.type === 'size' && prop.attributes.item === 'font';
  return isThemeFontSize || isComponentFontSize;
}

module.exports = [
  /**
   * Transforms the value into an 8-digit hex string
   * with the alpha channel at the beginning
   *
   * ```js
   * // Returns:
   * "#ff009688"
   * ```
   */
  {
    name: 'mongoose:color/hex8android',
    type: 'value',
    matcher: (prop) => prop.attributes.type === 'color',
    transformer: (prop) => {
      const str = tinyColor(prop.value).toHex8();
      return `#${str.slice(6)}${str.slice(0, 6)}`;
    },
  },

  /**
   * Convers our base 10 rem to an integer
   *
   * ```js
   * // Given:
   * "1.6rem"
   * // Returns:
   * "16"
   * ```
   */
  {
    name: 'mongoose:size/remToInt',
    type: 'value',
    matcher: isFontSize,
    transformer: (prop) => {
      if (prop.value.endsWith('rem')) {
        const res = parseFloat(prop.value, 10) * 10;
        return res === 'NaN' ? prop.value : `${res}`;
      }
      return prop.value;
    },
  },
];
