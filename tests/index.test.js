/**
 * @jest-environment jsdom
 */

const fs = require('fs');

const { mozCompare, parseVersionPart } = require('../src');

const {
  VERSIONS_EQUALS,
  VERSIONS_LOWER_THAN,
  VERSIONS_GREATER_THAN,
} = require('./helpers');

describe(__filename, () => {
  describe('mozCompare', () => {
    it.each(VERSIONS_EQUALS)('returns 0 when %s == %s', (a, b) => {
      expect(mozCompare(a, b)).toEqual(0);
    });

    it.each(VERSIONS_LOWER_THAN)('returns -1 when %s < %s', (a, b) => {
      expect(mozCompare(a, b)).toEqual(-1);
    });

    it.each(VERSIONS_GREATER_THAN)('returns 1 when %s > %s', (a, b) => {
      expect(mozCompare(a, b)).toEqual(1);
    });

    it('should be exposed as window.mozCompare when loaded as a script tag', () => {
      const scriptEl = document.createElement('script');
      scriptEl.textContent = fs.readFileSync('./src/index.js');
      document.body.appendChild(scriptEl);

      expect(window.mozCompare).toBeDefined();
      expect(window.mozCompare('2', '1')).toEqual(1);
    });
  });

  describe('parseVersionPart', () => {
    it('parses 1-part versions', () => {
      expect(parseVersionPart('1')).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      });
    });

    it('parses 2-part versions', () => {
      expect(parseVersionPart('1pre')).toEqual({
        a: 1,
        b: 'pre',
        c: 0,
        d: 0,
      });
    });

    it('parses 3-part versions', () => {
      expect(parseVersionPart('5pre4')).toEqual({
        a: 5,
        b: 'pre',
        c: 4,
        d: 0,
      });
    });

    it('parses 3-part versions with a number', () => {
      expect(parseVersionPart('11pre4')).toEqual({
        a: 11,
        b: 'pre',
        c: 4,
        d: 0,
      });
    });

    it('parses 3-part versions with two numbers', () => {
      expect(parseVersionPart('567pre123')).toEqual({
        a: 567,
        b: 'pre',
        c: 123,
        d: 0,
      });
    });

    it('parses 3-part versions with two numbers and a negative number', () => {
      expect(parseVersionPart('-567pre123')).toEqual({
        a: -567,
        b: 'pre',
        c: 123,
        d: 0,
      });
    });

    it('parses 3-part versions with two negative numbers', () => {
      expect(parseVersionPart('-567pre-123')).toEqual({
        a: -567,
        b: 'pre',
        c: -123,
        d: 0,
      });
    });

    it('parses 5+ (for backward compatibility)', () => {
      // '+' has a special meaning.
      expect(parseVersionPart('5+')).toEqual({
        a: 6,
        b: 'pre',
        c: 0,
        d: 0,
      });
    });

    it('parses 1pre0', () => {
      expect(parseVersionPart('1pre0')).toEqual({
        a: 1,
        b: 'pre',
        c: 0,
        d: 0,
      });
    });

    it('parses 1pre1b', () => {
      expect(parseVersionPart('1pre1b')).toEqual({
        a: 1,
        b: 'pre',
        c: 1,
        d: 'b',
      });
    });

    it('parses 00', () => {
      expect(parseVersionPart('00')).toEqual({
        a: 0,
        b: 0,
        c: 0,
        d: 0,
      });
    });

    it('parses 01', () => {
      expect(parseVersionPart('01')).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      });
    });

    it('parses 001', () => {
      expect(parseVersionPart('001')).toEqual({
        a: 1,
        b: 0,
        c: 0,
        d: 0,
      });
    });

    it('parses 4-part versions', () => {
      expect(parseVersionPart('1pre1aa')).toEqual({
        a: 1,
        b: 'pre',
        c: 1,
        d: 'aa',
      });
    });

    it('parses -1', () => {
      expect(parseVersionPart('-1')).toEqual({
        a: -1,
        b: 0,
        c: 0,
        d: 0,
      });
    });

    it('parses 0+', () => {
      expect(parseVersionPart('0+')).toEqual({
        a: 1,
        b: 'pre',
        c: 0,
        d: 0,
      });
    });
  });
});
