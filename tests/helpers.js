const VERSIONS_EQUALS = [
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
  ['100', '100.0'],
  ['100.0.0', '100'],
  ['100.0.00', '100.0.0.0'],
  ['567pre0', '567pre'],
  ['567pre0', '566+'],
  // FIXME: should be equal (it is when using Firefox's Services.vc.compare())
  // but mozCompare() currently returns 1.
  // ['1.0resigned0', '1.0resigned'],
];

const VERSIONS_LOWER_THAN = [
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
  ['99.99.99.99', '100'],
  ['1.0resigned', '1.0'],
  ['1.0resigned1', '1.0'],
];

const VERSIONS_GREATER_THAN = [
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
  ['101', '100.99.99.99'],
  ['100.100', '100.99'],
  ['567pre1', '567pre0'],
  ['1.1resigned1', '1.0'],
  ['1.1resigned2', '1.1resigned1'],
  ['1.1resigned10', '1.1resigned1'],
  ['10resigned1', '9'],
  ['10resigned2', '10resigned1'],
  ['9.26.2resigned1', '9.26.1'],
  ['9.26.2resigned2', '9.26.2resigned1'],
  ['1.20240327.51resigned1bedbcf', '1.20240327.50master-2bedbcf'],
  ['1.20240327.51resigned2bedbcf', '1.20240327.51resigned1bedbcf'],
  ['1.20240327.51resigned2bedbcf', '1.20240327.50master-2bedbcf'],
  ['1.1.1resigned1', '1.1.0beta1'],
  ['1.1.1resigned2', '1.1.1resigned1'],
  ['1.0resigned1', '1.0resigned0'],
  ['1.0', '1.0resigned'],
];

const ALL_VERSIONS = [
  ...VERSIONS_EQUALS,
  ...VERSIONS_LOWER_THAN,
  ...VERSIONS_GREATER_THAN,
];

module.exports = {
  ALL_VERSIONS,
  VERSIONS_EQUALS,
  VERSIONS_LOWER_THAN,
  VERSIONS_GREATER_THAN,
};
