sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/ennovi/projex/model/models",
    "sap/ui/model/json/JSONModel"
  ],
  function(UIComponent, Device, models, JSONModel) {
    "use strict";

    return UIComponent.extend("com.ennovi.projex.Component", {
      metadata: {
        manifest: "json"
      },

      init: function() {
        UIComponent.prototype.init.apply(this, arguments);

        this.getRouter().initialize();
        this.setModel(models.createDeviceModel(), "device");

        // 🔹 Call function to load OData into JSONModel
        this._loadGlobalData();

        // 🔹 Get logged-in user
        this._setUserModel();
      },

      /**
         * Load OData and store in global JSON model
         */
      _loadGlobalData: function() {
        var oODataModel = this.getModel(); // default OData model from manifest

        if (sap.ushell && sap.ushell.Container) {
          var oUser = sap.ushell.Container.getService("UserInfo").getUser();

          var oUserData = {
            id: oUser.getId(),
            fullName: oUser.getFullName(),
            email: oUser.getEmail()
          };
          var oJSONModel = new JSONModel();
          var aFilters = [
            new sap.ui.model.Filter(
              "UserName",
              sap.ui.model.FilterOperator.EQ,
              oUserData.id
            )
          ];
          var that = this;

          oODataModel.read("/RolesSet", {
            filters: aFilters,
            success: function(oData) {
              oJSONModel.setData(oData.results);

              that.setModel(oJSONModel, "rolesModel");

              console.log("Role Data Loaded:", oData.results);
            },
            error: function(oError) {
              console.error("Error loading data", oError);
            }
          });
        } else {
          console.warn("Not running inside FLP");
        }
      },

      _setUserModel: function() {
        var oUserModel = new JSONModel();

        if (sap.ushell && sap.ushell.Container) {
          var oUser = sap.ushell.Container.getService("UserInfo").getUser();

          var oUserData = {
            id: oUser.getId(),
            fullName: oUser.getFullName(),
            email: oUser.getEmail()
          };

          oUserModel.setData(oUserData);

          // 🔹 Set globally
          this.setModel(oUserModel, "userModel");

          console.log("User Info:", oUserData);
        } else {
          console.warn("Not running inside FLP");
        }
      }
    });
  }
);
