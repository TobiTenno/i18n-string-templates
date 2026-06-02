/**
 * @param {import('./types.js').I18nBundle} locales locale mapping bundle
 * @param {import('./types.js').Locale} [locale] locale to use, defaults to 'en'
 * @param {import('./types.js').I18nOptions} [options] additional options
 * @returns {function(Array<string>, ...any): string} tagged template literal function
 */
export default function use(locales: import("./types.js").I18nBundle, locale?: import("./types.js").Locale, options?: import("./types.js").I18nOptions): (arg0: Array<string>, ...args: any[]) => string;
