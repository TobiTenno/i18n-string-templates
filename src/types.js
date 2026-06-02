/**
 * @typedef {string} Locale locale identifier, typically following ISO 639-1
 */
/**
 * Key for an I18n matching pair
 * @typedef {string} I18nPairKey key for the matching pair, following the format of
 *  {x} for replacers, x being the index in the string
 *  {x}:s to force the replaced token to be treated as a string
 *  {x}:n to force the replaced token to be treated as a number
 */
/**
 * Locale for use with all translations in a bundle
 * @typedef {Record<string, string>} I18nPairs
 */
/**
 * Bundle of all locale values
 * @typedef {Record<Locale, I18nPairs>} I18nBundle
 */
/**
 * Warnings list for i18ns
 * @typedef {Object} I18nWarnings
 * @property {I18nPairs} untranslated object map of strings that are untranslated
 */
/**
 * Options object for the I18n constructor
 * @typedef {Object} I18nOptions
 * @property {I18nWarnings} [warnings]
 */

export {};
