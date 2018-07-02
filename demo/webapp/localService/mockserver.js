sap.ui.define([
    'jquery.sap.global',
    'openui5/smartmockserver/SmartMockServer',
    'mlauffer/demo/openui5/smartmockserver/Component'
  ], function ($, SmartMockServer, Component) {
    'use strict';

    /*
    In case your metadata.xml doesn't have sap:semantics annotations, you can set Smart Rules manually
    */
    function useSmartRulesDefinedManually(mockServer) {
      const smartRules = [{
        entityName: 'Employee', //Entity Name
        properties: [
          {
            name: 'PhotoPath', // Entity's property name
            fakerMethod: 'image.avatar' //Faker method which will be used for this property
          },
          {
            name: 'FirstName',
            fakerMethod: 'name.firstName'
          },
          {
            name: 'LastName',
            fakerMethod: 'name.lastName'
          },
          {
            name: 'Title',
            fakerMethod: 'name.title'
          },
          {
            name: 'Address',
            fakerMethod: 'address.streetAddress'
          },
          {
            name: 'Region',
            fakerMethod: 'address.stateAbbr'
          },
          {
            name: 'City',
            fakerMethod: 'address.city'
          },
          {
            name: 'PostalCode',
            fakerMethod: 'address.zipCode'
          },
          {
            name: 'Country',
            fakerMethod: 'address.countryCode'
          },
          {
            name: 'HomePhone',
            fakerMethod: 'phone.phoneNumber'
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
        const metadataUrl = $.sap.getModulePath(manifestApp.id) + '/' + mainDataSource.settings.localUri;
        const mockServerUrl = /.*\/$/.test(mainDataSource.uri) ? mainDataSource.uri : mainDataSource.uri + '/';
        const mockServer = new SmartMockServer({ rootUri: mockServerUrl });

        SmartMockServer.config({
          autoRespond: true,
          autoRespondAfter: 1
        });

        //In case your metadata.xml doesn't have sap:semantics annotations, you can set Smart Rules manually
        useSmartRulesDefinedManually(mockServer);

        mockServer.simulate(metadataUrl, {
          bGenerateMissingMockData: true
        });

        mockServer.start();
      }
    };
  }
);
