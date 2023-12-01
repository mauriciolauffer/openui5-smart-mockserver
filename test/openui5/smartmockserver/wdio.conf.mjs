export const config = {
  specs: [
    './**/*.test.js'
  ],

  capabilities: [{
    'browserName': 'chrome',
    'goog:chromeOptions': {
      args: ['headless', 'disable-gpu']
    }
  }],

  logLevel: 'error',
  framework: 'mocha',
  reporters: ['spec'],

  services: [
    'qunit',
    ['devtools', {
      coverageReporter: {
        enable: true,
        type: 'html',
        logDir: './coverage',
        exclude: ['/resources/', '/test/']
      }
    }]
  ],

  mochaOpts: {
    ui: 'bdd'
  }
};
