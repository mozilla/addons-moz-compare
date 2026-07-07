(function addonsMozCompare() {
  const compareParts = (partA, partB) => {
    if (partA === partB) {
      return 0;
    }

    return partA > partB ? 1 : -1;
  };

  // This isn't strictly a bytewise comparison but it has conditions that
  // `compareParts()` does not have.
  const compareByteWiseParts = (partA, partB) => {
    if (!partA) {
      return partB ? 1 : 0;
    }

    if (!partB) {
      return -1;
    }

    return compareParts(partA, partB);
  };

  const compareVersionParts = (versionPartA, versionPartB) => {
    // Parts A and C are compared as numbers.
    let retval = compareParts(versionPartA.a, versionPartB.a);

    if (retval !== 0) {
      return retval;
    }

    // Parts B and D are compared byte-wise.
    retval = compareByteWiseParts(versionPartA.b, versionPartB.b);

    if (retval !== 0) {
      return retval;
    }

    // Parts A and C are compared as numbers.
    retval = compareParts(versionPartA.c, versionPartB.c);

    if (retval !== 0) {
      return retval;
    }

    // Parts B and D are compared byte-wise.
    return compareByteWiseParts(versionPartA.d, versionPartB.d);
  };

  const parseVersionPart = (versionPart) => {
    // Each version part is itself parsed as a sequence of four parts:
    // <number-a><string-b><number-c><string-d>. Each of the parts is optional.
    // Numbers are integers base 10 (may be negative), strings are non-numeric
    // ASCII characters.

    // Missing version parts are treated as if they were 0.
    const parts = { a: 0, b: 0, c: 0, d: 0 };

    if (!versionPart) {
      return parts;
    }

    // If the version part is a single asterisk, it is interpreted as an
    // infinitely-large number.
    if (versionPart === '*') {
      parts.a = Infinity;

      return parts;
    }

    // number-a: the leading (optionally signed) integer.
    const numberA = /^[+-]?\d+/.exec(versionPart);
    parts.a = numberA ? parseInt(numberA[0], 10) : 0;

    const rest = versionPart.slice(numberA ? numberA[0].length : 0);

    // A '+' immediately following number-a increments it and sets string-b to
    // 'pre', to be compatible with the Firefox 1.0.x version format.
    if (rest[0] === '+') {
      parts.a += 1;
      parts.b = 'pre';

      return parts;
    }

    if (!rest) {
      return parts;
    }

    // string-b runs from here up to the start of number-c, i.e. the next digit
    // or the sign that introduces it.
    const numberCStart = /[0-9+-]/.exec(rest);

    if (!numberCStart) {
      // The remainder is entirely string-b; there is no number-c or string-d.
      parts.b = rest;

      return parts;
    }

    parts.b = numberCStart.index > 0 ? rest.slice(0, numberCStart.index) : 0;

    const afterB = rest.slice(numberCStart.index);

    // number-c: an optionally signed integer. It may consume no characters at
    // all (e.g. a lone sign), in which case it is treated as 0.
    const numberC = /^[+-]?\d+/.exec(afterB);
    parts.c = numberC ? parseInt(numberC[0], 10) : 0;

    // string-d: whatever remains after number-c.
    parts.d = numberC ? afterB.slice(numberC[0].length) || 0 : afterB;

    return parts;
  };

  /**
   * Compare two version strings according to
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version/format
   *
   * @param   versionA the first version
   * @param   versionB the second version
   * @returns -1 if A < B
   *           0 if A == B
   *           1 if A > B
   */
  const mozCompare = (versionA, versionB) => {
    if (typeof versionA !== 'string' || typeof versionB !== 'string') {
      throw new TypeError(
        `mozCompare() expects two strings but received (${typeof versionA}, ${typeof versionB}).`
      );
    }

    const partsA = versionA.split('.');
    const partsB = versionB.split('.');

    const maxParts = Math.max(partsA.length, partsB.length);

    // When two version strings are compared, their version parts are compared
    // left to right. An empty or missing version part is equivalent to 0.
    for (let i = 0; i < maxParts; i++) {
      const versionPartA = parseVersionPart(partsA[i]);
      const versionPartB = parseVersionPart(partsB[i]);

      const retval = compareVersionParts(versionPartA, versionPartB);

      if (retval !== 0) {
        return retval;
      }
    }

    return 0;
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      mozCompare,
      parseVersionPart,
    };
  } else if (typeof window !== 'undefined') {
    window.mozCompare = mozCompare;
  }
})();
