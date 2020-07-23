QUnit.config.autostart = false;
QUnit.config.reorder = false;

sap.ui.getCore().attachInit(function() {
  'use strict';

  sap.ui.require([
    'test/unit/allTests'
  ], function() {
    if (window.blanket) {
      window.blanket.options('sap-ui-cover-only', 'openui5/smartmockserver');
      window.blanket.options('sap-ui-cover-never', 'openui5/smartmockserver/thirdparty');
    }

    QUnit.start();
  });
});
