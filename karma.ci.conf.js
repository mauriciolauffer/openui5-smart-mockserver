module.exports = function(config) {
  'use strict';

  require('./karma.conf')(config);
  config.set({
    openui5: {
      path: 'https://openui5.hana.ondemand.com/1.56.4/resources/sap-ui-core.js',
      useMockServer: false
    },
    browsers: ['ChromeHeadless'],
    reporters: ['progress', 'coverage', 'coveralls'],
    singleRun: true
  });
};
