const path = require('path');

const webdriver = require('selenium-webdriver');
const { Context } = require('selenium-webdriver/firefox');

// The geckodriver package downloads and installs geckodriver for us.  We use
// it by requiring it.
require('geckodriver');

const { mozCompare } = require('../src');
const { ALL_VERSIONS } = require('./helpers');

describe(__filename, () => {
  jest.setTimeout(20000);

  let driver;

  beforeAll(() => {
    driver = new webdriver.Builder().forBrowser('firefox').build();
    driver.setContext(Context.CHROME);
  });

  afterAll(() => {
    return driver.quit();
  });

  it('should have versions to test', () => {
    expect(ALL_VERSIONS).not.toHaveLength(0);
  });

  it.each(ALL_VERSIONS)(
    'matches Firefox Services.vc.compare("%s", "%s")',
    async (a, b) => {
      let fxVcCompare = await driver.executeScript(
        `return Services.vc.compare("${a}", "${b}");`
      );

      if (fxVcCompare < 0) {
        fxVcCompare = -1;
      } else if (fxVcCompare > 0) {
        fxVcCompare = 1;
      }

      expect(mozCompare(a, b)).toEqual(fxVcCompare);
    }
  );
});
