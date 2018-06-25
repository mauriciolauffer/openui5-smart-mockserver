sap.ui.define([
  'sap/ui/core/UIComponent'
], function(UIComponent) {
  'use strict';

  return UIComponent.extend('mlauffer.demo.openui5.smartmockserver.Component', {
    metadata: {
      manifest: 'json'
    },

    init: function () {
      this.getModel().setSizeLimit(15); //Load only 15 entries!
      UIComponent.prototype.init.apply(this, arguments);
    },

    destroy: function() {
      UIComponent.prototype.destroy.apply(this, arguments);
    }
  });
});
