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
   * @type {Object<string, Object<string, string>>}
   */
  #locales;
  /**
   * Locale string
   * @type {string}
   */
  #locale;
  /**
   * Locale bundle
   * @type {Object<string, string>}
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
   * @param {Object<string, Object<string, string>>} locales locale mapping
   * @param {string} locale locale
   * @param {Object} warnings warnings storage object
   */
  constructor(locales, locale, { warnings } = { warnings: { untranslated: {} } }) {
    if (!Object.keys(locales || {}).length) throw new TypeError('locales is required');
    this.#locales = locales;
    this.#locale = locale;
    this.#bundle = this.#locales[this.#locale];
    this.#warnings = warnings;
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
   * @returns {string}
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
 * @param {Object<string, Object<string, string>>} locales locale mapping
 * @param {string} locale locale
 * @param {Object} [options] additional options to pass to the translator
 * @returns {function} a string template function
 */
export default function use(locales, locale = 'en', options = {}) {
  const i18n = new I18n(locales, locale, options);
  return i18n.translate.bind(i18n);
}
