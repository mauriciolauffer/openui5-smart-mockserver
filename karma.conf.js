module.exports = function(config) {
  'use strict';

  config.set({
    frameworks: ['openui5', 'qunit'],
    openui5: {
      path: 'https://openui5.hana.ondemand.com/1.56.1/resources/sap-ui-core.js',
      useMockServer: false
    },
    client: {
      openui5: {
        config: {
          theme: 'sap_belize',
          language: 'EN',
          bindingSyntax: 'complex',
          compatVersion: 'edge',
          preload: 'async',
          libs: 'openui5.smartmockserver',
          resourceroots: {
            'openui5.smartmockserver': 'base/src/openui5/smartmockserver',
            'test.unit': 'base/test/openui5/smartmockserver/unit'
          }
        },
        tests: ['test/unit/allTests']
      },
      clearContext: false,
      qunit: {
        showUI: true,
        testTimeout: 20000, //20 secs
        autostart: false,
        noglobals: true
      }
    },
    files: [
      {
        pattern: 'src/**',
        included: false,
        served: true,
        watched: true
      },
      {
        pattern: 'test/openui5/smartmockserver/unit/**',
        included: false,
        served: true,
        watched: true
      },
      {
        pattern: 'test/openui5/smartmockserver/testdata/**',
        included: false,
        served: true,
        watched: true
      }
    ],
    proxies: {
      '/testdata/': '/base/test/openui5/smartmockserver/testdata/'
    },
    preprocessors: {
      'src/**/SmartMockServer.js': ['coverage']
    },
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
      check: {
        global: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90
        }
      }
    },
    autoWatch: true,
    useIframe: false,
    browsers: ['ChromeHeadless'],
    reporters: ['progress', 'coverage'],
    reportSlowerThan: 200,
    singleRun: false
  });
};
