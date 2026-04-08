sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/Device", "sap/m/MessageBox"],
  function(Controller, Device, MessageBox) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.App", {
      onInit: function() {
        var oJSONModel = new sap.ui.model.json.JSONModel({
          selectedKey: "home"
        });
        this.getView().setModel(oJSONModel, "side");
        var oDeviceModel = new sap.ui.model.json.JSONModel(Device);
        oDeviceModel.setDefaultBindingMode("OneWay");
        this.getView().setModel(oDeviceModel, "device");
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.attachRouteMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        var sRouteName = oEvent.getParameter("name");
        var oTitle = this.getView().byId("pageTitle");
        oTitle.setText(sRouteName);
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        var sHash = oRouter.getHashChanger().getHash();
        var sSelectedKey = sHash.split("/")[0];
        var oModel = this.getView().getModel("side");
        if (sRouteName === "Home") {
          sSelectedKey = "home";
        }
        oModel.setProperty("/selectedKey", sSelectedKey);
      },
      onProfilePress: function(oEvent) {
        var oSource = oEvent.getSource();

        // Get user data
        var oUser = sap.ushell.Container.getUser();

        var oUserData = {
          id: oUser.getId(),
          fullName: oUser.getFullName(),
          email: oUser.getEmail()
        };

        var oModel = new sap.ui.model.json.JSONModel(oUserData);

        // Load Fragment (only once)
        if (!this._oUserPopover) {
          this._oUserPopover = sap.ui.xmlfragment(
            "com.ennovi.projex.fragments.UserProfile",
            this
          );

          this.getView().addDependent(this._oUserPopover);
        }

        // Set model
        this._oUserPopover.setModel(oModel, "user");

        // Open popover
        this._oUserPopover.openBy(oSource);
      },
      onSideNavButtonPress: function() {
        var oToolPage = this.byId("app");
        var bSideExpanded = oToolPage.getSideExpanded();
        this._setToggleButtonTooltip(bSideExpanded);
        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },
      _setToggleButtonTooltip: function(bSideExpanded) {
        var oToggleButton = this.byId("sideNavigationToggleButton");
        var sTooltipText = bSideExpanded ? "Expand" : "Collapse";
        oToggleButton.setTooltip(sTooltipText);
      },

      onMenuSelect: function(oEvent) {
        var sKey = oEvent.getParameter("item").getKey();
        var sText = oEvent.getParameter("item").getText();
        var oSideNav = this.getView().byId("sideNav");
        oSideNav.setSelectedKey(sKey);
        var sTitle = this.getView().byId("pageTitle");
        sTitle.setText(sText);
        this.oRouter.navTo(sText);

        if (Device.system.phone) {
          this.byId("app").setSideExpanded(false);
        }
      },

      onUserPress: function() {
        MessageBox.information("User Profile - Coming Soon!");
      }
    });
  }
);
