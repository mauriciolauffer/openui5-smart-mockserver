'use strict';

sap.ui.define([
  'openui5/smartmockserver/SmartMockServer',
  'mlauffer/demo/openui5/smartmockserver/Component'
], function(SmartMockServer, Component) {
  /*
    In case your metadata.xml doesn't have sap:semantics annotations, you can set Smart Rules manually
    */
  /**
   *
   * @param mockServer
   */
  function useSmartRulesDefinedManually(mockServer) {
    const smartRules = [{
      entityName: 'Employee', // Entity Name
      properties: [
        {
          name: 'PhotoPath', // Entity's property name
          fakerMethod: 'image.avatar' // Faker method which will be used for this property
        },
        {
          name: 'FirstName',
          fakerMethod: 'person.firstName'
        },
        {
          name: 'LastName',
          fakerMethod: 'person.lastName'
        },
        {
          name: 'Title',
          fakerMethod: 'person.prefix'
        },
        {
          name: 'Address',
          fakerMethod: 'location.streetAddress'
        },
        {
          name: 'Region',
          fakerMethod: 'location.state'
        },
        {
          name: 'City',
          fakerMethod: 'location.city'
        },
        {
          name: 'PostalCode',
          fakerMethod: 'location.zipCode'
        },
        {
          name: 'Country',
          fakerMethod: 'location.countryCode'
        },
        {
          name: 'HomePhone',
          fakerMethod: 'phone.number'
        },
        {
          name: 'Notes',
          fakerMethod: 'internet.email'
        }
      ]
    }];
      // It's the only extra method you need to call to have meaningful mock data
      // for fields without OData SAP Semantics (sap:semantics)
    mockServer.setSmartRules(smartRules);
  }

  return {
    init: function() {
      const manifestApp = Component.getMetadata().getManifestEntry('sap.app');
      const mainDataSource = manifestApp.dataSources['NORTHWIND'];
      const metadataUrl = sap.ui.require.toUrl('mlauffer/demo/openui5/smartmockserver/') + mainDataSource.settings.localUri;
      const mockServerUrl = /.*\/$/.test(mainDataSource.uri) ? mainDataSource.uri : mainDataSource.uri + '/'; // eslint-disable-line sonarjs/slow-regex
      const mockServer = new SmartMockServer({rootUri: mockServerUrl});

      SmartMockServer.config({
        autoRespond: true,
        autoRespondAfter: 1
      });

      // In case your metadata.xml doesn't have sap:semantics annotations, you can set Smart Rules manually
      useSmartRulesDefinedManually(mockServer);

      mockServer.simulate(metadataUrl, {
        bGenerateMissingMockData: true
      });

      mockServer.start();
    }
  };
}
);
