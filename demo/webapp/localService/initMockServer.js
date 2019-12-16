sap.ui.require([
  'mlauffer/demo/openui5/smartmockserver/localService/mockserver',
], function(mockserver) {
  'use strict';

  mockserver.init();
  sap.ui.require(['sap/ui/core/ComponentSupport']);
});
