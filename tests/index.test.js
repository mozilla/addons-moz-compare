const { mozCompare, parseVersionPart } = require('../src');

describe(__filename, () => {
  describe('mozCompare', () => {
    it.each([
      ['1', '1'],
      ['1', '1.0'],
      ['1', '1.0.0'],
      ['1', '1.0.0.0'],
      ['1.', '1'],
      ['1.', '1.0'],
      ['1.', '1.0.0'],
      ['1.', '1.0.0.0'],
      ['1.0', '1.0.0'],
      ['1.0', '1.0.0.0'],
      ['1.1.00', '1.1.0'],
      ['1.0+', '1.1pre0'],
      ['1.1.0', '1.1'],
      ['1.1pre0', '1.1pre'],
    ])('returns 0 when %s == %s', (a, b) => {
      expect(mozCompare(a, b)).toEqual(0);
    });

    it.each([
      ['1.0+', '1.1.pre1a'],
      ['1.0', '1.1'],
      ['1.-1', '1'],
      ['1.0.0', '1.1a'],
      ['1.1a', '1.1aa'],
      ['1.1aa', '1.1ab'],
      ['1.1ab', '1.1b'],
      ['1.1b', '1.1c'],
      ['1.1c', '1.1pre'],
      ['1.0+', '1.1pre1a'],
      ['1.1pre1a', '1.1pre1aa'],
      ['1.1pre1aa', '1.1pre1b'],
      ['1.1pre1b', '1.1pre1'],
      ['1.1pre1', '1.1pre2'],
      ['1.1pre2', '1.1pre10'],
      ['1.1pre10', '1.1.-1'],
      ['1.1.-1', '1.1'],
      ['1.1.00', '1.10'],
      ['1.10', '1.*'],
      ['1.*', '1.*.1'],
      ['1.*.1', '2.0'],
      ['3.0.24', '24.0.3'],
      ['1.01.10', '1.001.100'],
    ])('returns -1 when %s < %s', (a, b) => {
      expect(mozCompare(a, b)).toEqual(-1);
    });

    it.each([
      ['1.001.100', '1.01.10'],
      ['24.0.3', '3.0.24'],
      ['2.0', '1.*.1'],
      ['1.*.1', '1.*'],
      ['1.*', '1.10'],
      ['1.10', '1.1.00'],
      ['1.1', '1.1.-1'],
      ['1.1.-1', '1.1pre10'],
      ['1.1pre10', '1.1pre2'],
      ['1.1pre2', '1.1pre1'],
      ['1.1pre1', '1.1pre1b'],
      ['1.1pre1b', '1.1pre1aa'],
      ['1.1pre1aa', '1.1pre1a'],
      ['1.1pre1a', '1.0+'],
      ['1.1pre', '1.1c'],
      ['1.1c', '1.1b'],
      ['1.1b', '1.1ab'],
      ['1.1ab', '1.1aa'],
      ['1.1aa', '1.1a'],
      ['1.1a', '1.0.0'],
      ['1', '1.-1'],
    ])('returns 1 when %s > %s', (a, b) => {
      expect(mozCompare(a, b)).toEqual(1);
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
