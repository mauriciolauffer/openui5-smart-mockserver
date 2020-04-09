/*
 * openui5-smart-mockserver
 * (c) Copyright 2018-2020 Mauricio Lauffer
 * Licensed under the MIT license. See LICENSE file in the project root for full license information.
 */

sap.ui.define([], function() {
  'use strict';

  /**
   * OpenUI5 library: openui5.smartmockserver
   *
   * @namespace
   * @name openui5.smartmockserver
   * @author Mauricio Lauffer
   * @version 0.2.9
   * @public
   */
  return sap.ui.getCore().initLibrary({
    name: 'openui5.smartmockserver',
    dependencies: [
      'sap.ui.core'
    ],
    controls: [
      'openui5.smartmockserver.SmartMockServer'
    ],
    noLibraryCSS: true,
    version: '0.2.9'
  });
});
