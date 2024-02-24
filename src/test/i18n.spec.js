import * as chai from 'chai';

import use from 'i18n-string-templates';

chai.should();

const mockLocales = {
  en: {
    sample: 'sample',
    '{0} debates {1}': '{0} debattes {1}',
    '{0} / {1}': '{0} / {1}',
  },
  zh: {
    sample: '样本',
    '{0} debates {1}': '{0}与{1}辩论',
  },
};

describe('use', () => {
  it('should throw if no locale map is provided', () => {
    (() => {
      use();
    }).should.throw(TypeError, 'locales is required');
  });
  it('should not throw when valid parameters are passed', () => {
    (() => {
      use(mockLocales, 'en');
    }).should.not.throw();
  });
  it('should return function when called', () => {
    use(mockLocales, 'en').should.exist.and.be.a('function');
  });
  describe('with valid params', () => {
    const warnings = { untranslated: {} };
    const i18n = use(mockLocales, 'en', { warnings });
    afterEach(() => {
      warnings.untranslated = {};
    });
    it('should return translated value when present', () => {
      (i18n`${1} / ${1 / 3}:n(3)`).should.eq('1 / 0.333');
      (i18n`sample`).should.be.a('string').and.eq('sample');
      (i18n`${'grineer'}:s debates ${'corpus'}:s`).should.eq('grineer debattes corpus');
    });
    it('should support non-English', () => {
      const zh = use(mockLocales, 'zh');
      (zh`sample`).should.be.a('string').and.eq('样本');
      (zh`${'grineer'} debates ${'corpus'}:s`).should.eq('grineer与corpus辩论');
      (zh`non-extant`).should.be.a('string').and.eq('non-extant');
    });
    it('should return passed value when not present', () => {
      (i18n`non-extant`).should.be.a('string').and.eq('non-extant');
      (i18n`${'grineer'} with ${'corpus'}`).should.eq('grineer with corpus');
      warnings.should.be.an('object').and.have.key('untranslated');
      warnings.untranslated.should.be.an('object');

      Object.keys(warnings.untranslated).length.should.eq(2);
      warnings.untranslated['non-extant'].should.eq('non-extant');
    });
  });
});
