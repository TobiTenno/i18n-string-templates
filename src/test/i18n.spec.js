import chai from 'chai';
// eslint-disable-next-line import/no-named-as-default,import/no-named-as-default-member,import/extensions
import use from '../index.js';

chai.should();

const mockLocales = {
  en: {
    sample: 'sample',
    '{0} against {1}': '{0} against {1}',
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
    const i18n = use(mockLocales, 'en');
    it('should return translated value when present', () => {
      (i18n`sample`).should.be.a('string').and.eq('sample');
      (i18n`${'grineer'} against ${'corpus'}`).should.eq('grineer against corpus');
    });
    it('should return passed value when not present', () => {
      (i18n`non-extant`).should.be.a('string').and.eq('non-extant');
      (i18n`${'grineer'} with ${'corpus'}`).should.eq('grineer with corpus');
      (i18n`${1} / ${1 / 3}`).should.eq('1 / 0.3333333333333333');
    });
  });
});
