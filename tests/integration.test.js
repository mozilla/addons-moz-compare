const webdriver = require('selenium-webdriver');
const { Context, ServiceBuilder } = require('selenium-webdriver/firefox');

const { mozCompare } = require('../src');
const { ALL_VERSIONS } = require('./helpers');

describe(__filename, () => {
  jest.setTimeout(20000);

  let driver;

  beforeAll(async () => {
    driver = await new webdriver.Builder()
      .forBrowser('firefox')
      // `--allow-system-access` is needed to run scripts in the chrome
      // context, which is where `Services` is available.
      .setFirefoxService(
        new ServiceBuilder().addArguments('--allow-system-access')
      )
      .build();
    await driver.setContext(Context.CHROME);
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
