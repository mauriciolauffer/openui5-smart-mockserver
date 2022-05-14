'use strict';

/*
 * ${copyright}
 */

sap.ui.define([
  'sap/ui/core/Core',
  'sap/ui/core/library'
],
/**
 * Module Dependencies
 *
 * @param {sap.ui.core.Core} Core - sap.ui.core.Core
 * @returns {object} openui5.smartmockserver library
 */
function(Core) {
  /**
   * OpenUI5 library: openui5.smartmockserver
   *
   * @namespace
   * @name openui5.smartmockserver
   * @author Mauricio Lauffer
   * @version ${version}
   * @public
   */
  Core.initLibrary({
    name: 'openui5.smartmockserver',
    dependencies: [
      'sap.ui.core'
    ],
    controls: [
      'openui5.smartmockserver.SmartMockServer'
    ],
    noLibraryCSS: true,
    version: '${version}'
  });

  return openui5.smartmockserver; // eslint-disable-line
});
