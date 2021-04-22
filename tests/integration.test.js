const path = require('path');

const webdriver = require('selenium-webdriver');
const { Context } = require('selenium-webdriver/firefox');

// The geckodriver package downloads and installs geckodriver for us.  We use
// it by requiring it.
require('geckodriver');

const { ALL_VERSIONS } = require('./helpers');

describe(__filename, () => {
  jest.setTimeout(20000);

  it('should match the Firefox implementation', async () => {
    const driver = new webdriver.Builder().forBrowser('firefox').build();
    driver.setContext(Context.CHROME);

    function runComparisonInFirefox(args) {
      const { FileUtils } = Components.utils.import(
        'resource://gre/modules/FileUtils.jsm'
      );
      const { NetUtil } = Components.utils.import(
        'resource://gre/modules/NetUtil.jsm'
      );

      const allVersions = args[1];
      const callback = args[args.length - 1];
      const file = new FileUtils.File(args[0]);
      const scriptUri = NetUtil.newURI(file);

      Services.scriptloader.loadSubScript(scriptUri.spec, this);

      const results = [];
      for (const versions of allVersions) {
        const [a, b] = versions;

        let firefoxValue = Services.vc.compare(a, b);

        // Normalize values to only have -1, 1 or 0.
        if (firefoxValue < 0) {
          firefoxValue = -1;
        } else if (firefoxValue > 0) {
          firefoxValue = 1;
        }

        results.push({
          versions,
          mozCompare: mozCompare(a, b),
          firefox: firefoxValue,
        });
      }

      callback(results);
    }

    const results = await driver.executeAsyncScript(
      `(${runComparisonInFirefox})(arguments)`,
      path.join(__dirname, '..', 'src', 'index.js'),
      ALL_VERSIONS
    );

    expect.assertions(ALL_VERSIONS.length + 1);
    // Make sure we actually have versions.
    expect(ALL_VERSIONS).not.toHaveLength(0);

    for (const result of results) {
      // We pass `versions` so that it is displayed in the output in case of an
      // error.
      expect({
        versions: result.versions,
        value: result.mozCompare,
      }).toEqual({
        versions: result.versions,
        value: result.firefox,
      });
    }

    return driver.quit();
  });
});
