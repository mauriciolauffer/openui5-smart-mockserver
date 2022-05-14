'use strict';

module.exports = function(config) {
  require('./karma.conf')(config);
  config.set({
    ui5: {
      type: 'library',
      configPath: 'ui5-dist.yaml'
    },
    browsers: ['ChromeHeadless'],
    reporters: [...config.reporters, 'coveralls'],
    singleRun: true
  });
};
