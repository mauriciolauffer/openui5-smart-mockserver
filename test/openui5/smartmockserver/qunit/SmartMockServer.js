sap.ui.require([
  'jquery.sap.global',
  'sap/ui/core/util/MockServer',
  'openui5/smartmockserver/SmartMockServer',
  'sap/ui/thirdparty/sinon',
  'sap/ui/thirdparty/sinon-qunit'
], function($, MockServer, SmartMockServer) {
  'use strict';

  const entityNameWithoutSmartRules = 'Customer';
  const entityType = {'name':'Employee','properties':[{'schema':'Edm','type':'Int32','name':'EmployeeID'},{'schema':'Edm','type':'String','name':'LastName'},{'schema':'Edm','type':'String','name':'FirstName'},{'schema':'Edm','type':'String','name':'Title'},{'schema':'Edm','type':'String','name':'TitleOfCourtesy'},{'schema':'Edm','type':'DateTime','name':'BirthDate'},{'schema':'Edm','type':'DateTime','name':'HireDate'},{'schema':'Edm','type':'String','name':'Address'},{'schema':'Edm','type':'String','name':'City'},{'schema':'Edm','type':'String','name':'Region'},{'schema':'Edm','type':'String','name':'PostalCode'},{'schema':'Edm','type':'String','name':'Country'},{'schema':'Edm','type':'String','name':'HomePhone'},{'schema':'Edm','type':'String','name':'Extension'},{'schema':'Edm','type':'Binary','name':'Photo'},{'schema':'Edm','type':'String','name':'Notes'},{'schema':'Edm','type':'Int32','name':'ReportsTo'},{'schema':'Edm','type':'String','name':'PhotoPath'}],'keys':['EmployeeID']};

  function buildMockServer() {
    const mockServerUrl = '/';
    const mockServer = new SmartMockServer({ rootUri: mockServerUrl });

    SmartMockServer.config({
      autoRespond: true,
      autoRespondAfter: 1
    });

    return mockServer;
  }

  function getSmartRules() {
    return [{
      entityName: 'Employee',
      properties: [
        {
          name: 'FirstName',
          fakerMethod: 'name.firstName'
        },
        {
          name: 'Address',
          fakerMethod: 'address.streetAddress'
        }
      ]
    }];
  }

  function setSmartRulesToMockServer(mockServer) {
    mockServer.setSmartRules(getSmartRules());
  }

  function startMockServer(mockServer) {
    const metadataUrl = '../testdata/metadata.xml';
    mockServer.simulate(metadataUrl, { bGenerateMissingMockData: true });
    mockServer.start();
  }



  const { test } = QUnit;

  QUnit.module('SmartMockServer', function(hooks) {
    hooks.beforeEach(() => { this._mockserver = buildMockServer(); });
    hooks.afterEach(() => { this._mockserver.destroy(); });

    QUnit.module('constructor', () => {
      test('Should instantiate SmartMockServer', (assert) => {
        assert.deepEqual(this._mockserver instanceof MockServer, true);
      });
      test('Should start SmartMockServer', (assert) => {
        startMockServer(this._mockserver);
        assert.deepEqual(this._mockserver.isStarted(), true);
      });
    });

    QUnit.module('_generateDataFromEntityOriginal', () => {
      test('Should generate dumb mock data', (assert) => {
        const mockEntity = this._mockserver._generateDataFromEntityOriginal(entityType, 1);
        assert.deepEqual(mockEntity.Address, 'Address 1');
        assert.deepEqual(mockEntity.FirstName, 'FirstName 1');
      });
    });

    QUnit.module('_generateDataFromEntity', () => {
      test('Should generate smart mock data only for properties with Smart Rules assigned to', (assert) => {
        setSmartRulesToMockServer(this._mockserver);
        const mockEntity = this._mockserver._generateDataFromEntity(entityType, 1);
        assert.ok(mockEntity.Address);
        assert.ok(mockEntity.FirstName);
        assert.ok(mockEntity.Country);
        assert.notEqual(mockEntity.Address, 'Address 1');
        assert.notEqual(mockEntity.FirstName, 'FirstName 1');
        assert.deepEqual(mockEntity.Country, 'Country 1');
      });
    });

    test('Should generate dumb mock data because there are no Smart Rules', (assert) => {
      const mockEntity = this._mockserver._generateDataFromEntity(entityType, 1);
      assert.deepEqual(mockEntity.Address, 'Address 1');
      assert.deepEqual(mockEntity.FirstName, 'FirstName 1');
    });

    QUnit.module('_generateDataFromEntityWithSmartRules', () => {
      test('Should generate smart mock data only for properties with Smart Rules assigned to', (assert) => {
        setSmartRulesToMockServer(this._mockserver);
        const mockEntity = this._mockserver._generateDataFromEntityOriginal(entityType, 1);
        const smartMockEntity = this._mockserver._generateDataFromEntityWithSmartRules(entityType.name, mockEntity);
        assert.ok(smartMockEntity.Address);
        assert.ok(smartMockEntity.FirstName);
        assert.ok(mockEntity.Country);
        assert.notEqual(smartMockEntity.Address, 'Address 1');
        assert.notEqual(smartMockEntity.FirstName, 'FirstName 1');
        assert.deepEqual(mockEntity.Country, 'Country 1');
      });

      test('Should return the same received mock data', (assert) => {
        const mockEntity = this._mockserver._generateDataFromEntityOriginal(entityType, 1);
        const smartMockEntity = this._mockserver._generateDataFromEntityWithSmartRules(entityType.name, mockEntity);
        assert.deepEqual(smartMockEntity.Address, 'Address 1');
        assert.deepEqual(smartMockEntity.FirstName, 'FirstName 1');
      });
    });

    QUnit.module('_generatePropertyValueWithSmartRules', () => {
      test('Should return a value', (assert) => {
        setSmartRulesToMockServer(this._mockserver);
        const generatedValue = this._mockserver._generatePropertyValueWithSmartRules(entityType.name, 'Address');
        assert.ok(generatedValue);
        assert.notEqual(generatedValue, 'Address 1');
      });

      test('Should return an error', (assert) => {
        let errorRaised;
        try {
          this._mockserver._generatePropertyValueWithSmartRules(entityType.name, 'Country');

        } catch (err) {
          errorRaised = err;
        }
        assert.deepEqual(errorRaised instanceof Error, true);
        assert.deepEqual(errorRaised.toString(), 'TypeError: Cannot read property \'fakerMethod\' of undefined');
      });
    });

    QUnit.module('_getFakerValue', () => {
      test('Should instantiate the control', (assert) => {
        const generatedValue = this._mockserver._getFakerValue('name.firstName');
        assert.ok(generatedValue);
      });

      test('Should return an error', (assert) => {
        let errorRaised;
        const fakerMethodInvalid = 'name.ThisFakerMethodDoesNotExist';
        try {
          this._mockserver._getFakerValue(fakerMethodInvalid);

        } catch (err) {
          errorRaised = err;
        }
        assert.deepEqual(errorRaised instanceof Error, true);
        assert.deepEqual(errorRaised.toString(), 'Error: Invalid method: ' + fakerMethodInvalid);
      });
    });

    QUnit.module('_getSmartRulesEntity', () => {
      test('Should return undefined Smart Rules for an Entity without Smart Rules', (assert) => {
        const smartRules = this._mockserver._getSmartRulesEntity(entityNameWithoutSmartRules);
        assert.deepEqual(smartRules, undefined);
      });

      test('Should return Smart Rules assigned to an Entity', (assert) => {
        setSmartRulesToMockServer(this._mockserver);
        const smartRules = this._mockserver._getSmartRulesEntity(entityType.name);
        assert.deepEqual(smartRules, getSmartRules()[0]);
      });
    });

    QUnit.module('_getSmartRulesEntityProperty', () => {
      test('Should return Smart Rules assigned to an Entity Property', (assert) => {
        setSmartRulesToMockServer(this._mockserver);
        const smartRules = this._mockserver._getSmartRulesEntityProperty(entityType.name, 'Address');
        assert.deepEqual(smartRules, getSmartRules()[0].properties[1]);
      });

      test('Should return undefined Smart Rules for an Entity without Smart Rules', (assert) => {
        const smartRules = this._mockserver._getSmartRulesEntityProperty(entityNameWithoutSmartRules);
        assert.deepEqual(smartRules, undefined);
      });

      test('Should return undefined Smart Rules for an Entity Property without Smart Rules', (assert) => {
        const smartRules = this._mockserver._getSmartRulesEntityProperty(entityType.name, 'Country');
        assert.deepEqual(smartRules, undefined);
      });
    });

    QUnit.module('_hasSmartRulesEntity', () => {
      test('Should return true for an Entity with Smart Rules', (assert) => {
        setSmartRulesToMockServer(this._mockserver);
        const hasSmartRules = this._mockserver._hasSmartRulesEntity(entityType.name);
        assert.deepEqual(hasSmartRules, true);
      });

      test('Should return false for an Entity without Smart Rules', (assert) => {
        const hasSmartRules = this._mockserver._hasSmartRulesEntity(entityNameWithoutSmartRules);
        assert.deepEqual(hasSmartRules, false);
      });
    });

    QUnit.module('_hasSmartRulesEntityProperty', () => {
      test('Should return true for an Entity Property with Smart Rules', (assert) => {
        setSmartRulesToMockServer(this._mockserver);
        const hasSmartRules = this._mockserver._hasSmartRulesEntityProperty(entityType.name, 'Address');
        assert.deepEqual(hasSmartRules, true);
      });

      test('Should return false for an Entity Property without Smart Rules', (assert) => {
        const hasSmartRules = this._mockserver._hasSmartRulesEntityProperty(entityType.name, 'Country');
        assert.deepEqual(hasSmartRules, false);
      });
    });

    QUnit.module('setSmartRules', () => {
      //TODO
      test('Should instantiate the control', (assert) => {
        this._mockserver.setSmartRules(getSmartRules());
        assert.deepEqual(this._mockserver._smartRules instanceof Array, true);
      });
    });

  });
});
