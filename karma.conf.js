module.exports = function(config) {
  'use strict';

  config.set({
    frameworks: ['ui5'],
    ui5: {
      type: 'library'
    },
    proxies: {
      '/testdata/': '/base/test/openui5/smartmockserver/testdata/'
    },
    preprocessors: {
      'src/**/!(thirdparty)/*.js': ['coverage']
    },
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
      check: {
        global: {
          statements: 40,
          branches: 40,
          functions: 40,
          lines: 40
        }
      }
    },
    browsers: ['Chrome'],
    browserConsoleLogOptions: {
      level: 'error'
    },
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    useIframe: false,
    reporters: ['progress', 'coverage'],
    reportSlowerThan: 200,
    singleRun: false
  });
};
