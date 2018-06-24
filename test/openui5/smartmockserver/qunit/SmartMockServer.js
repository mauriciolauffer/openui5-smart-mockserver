sap.ui.require([
  'jquery.sap.global',
  'sap/ui/core/util/MockServer',
  'openui5/smartmockserver/SmartMockServer',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function($, MockServer, SmartMockServer) {
  'use strict';

  const { test } = QUnit;

  QUnit.module('SmartMockServer', function() {
    QUnit.module('constructor', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(mockServer instanceof MockServer, true);
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_generateDataFromEntityOriginal', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_generateDataFromEntity', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_generateDataFromEntityWithSmartRules', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_generatePropertyValueWithSmartRules', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_getFakerValue', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_getSmartRulesEntity', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_getSmartRulesEntityProperty', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_hasSmartRulesEntity', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('_hasSmartRulesEntityProperty', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

    QUnit.module('setSmartRules', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        const mockServer = new SmartMockServer();
        assert.deepEqual(1, 0);
      });
    });

  });
});
