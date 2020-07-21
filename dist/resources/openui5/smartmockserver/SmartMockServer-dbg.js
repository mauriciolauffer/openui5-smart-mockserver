/*
 * openui5-smart-mockserver
 * (c) Copyright 2018-2020 Mauricio Lauffer
 * Licensed under the MIT license. See LICENSE file in the project root for full license information.
 */

sap.ui.define([
  'sap/base/Log',
  'sap/ui/thirdparty/jquery',
  'sap/ui/core/util/MockServer',
  'openui5/smartmockserver/thirdparty/faker.min'
],
/**
 * Module Dependencies
 *
 * @param {typeof sap.base.Log} Log UI5 logger
 * @param {typeof sap.ui.thirdparty.jquery} $ jQuery
 * @param {typeof sap.ui.core.util.MockServer} MockServer UI5 MockServer
 * @returns {object} SmartMockServer object, an extended UI5 MockServer control
 */
function(Log, $, MockServer) {
  'use strict';

  /**
   * OpenUI5 SmartMockServer.
   * SmartMockServer generates meaningful mock data
   *
   * @author Mauricio Lauffer
   * @version 0.3.0
   *
   * @class
   * @namespace
   * @name openui5.smartmockserver
   * @public
   * @alias openui5.smartmockserver.SmartMockServer
   */
  const SmartMockServer = MockServer;

  SmartMockServer.prototype._generateDataFromEntityOriginal = SmartMockServer.prototype._generateDataFromEntity;

  /*
  Mapping between SAP Semantics annotations and Faker methods
  https://wiki.scn.sap.com/wiki/display/EmTech/SAP+Annotations+for+OData+Version+2.0#SAPAnnotationsforODataVersion2.0-Property_sap_semanticsAttributesap:semantics
   */
  SmartMockServer.prototype.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING = [
    {
      sapSemantics: 'city',
      fakerMethod: 'address.city'
    },
    {
      sapSemantics: 'country',
      fakerMethod: 'address.country'
    },
    {
      sapSemantics: 'geo-lat',
      fakerMethod: 'address.latitude'
    },
    {
      sapSemantics: 'geo-lon',
      fakerMethod: 'address.longitude'
    },
    {
      sapSemantics: 'region',
      fakerMethod: 'address.state'
    },
    {
      sapSemantics: 'street',
      fakerMethod: 'address.streetAddress'
    },
    {
      sapSemantics: 'zip',
      fakerMethod: 'address.zipCode'
    },
    {
      sapSemantics: 'org',
      fakerMethod: 'company.companyName'
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
      fakerMethod: 'name.findName'
    },
    {
      sapSemantics: 'givenname',
      fakerMethod: 'name.firstName'
    },
    {
      sapSemantics: 'middlename',
      fakerMethod: 'name.firstName'
    },
    {
      sapSemantics: 'title',
      fakerMethod: 'name.jobTitle'
    },
    {
      sapSemantics: 'familyname',
      fakerMethod: 'name.lastName'
    },
    {
      sapSemantics: 'honorific',
      fakerMethod: 'name.prefix'
    },
    {
      sapSemantics: 'suffix',
      fakerMethod: 'name.suffix'
    },
    {
      sapSemantics: 'tel',
      fakerMethod: 'phone.phoneNumber'
    }
  ];

  /**
   * Generate some mock data for a specific entityType. String value will be
   * based on the property name and an index Integer / Decimal value will be
   * generated randomly Date / Time / DateTime value will also be generated
   * randomly
   *
   * @param {object} oEntityType the Entity type used to generate the data
   * @param {number} iIndex index of this particular object in the parent collection
   * @param {object} mComplexTypes map of the complex types
   * @return {object} the mocked Entity
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntity = function(oEntityType, iIndex, mComplexTypes) {
    const entity = SmartMockServer.prototype._generateDataFromEntityOriginal.apply(this, arguments);
    return this._generateDataWithSmartRules(oEntityType.name, entity);
  };

  /**
   * Generate smart mock data for a specific Entity based on the rules set.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataWithSmartRules = function(entityName, entity) {
    try {
      if (!this._smartRules) {
        this._smartRules = [];
      }
      let entityWithSmartData = $.extend(true, {}, entity);
      entityWithSmartData = this._generateDataFromEntityWithSapSemanticsAnnotations(entityName, entityWithSmartData);
      entityWithSmartData = this._generateDataFromEntityWithSmartMockServerAnnotations(entityName, entityWithSmartData);
      entityWithSmartData = this._generateDataFromEntityWithSmartRules(entityName, entityWithSmartData);
      return entityWithSmartData;
    } catch (err) {
      Log.error(err);
      return entity;
    }
  };

  /**
   * Generate smart mock data for a specific Entity based on the rules set.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntityWithSmartRules = function(entityName, entity) {
    if (this._hasSmartRulesEntity(entityName)) {
      const entityWithSmartData = $.extend(true, {}, entity);
      Object.keys(entityWithSmartData).forEach(function(propertyName) {
        if (this._hasSmartRulesEntityProperty(entityName, propertyName)) {
          entityWithSmartData[propertyName] = this._generatePropertyValueWithSmartRules(entityName, propertyName);
        }
      }.bind(this));
      return entityWithSmartData;
    } else {
      return entity;
    }
  };

  /**
   * Get Entity Properties which contain SAP Semantics Annotations.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @return {array} Entity Properties which contain SAP Semantics Annotations
   * @private
   */
  SmartMockServer.prototype._getEntityPropertiesWithSapSemanticsAnnotations = function(entityName) {
    const entityQuery = 'EntityType[Name="' + entityName + '"]';
    const propertyQuery = 'Property[sap\\:semantics]';
    return $(this._oMetadata).find(entityQuery).find(propertyQuery);
  };

  /**
   * Generate smart mock data for an Entity based on the SAP semantics set for the properties.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntityWithSapSemanticsAnnotations = function(entityName, entity) {
    const propertiesWithSemantics = this._getEntityPropertiesWithSapSemanticsAnnotations(entityName);
    if (propertiesWithSemantics && propertiesWithSemantics.length && propertiesWithSemantics.length > 0) {
      const entityWithSmartData = $.extend(true, {}, entity);
      propertiesWithSemantics.each(function(index, propertyXml) {
        const property = $(propertyXml);
        const fakerMethod = this._getFakerMethodFromSapSemantics(property.attr('sap:semantics'));
        if (fakerMethod) {
          entityWithSmartData[property.attr('Name')] = this._callFakerMethod(fakerMethod);
        }
      }.bind(this));
      return entityWithSmartData;
    } else {
      return entity;
    }
  };

  /**
   * Gets the faker method assigned to the SAP Semantics Annotations
   *
   * @param {string} sapSemantics SAP Semantics Annotations
   * @return {string} the Faker method assigned to the SAP Semantics Annotations
   * @private
   */
  SmartMockServer.prototype._getFakerMethodFromSapSemantics = function(sapSemantics) {
    const mapping = this.SAP_SEMANTICS_TO_FAKER_METHOD_MAPPING.find(function(mapping) {
      return mapping.sapSemantics === sapSemantics;
    });
    if (mapping) {
      return mapping.fakerMethod;
    } else {
      return mapping;
    }
  };

  /**
   * Get Entity Properties which contain Smart MockServer Annotations.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @return {array} Entity Properties which contain Smart MockServer Annotations
   * @private
   */
  SmartMockServer.prototype._getEntityPropertiesWithSmartMockServerAnnotations = function(entityName) {
    const entityQuery = 'EntityType[Name="' + entityName + '"]';
    const propertyQuery = 'Property[smartmockserver\\:rule]';
    return $(this._oMetadata).find(entityQuery).find(propertyQuery);
  };

  /**
   * Generate smart mock data for an Entity based on the Smart MockServer Annotations set for the properties.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {object} entity the Entity object containing its properties and values
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntityWithSmartMockServerAnnotations = function(entityName, entity) {
    const propertiesWithSemantics = this._getEntityPropertiesWithSmartMockServerAnnotations(entityName);
    if (propertiesWithSemantics && propertiesWithSemantics.length && propertiesWithSemantics.length > 0) {
      const entityWithSmartData = $.extend(true, {}, entity);
      propertiesWithSemantics.each(function(index, propertyXml) {
        const property = $(propertyXml);
        const fakerMethod = property.attr('smartmockserver:rule');
        if (fakerMethod) {
          entityWithSmartData[property.attr('Name')] = this._callFakerMethod(fakerMethod);
        }
      }.bind(this));
      return entityWithSmartData;
    } else {
      return entity;
    }
  };

  /**
   * Generate smart mock data for a specific Entity property based on the rules set.
   *
   * @param {string} entityName the Entity name used to generate the data
   * @param {string} propertyName the property name which contains a smart rule to generate the data
   * @return {object} the mocked Entity with smart content
   * @private
   */
  SmartMockServer.prototype._generatePropertyValueWithSmartRules = function(entityName, propertyName) {
    const propertyFound = this._getSmartRulesEntityProperty(entityName, propertyName);
    return this._callFakerMethod(propertyFound.fakerMethod);
  };

  /**
   * Calls the Faker method defined in the smart rule and returns its result
   *
   * @param {string} fakerMethod the Entity name used to generate the data
   * @return {object} the result of the Faker method defined in the smart rule (can be any type)
   * @private
   */
  SmartMockServer.prototype._callFakerMethod = function(fakerMethod) {
    return faker.fake('{{' + fakerMethod + '}}');
  };

  /**
   * Gets the Entity with smart rules assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @return {object} the smart rules defined for the Entity
   * @private
   */
  SmartMockServer.prototype._getSmartRulesEntity = function(entityName) {
    return this._smartRules.find(function(item) {
      return item.entityName === entityName;
    });
  };

  /**
   * Gets the Entity property with a smart rule assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @param {string} propertyName the name of the Entity property that has a smart rule
   * @return {object} the smart rule defined for the Entity property
   * @private
   */
  SmartMockServer.prototype._getSmartRulesEntityProperty = function(entityName, propertyName) {
    const entityFound = this._getSmartRulesEntity(entityName);
    if (!entityFound) {
      return entityFound;
    }
    return entityFound.properties.find(function(property) {
      return property.name === propertyName;
    });
  };

  /**
   * Verifies whether the Entity has smart rules assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @return {boolean} true if Entity has any smart rule
   * @private
   */
  SmartMockServer.prototype._hasSmartRulesEntity = function(entityName) {
    return !!this._getSmartRulesEntity(entityName);
  };

  /**
   * Verifies whether the Entity property has a smart rule assigned to it
   *
   * @param {string} entityName the name of the Entity that has smart rules
   * @param {string} propertyName the name of the Entity property that has a smart rule
   * @return {boolean} true if Entity property has any smart rule
   * @private
   */
  SmartMockServer.prototype._hasSmartRulesEntityProperty = function(entityName, propertyName) {
    return !!this._getSmartRulesEntityProperty(entityName, propertyName);
  };

  /**
   * Sets the smart rules to the Entities and their properties
   *
   * @param {Object[]} smartRules An array of smart rules
   * @param {string} smartRules[].entityName The name of an Entity.
   * @param {Object[]} smartRules[].properties An array with Entity properties and its Faker methods.
   * @param {string} smartRules[].properties[].name The name of an Entity property.
   * @param {string} smartRules[].properties[].fakerMethod The Faker method to be used for this property
   * @public
   */
  SmartMockServer.prototype.setSmartRules = function(smartRules) {
    this._smartRules = smartRules || [];
  };


  const messageType = {
    REQUEST: 'REQUEST',
    MOCK_RESPONSE: 'MOCK_RESPONSE',
    REGISTER_MOCK_SERVER: 'REGISTER_MOCK_SERVER',
    START_MOCK_SERVER: 'START_MOCK_SERVER',
    STOP_MOCK_SERVER: 'STOP_MOCK_SERVER',
    UNKNOWN_MESSAGE: 'UNKNOWN_MESSAGE'
  };

  /**
   * Returns all mock servers
   */
  SmartMockServer.getAll = function() {
    return MockServer._aServers;
  };

  /**
   * Registers mock servers into ServiceWorker
   */
  SmartMockServer.registerServiceWorker = function(filename) {
    // Generates request handlers
    SmartMockServer.getAll().forEach(function(server) {
      server.start();
      server.stop();
    });
    navigator.serviceWorker.addEventListener('message', onServiceWorkerMessage);

    return navigator.serviceWorker.register(filename)
        .then(function() {
          prefilterSyncAjaxRequests();
          const servers = getMockServerRegisterPayload();
          return sendMessageToServiceWorker(messageType.REGISTER_MOCK_SERVER, servers);
        })
        .catch(function(err) {
          Log.error('ServiceWorker not registered!');
          Log.error(err);
        });
  };

  /**
   * Returns whether mock server's ServiceWorker has been started
   */
  SmartMockServer.prototype.isServiceWorkerStarted = function() {
    return this._isServiceWorkerStarted;
  };

  /**
   * Starts mock server's ServiceWorker
   */
  SmartMockServer.prototype.startServiceWorker = function() {
    this._isServiceWorkerStarted = true;
    const payload = {
      rootUri: this.getRootUri(),
      active: this.isServiceWorkerStarted()
    };
    return sendMessageToServiceWorker(messageType.START_MOCK_SERVER, payload);
  };

  /**
   * Stops mock server's ServiceWorker
   */
  SmartMockServer.prototype.stopServiceWorker = function() {
    this._isServiceWorkerStarted = false;
    const payload = {
      rootUri: this.getRootUri(),
      active: this.isServiceWorkerStarted()
    };
    return sendMessageToServiceWorker(messageType.STOP_MOCK_SERVER, payload);
  };

  function prefilterSyncAjaxRequests() {
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      if (options.async) {
        return;
      }
      const server = getMockServerByRootUri(options.url);
      if (!server) {
        return;
      }
      const capturedRequest = {
        url: options.url,
        method: options.type,
        mockServer: {
          path: 'JUST_TO_AVOID_TO_BE_FOUND'
        }
      };
      const mockRequest = getMockRequest(capturedRequest, server);
      if (!mockRequest) {
        return;
      }
      try {
        options.beforeSend = function(jqXHR, settings) {
          server.start();
          settings.url = settings.url.replace(window.location.origin, '');
        };
        jqXHR.complete(function() {
          server.stop();
        });
      } catch (err) {
        Log.error(err);
      }
    });
  }

  function getMockServerByRootUri(url) {
    return SmartMockServer.getAll()
        .filter(function(server) {
          const rootUriRegxp = new RegExp(server.getRootUri());
          return rootUriRegxp.test(url);
        })[0];
  }

  function getMockRequest(capturedRequest, server) {
    if (!server) {
      return;
    }
    return server.getRequests()
        .filter(function(req) {
          if (req.method.toLowerCase() !== capturedRequest.method.toLowerCase()) {
            return false;
          }
          const isServiceRootUri = req.path.toString() === '/$/';
          if (isServiceRootUri && capturedRequest.mockServer.path === '$') {
            return isServiceRootUri;
          } else if (!isServiceRootUri) {
            return req.path instanceof RegExp ? req.path.test(capturedRequest.url) : req.path === capturedRequest.url;
          }
        })[0];
  }

  function onServiceWorkerMessage(evt) {
    if (evt.data.type !== messageType.REQUEST) {
      return;
    }
    captureRequest(evt.data.payload)
        .then(function(mockResponse) {
          evt.ports[0].postMessage({
            type: messageType.MOCK_RESPONSE,
            payload: JSON.stringify(mockResponse)
          });
        })
        .catch(function(err) {
          Log.error(err);
          evt.ports[0].postMessage({
            type: messageType.MOCK_RESPONSE,
            error: true,
            payload: JSON.stringify(err)
          });
        });
  }

  function captureRequest(payload) {
    return new Promise(function(resolve, reject) {
      const capturedRequest = JSON.parse(payload);
      const server = getMockServerByRootUri(capturedRequest.url);
      const mockRequest = getMockRequest(capturedRequest, server);
      if (!mockRequest) {
        reject(new Error('No request was found in MockServer'));
      }
      const xhr = Object.assign({}, capturedRequest);
      const args = typeof mockRequest.path.exec === 'function' ? mockRequest.path.exec(xhr.url).slice(1) : [];
      xhr.respond = function() {
        resolve(arguments);
      };
      xhr.respondFile = xhr.respondJSON = xhr.respondXML = xhr.respond;
      mockRequest.response(xhr, args[0], args[1]);
    });
  }

  function getMockServerRegisterPayload() {
    return SmartMockServer.getAll().map(function(server) {
      const requests = server.getRequests().map(function(request) {
        const newRequest = {
          method: request.method,
          path: request.path,
          isRegExp: request.path instanceof RegExp
        };
        if (newRequest.isRegExp) { // Convert RegExp to String as it cannot be serialized
          const pathString = newRequest.path.toString();
          const pathRegExpBase = pathString.substring(pathString.indexOf('/') + 1, pathString.lastIndexOf('/'));
          const isServiceRootUri = pathString === '/$/';
          newRequest.path = isServiceRootUri ? '$' : pathRegExpBase;
        }
        return newRequest;
      });
      return {
        active: false,
        rootUri: server.getRootUri(),
        requests: requests
      };
    });
  }

  function sendMessageToServiceWorker(type, payload) {
    return navigator.serviceWorker.ready
        .then(function(swRegistration) {
          swRegistration.active.postMessage({
            type: type,
            payload: JSON.stringify(payload)
          });
        });
  }
  return SmartMockServer;
});
