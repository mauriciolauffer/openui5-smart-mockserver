module.exports = function(config) {
  'use strict';

  require('./karma.conf')(config);
  config.set({
    ui5: {
      url: 'https://openui5.hana.ondemand.com/1.61.2',
    },
    browsers: ['ChromeHeadless'],
    reporters: ['progress', 'coverage', 'coveralls'],
    singleRun: true,
  });
};
