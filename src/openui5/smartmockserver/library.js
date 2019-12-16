/*
 * ${copyright}
 */

sap.ui.define([], function() {
  'use strict';

  /**
   * OpenUI5 library: openui5.smartmockserver
   *
   * @namespace
   * @name openui5.smartmockserver
   * @author Mauricio Lauffer
   * @version ${version}
   * @public
   */
  return sap.ui.getCore().initLibrary({
    name: 'openui5.smartmockserver',
    dependencies: [
      'sap.ui.core',
    ],
    controls: [
      'openui5.smartmockserver.SmartMockServer',
    ],
    noLibraryCSS: true,
    version: '${version}',
  });
});
