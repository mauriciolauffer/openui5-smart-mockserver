export const config = {
  specs: ['./**/*.test.js'],

  capabilities: [
    {
      'browserName': 'chrome',
      'browserVersion': 'stable',
      'goog:chromeOptions': {
        args: ['headless', 'disable-gpu', 'window-size=1024,768', 'no-sandbox']
      }
    }
  ],

  logLevel: 'warn',
  framework: 'mocha',
  reporters: ['spec'],
  waitforTimeout: 90000,

  services: ['qunit'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 90000
  }
};
