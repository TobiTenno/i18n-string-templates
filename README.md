# i18n-string-templates

This package started as a module in several projects,   
becoming a standalone more out of a desire to not reproduce code as much as possible!

This module is a PureESM package,   
desiring to stay as current as possible in addition to maintaining maximum coverage & code exercise.

## Usage

There are 2 parameters:
- map of locales w/ string,string objects.
- locale you want to use right now

What this lets you do is feed in all of the values you use, maybe from a shareable json, shared config, or some sort of dynamically imported list.

Some things we support:
- Template replacement for dynamic labels
- Strings or Numbers being replaced
- Allows you to still "i18n" strings that aren't yet added to your list

Some goals:
- Staying as small as possible. I want to do this with no extraneous (or ideally no at all) dependencies.
- Keeping your experience consistent. As part of this, I leverage [semantic-release](https://github.com/semantic-release/semantic-release)
- 

Some things I want to add:
- adding a warning.json or some sort of shareable output for strings that have been run through the system that haven't been translated
- Even more coverage
- Anything the community needs to make your i18n experience easier!

Some examples are in the `src/test/i18n.spec.js` file.

Example:
```js
import use from 'i18n-string-templates';

const locales = {
  en: {
    sample: 'sample',
    '{0} debates {1}': '{}
  }
};

const i18n = use(locales, 'en');
console.log(i18n`sample`); // outputs: sample
console.log(i18n`${'joe'} debates ${'tom'}`); // outputs joe debates tom
console.log(i18n``)
```

## Requirements

- Node 14+
- You're using a Pure ESM package. You cannot `require()` this package.

## Super awesome badges

[![Actions](https://github.com/TobiTenno/i18n-string-templates/actions/workflows/ci.yaml/badge.svg)](https://github.com/TobiTenno/i18n-string-templates/actions/workflows/ci.yaml)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Coverage Status](https://coveralls.io/repos/github/TobiTenno/i18n-string-templates/badge.svg?branch=main)](https://coveralls.io/github/TobiTenno/i18n-string-templates?branch=main)
