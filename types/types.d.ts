/**
 * locale identifier, typically following ISO 639-1
 */
export type Locale = string;
/**
 * key for the matching pair, following the format of
 *  {x} for replacers, x being the index in the string
 *  {x}:s to force the replaced token to be treated as a string
 *  {x}:n to force the replaced token to be treated as a number
 */
export type I18nPairKey = string;
/**
 * Locale for use with all translations in a bundle
 */
export type I18nPairs = Record<string, string>;
/**
 * Bundle of all locale values
 */
export type I18nBundle = Record<Locale, I18nPairs>;
/**
 * Warnings list for i18ns
 */
export type I18nWarnings = {
    /**
     * object map of strings that are untranslated
     */
    untranslated: I18nPairs;
};
/**
 * Options object for the I18n constructor
 */
export type I18nOptions = {
    warnings?: I18nWarnings | undefined;
};
