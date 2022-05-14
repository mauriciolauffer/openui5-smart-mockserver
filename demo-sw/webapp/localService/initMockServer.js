'use strict';

sap.ui.require([
  'sap/base/Log',
  'mlauffer/demo/openui5/smartmockserver/localService/mockserver'
],
/**
 * @param {typeof sap.base.Log} Log
 * @param {object} mockserver
 */
function(Log, mockserver) {
  mockserver.init()
      .then(function() {
        Log.info('SmartMockServer has been initiated!');
      })
      .catch(function(err) {
        Log.error(err);
      })
      .then(function() {
        sap.ui.require(['sap/ui/core/ComponentSupport']);
      });
});
