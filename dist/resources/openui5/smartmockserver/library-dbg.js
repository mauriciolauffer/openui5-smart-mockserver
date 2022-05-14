'use strict';

/*
 * openui5-smart-mockserver
 * (c) Copyright 2018-2022 Mauricio Lauffer
 * Licensed under the MIT license. See LICENSE file in the project root for full license information.
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
   * @version 0.3.1
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
    version: '0.3.1'
  });

  return openui5.smartmockserver; // eslint-disable-line
});
