const typeInfoRegex = /^:([a-z])(\((.+)\))?/;
const stripType = (s) => s.replace(typeInfoRegex, '');

// Type suffixes (:n, :s) apply only to segments after ${} — not the leading static segment.
const stripTypeFromSegment = (segment, index) => (index === 0 ? segment : stripType(segment));

const buildKey = (strings) => {
  const lastIndex = strings.length - 1;
  const lastPartialKey = stripTypeFromSegment(strings.at(-1), lastIndex);
  const prependPartialKey = (memo, current, index) => `${stripTypeFromSegment(current, index)}{${index}}${memo}`;
  return strings.slice(0, -1).reduceRight(prependPartialKey, lastPartialKey);
};

const buildMessage = (str, ...values) => str.replace(/{(\d+)}/g, (_, index) => values[Number(index)]);

const extractTypeInfo = (str) => {
  const match = typeInfoRegex.exec(str);
  if (match) {
    return { type: match[1], options: match[3] };
  }
  return { type: 's', options: '' };
};

const defaultProps = { warnings: { untranslated: {} } };

class I18n {
  #locales;

  #locale;

  #bundle;

  #localizers;

  #warnings;

  constructor(locales, locale, { warnings = { untranslated: {} } } = defaultProps) {
    if (Object.keys(locales || {}).length === 0) throw new TypeError('locales is required');
    this.#locales = locales;
    this.#locale = locale;
    this.#bundle = this.#locales[this.#locale];
    this.#warnings = warnings;
    this.#localizers = {
      s: (v) => v.toLocaleString(this.#locale),
      n: (v, fractionalDigits) =>
        v.toLocaleString(this.#locale, {
          minimumFractionDigits: fractionalDigits,
          maximumFractionDigits: fractionalDigits,
        }),
    };
  }

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

  #localize(value, { type, options }) {
    return this.#localizers[type](value, options);
  }
}

/**
 * @param {import('./types.js').I18nBundle} locales locale mapping bundle
 * @param {import('./types.js').Locale} [locale] locale to use, defaults to 'en'
 * @param {import('./types.js').I18nOptions} [options] additional options
 * @returns {function(Array<string>, ...any): string} tagged template literal function
 */
export default function use(locales, locale = 'en', options = {}) {
  const i18n = new I18n(locales, locale, options);
  return i18n.translate.bind(i18n);
}
