'use strict';

/*
 * ${copyright}
 */

sap.ui.define([
  'sap/ui/core/Lib',
  'sap/ui/core/library'
],
/**
 * Module Dependencies
 * @param {sap.ui.core.Lib} Lib - sap.ui.core.Lib
 * @returns {object} openui5.smartmockserver library
 */
function(Lib) {
  (async () => {
    // const url = `${sap.ui.require.toUrl('openui5/smartmockserver')}/thirdparty/faker/index.mjs`;
    const url = `${sap.ui.require.toUrl('openui5/smartmockserver')}/thirdparty/faker/locale/en.mjs`;
    const {faker} = await import(url); // eslint-disable-line no-unsanitized/method
    library.faker = faker;
  })();

  /**
   * OpenUI5 library: openui5.smartmockserver
   * @namespace
   * @name openui5.smartmockserver
   * @author Mauricio Lauffer
   * @version ${version}
   * @public
   */
  const library = Lib.init({
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


  /*
  Mapping between SAP Semantics annotations and Faker methods
  https://wiki.scn.sap.com/wiki/display/EmTech/SAP+Annotations+for+OData+Version+2.0#SAPAnnotationsforODataVersion2.0-Property_sap_semanticsAttributesap:semantics
   */
  library.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING = [
    {
      sapSemantics: 'city',
      fakerMethod: 'location.city'
    },
    {
      sapSemantics: 'country',
      fakerMethod: 'location.country'
    },
    {
      sapSemantics: 'geo-lat',
      fakerMethod: 'location.latitude'
    },
    {
      sapSemantics: 'geo-lon',
      fakerMethod: 'location.longitude'
    },
    {
      sapSemantics: 'region',
      fakerMethod: 'location.state'
    },
    {
      sapSemantics: 'street',
      fakerMethod: 'location.streetAddress'
    },
    {
      sapSemantics: 'zip',
      fakerMethod: 'location.zipCode'
    },
    {
      sapSemantics: 'org',
      fakerMethod: 'company.name'
    },
    {
      sapSemantics: 'currency-code',
      fakerMethod: 'finance.currencyCode'
    },
    {
      sapSemantics: 'photo',
      fakerMethod: 'image.avatar'
    },
    {
      sapSemantics: 'bcc',
      fakerMethod: 'internet.email', //eslint-disable-line
    },
    {
      sapSemantics: 'cc',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'email',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'from',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'sender',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'to',
      fakerMethod: 'internet.email'
    },
    {
      sapSemantics: 'url',
      fakerMethod: 'internet.url'
    },
    {
      sapSemantics: 'body',
      fakerMethod: 'lorem.paragraphs'
    },
    {
      sapSemantics: 'subject',
      fakerMethod: 'lorem.sentence'
    },
    {
      sapSemantics: 'name',
      fakerMethod: 'person.fullName'
    },
    {
      sapSemantics: 'givenname',
      fakerMethod: 'person.firstName'
    },
    {
      sapSemantics: 'middlename',
      fakerMethod: 'person.firstName'
    },
    {
      sapSemantics: 'title',
      fakerMethod: 'person.jobTitle'
    },
    {
      sapSemantics: 'familyname',
      fakerMethod: 'person.lastName'
    },
    {
      sapSemantics: 'honorific',
      fakerMethod: 'person.prefix'
    },
    {
      sapSemantics: 'suffix',
      fakerMethod: 'person.suffix'
    },
    {
      sapSemantics: 'tel',
      fakerMethod: 'phone.number'
    }
  ];

  return library;
});
