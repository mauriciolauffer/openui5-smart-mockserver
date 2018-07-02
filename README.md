# openui5-smart-mockserver
An extended and smarter version of UI5 MockServer for meaningful mock data.

OpenUI5 Smart MockServer uses the open source library Faker.js to generate better fake data for testing your app or for a demo.
You can use any available method in [Faker.js](https://github.com/marak/Faker.js/#api-methods).

Smart data can be automatically generated based on OData SAP Semantics Annotations. You don't need to code anything, just run Smart MockServer with a metadata.xml containing SAP Semantics Annotations.
In case your metadata.xml doesn't have SAP Semantics annotations, you can set Smart Rules manually mapping the OData property to a Faker.js method.


*Regular MockServer:* just a bunch of texts and numbers
[<img src="mockserver.png">](https://raw.githubusercontent.com/mauriciolauffer/openui5-smart-mockserver/master/mockserver.png)

*Smart MockServer:* meaningful data, better for tests and presentations to customer
[<img src="smartmockserver.png">](https://raw.githubusercontent.com/mauriciolauffer/openui5-smart-mockserver/master/smartmockserver.png)


## OData SAP Semantics Annotations
OData SAP Semantic Annotations tell which of the OData properties contain e.g. a phone number, a part of a name or address, or something related to a calendar event or an analytic query. This is important for apps running on mobile devices that want to seamlessly integrate into contacts, calendar, and telephony.
https://wiki.scn.sap.com/wiki/display/EmTech/SAP+Annotations+for+OData+Version+2.0#SAPAnnotationsforODataVersion2.0-Property_sap_semanticsAttributesap:semantics

Smart MockServer will generate data for these properties automatically, but not for all of them, have a look at the demo to see the supported *sap:semantics* annotations.


## Faker.js
For any references, please follow

Faker.js: https://github.com/marak/Faker.js

Faker.js methods: https://github.com/marak/Faker.js/#api-methods


## Demo
You can check out a live demo here:

https://cdn.rawgit.com/mauriciolauffer/openui5-smart-mockserver/master/demo/webapp/index.html


## Project Structure
* demo - Demo site for the library
* dist - Distribution folder that contains the library ready to use
* src  - Development folder
* test - Testing framework for the library


## Getting started

### Installation
Install openui5-smart-mockserver as an npm module
```sh
$ npm install openui5-smart-mockserver
```

### Configure manifest.json
Add the library to *sap.ui5/dependencies/libs* and set its path in *sap.ui5/resourceRoots* in your manifest.json file, as follows:

```json
{
  "sap.ui5": {
    "dependencies": {
      "libs": {
        "openui5.smartmockserver": {}
      }
    },
    "resourceRoots": {
      "openui5.smartmockserver": "./FOLDER_WHERE_YOU_PLACED_THE_LIBRARY/openui5/smartmockserver/"
    }
  }
}
```

### How to use
You use Smart MockServer just like you use your old MockServer!
Import openui5-smart-mockserver to your UI5 controller using *sap.ui.require* or  *sap.ui.define*:

```javascript
sap.ui.define([
    'openui5/smartmockserver/SmartMockServer'
  ], function (SmartMockServer) {
    'use strict';

    return {
      init: function() {
        const metadataUrl = 'local/path/to/the/file/metadata.xml';
        const mockServerUrl = 'odata/service/url';
        const mockServer = new SmartMockServer({ rootUri: mockServerUrl });

        // You only need to call this method in case your metadata.xml doesn't have sap:semantics annotations
        // and you want to create nice data for the OData property
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


      _getSmartRules: function() {
      //Here we define the smart rules for entity's properties
        const smartRules = []; //Smart rules must be an array with objects such as the following example
        smartRules.push({
          entityName: 'Employee', //Entity Name
          properties: [
            {
              name: 'FirstName', // Entity's property name
              fakerMethod: 'name.firstName' //Faker.js method which will be used for this property
            },
            {
              name: 'Address',
              fakerMethod: 'address.streetAddress'
            },
            {
              name: 'Phone',
              fakerMethod: 'phone.phoneNumber'
            },
            {
              name: 'Email',
              fakerMethod: 'internet.email'
            }
          ]
        });
        return smartRules;
      }
    };
  }
);
```


## Author
Mauricio Lauffer

 - LinkedIn: [https://www.linkedin.com/in/mauriciolauffer](https://www.linkedin.com/in/mauriciolauffer)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
