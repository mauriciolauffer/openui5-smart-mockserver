module.exports = function(config) {
  'use strict';

  require('./karma.conf')(config);
  config.set({
    browsers: ['ChromeHeadless'],
    reporters: ['progress', 'coverage', 'coveralls'],
    singleRun: true
  });
};
