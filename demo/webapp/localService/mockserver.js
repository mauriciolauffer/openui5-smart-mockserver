sap.ui.define([
    'jquery.sap.global',
    'openui5/smartmockserver/SmartMockServer',
    'mlauffer/demo/openui5/smartmockserver/Component'
  ], function ($, SmartMockServer, Component) {
    'use strict';

    return {
      init: function() {
        const manifestApp = Component.getMetadata().getManifestEntry('sap.app');
        const mainDataSource = manifestApp.dataSources['NORTHWIND'];
        const metadataUrl = $.sap.getModulePath(manifestApp.id) + '/' + mainDataSource.settings.localUri;
        const mockServerUrl = /.*\/$/.test(mainDataSource.uri) ? mainDataSource.uri : mainDataSource.uri + '/';
        const mockServer = new SmartMockServer({ rootUri: mockServerUrl });

        // This is where everything starts.
        // It's the only extra method you need to call to have meaningful mock data.
        // That's it!
        mockServer.setSmartRules(this._getSmartRules());

        SmartMockServer.config({
          autoRespond: true,
          autoRespondAfter: 1
        });

        mockServer.simulate(metadataUrl, {
          bGenerateMissingMockData: true
        });

        mockServer.start();
      },


      /*
      Here we define the rules for entity's properties.
      The rules are based on Faker.js methods
       */
      _getSmartRules: function() {
        const smartRules = [];
        smartRules.push({
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
        });
        return smartRules;
      }
    };
  }
);
