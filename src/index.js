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
 * Locale for use with all of th
 * @typedef {Object<I18nPairKey, string>} I18nPairs
 */
/**
 * Bundle of all locale values
 * @typedef {Object<Locale, I18nPairs>} I18nBundle
 */
/**
 * Warnings list for i18ns
 * @typedef {Object} I18nWarnings
 * @property {I18nPairs} untranslated object map of strings that are untranslated
 */
/**
 * Options object for the I18n constructor
 * @typedef {Object} I18nOptions
 * @property {I18nWarnings} warnings
 */

/**
 * Regex for extracting type information for a replacement
 * @type {RegExp}
 */
const typeInfoRegex = /^:([a-z])(\((.+)\))?/;
// e.g. I18n._buildKey(['', ' has ', ':c in the']) == '{0} has {1} in the bank'
const buildKey = (strings) => {
  const stripType = s => s.replace(typeInfoRegex, '');
  const lastPartialKey = stripType(strings[strings.length - 1]);
  const prependPartialKey = (memo, curr, i) => `${stripType(curr)}{${i}}${memo}`;

  return strings.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
};
// e.g. I18n._formatStrings('{0} {1}!', 'hello', 'world') == 'hello world!'
const buildMessage = (str, ...values) => str.replace(/{(\d)}/g, (_, index) => values[Number(index)]);

const extractTypeInfo = (str) => {
  const match = typeInfoRegex.exec(str);
  if (match) {
    return { type: match[1], options: match[3] };
  }
  return { type: 's', options: '' };
};

/**
 * Implementation and refactor of https://jaysoo.ca/2014/03/20/i18n-with-es2015-template-literals/
 * all credit to original author
 */
class I18n {
  /**
   * Locale map
   * @type {I18nBundle}
   */
  #locales;
  /**
   * Locale string
   * @type {Locale}
   */
  #locale;
  /**
   * Locale bundle
   * @type {I18nPairs}
   */
  #bundle;
  /**
   * Object of localizer functions
   * @type {Object<string, function>}
   */
  #localizers;
  /**
   * Object of warnings
   * @type {Object}
   * @property {Object<string, string>} untranslated untranslated strings
   */
  #warnings;

  /**
   * Make an I18n instance
   * @param {I18nBundle} locales locale mapping
   * @param {Locale} locale locale
   * @param {I18nWarnings} warnings warnings storage object
   */
  constructor(locales, locale, { warnings = { untranslated: {} } }
  = { warnings: { untranslated: {} } }) {
    if (!Object.keys(locales || {}).length) throw new TypeError('locales is required');
    this.#locales = locales;
    this.#locale = locale;
    this.#bundle = this.#locales[this.#locale];
    this.#warnings = warnings;
    /**
     * @type {Object<string, function>}
     */
    this.#localizers = {
      s /* string */: v => v.toLocaleString(this.#locale),
      n /* number */: (v, fractionalDigits) => (
        v.toLocaleString(this.#locale, {
          minimumFractionDigits: fractionalDigits,
          maximumFractionDigits: fractionalDigits,
        })
      ),
    };
  }

  /**
   * Translate a template string to values, a string template function
   * @param {Array<string>} strings in-between bits
   * @param {Array<string>} values parts to localise
   * @returns {string} a translated string
   */
  translate(strings, ...values) {
    const translationKey = buildKey(strings);
    const translationString = this.#bundle[translationKey];

    if (translationString) {
      const typeInfoForValues = strings.slice(1).map(extractTypeInfo);
      const localizedValues = values.map((v, i) => this.#localize(v, typeInfoForValues[i]));
      return buildMessage(translationString, ...localizedValues);
    }
    this.#warnings.untranslated[translationKey] = translationKey;
    return buildMessage(translationKey, ...values);
  }

  /**
   * run the localization on the string
   * @param {string} value value to localize
   * @param {string} type which of the localizer types it is
   * @param {*} options params for localizer function
   * @returns {Array<string>}
   */
  #localize(value, { type, options }) {
    return this.#localizers[type](value, options);
  }
}

/**
 * Make a translator with provided locale mapping, and an instance using the desired locale
 * @param {I18nBundle} locales locale mapping bundle
 * @param {Locale} locale locale to be used for this instance, defaults to 'en'
 * @param {I18nOptions} [options] additional options to pass to the translator
 * @returns {function} a tagged template literal function
 */
export default function use(locales, locale = 'en', options = {}) {
  const i18n = new I18n(locales, locale, options);
  return i18n.translate.bind(i18n);
}
