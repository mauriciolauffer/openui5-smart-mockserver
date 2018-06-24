sap.ui.define([
  'jquery.sap.global',
  'sap/ui/core/util/MockServer',
  './thirdparty/faker.min'
], function($, MockServer) {
  'use strict';

  const SmartMockServer = MockServer;

  SmartMockServer.prototype._generateDataFromEntityOriginal = SmartMockServer.prototype._generateDataFromEntity;

  /**
   * Generate some mock data for a specific entityType. String value will be
   * based on the property name and an index Integer / Decimal value will be
   * generated randomly Date / Time / DateTime value will also be generated
   * randomly
   *
   * @param {object} oEntityType the Entity type used to generate the data
   * @param {int} iIndex index of this particular object in the parent collection
   * @param {map} mComplexTypes map of the complex types
   * @return {object} the mocked Entity
   * @private
   */
  SmartMockServer.prototype._generateDataFromEntity = function(oEntityType, iIndex, mComplexTypes) {
    let entity = SmartMockServer.prototype._generateDataFromEntityOriginal.apply(this, arguments);
    entity = this._generateDataFromEntityWithSmartRules(oEntityType.name, entity);
    return entity;
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
    try {
      const entityWithSmartData = Object.assign({}, entity);
      if (this._hasSmartRulesEntity(entityName)) {
        Object.keys(entityWithSmartData).forEach(function(propertyName) {
          if (this._hasSmartRulesEntityProperty(entityName, propertyName)) {
            entityWithSmartData[propertyName] = this._generatePropertyValueWithSmartRules(entityName, propertyName);
          }
        }.bind(this));
      }
      return entityWithSmartData;

    } catch (err) {
      $.sap.log.error(err);
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
    return this._getFakerValue(propertyFound.fakerMethod);
  };

  /**
   * Calls the Faker method defined in the smart rule and returns its result
   *
   * @param {string} fakerMethod the Entity name used to generate the data
   * @return {object} the result of the Faker method defined in the smart rule (can be any type)
   * @private
   */
  SmartMockServer.prototype._getFakerValue = function(fakerMethod) {
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
      return null;
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
   * @param {array} smartRules an array of smart rules
   * @public
   */
  SmartMockServer.prototype.setSmartRules = function(smartRules) {
    this._smartRules = smartRules || [];
  };

  return SmartMockServer;
});
