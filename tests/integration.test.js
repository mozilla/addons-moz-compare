const path = require('path');

const webdriver = require('selenium-webdriver');
const { Context } = require('selenium-webdriver/firefox');

// The geckodriver package downloads and installs geckodriver for us.  We use
// it by requiring it.
require('geckodriver');

describe(__filename, () => {
  jest.setTimeout(20000);

  it('should match the Firefox implementation', async () => {
    const driver = new webdriver.Builder().forBrowser('firefox').build();
    driver.setContext(Context.CHROME);

    const results = await driver.executeAsyncScript(
      `
      let { FileUtils } = Components.utils.import('resource://gre/modules/FileUtils.jsm');
      let { NetUtil } = Components.utils.import('resource://gre/modules/NetUtil.jsm');

      let callback = arguments[arguments.length - 1];
      let file = new FileUtils.File(arguments[0]);
      let scriptUri = NetUtil.newURI(file);

      Services.scriptloader.loadSubScript(scriptUri.spec, this);

      const results = [];

      for (const versions of [
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
      ]) {
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
      `,
      path.join(__dirname, '..', 'src', 'index.js')
    );

    expect(results).not.toHaveLength(0);

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
