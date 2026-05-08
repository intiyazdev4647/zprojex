sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, Filter, FilterOperator, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.DisplayProject", {
        onInit: function() {
             this.getOwnerComponent()
          .getRouter()
          .getRoute("DisplayProject")
          .attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function(oEvent) {
            let projectID = oEvent.getParameter("arguments").projectID;
            let that = this;
            this.getView().setBusy(true);
            const oModel = this.getView().getModel();
            oModel.read("/ProjectsSet('" + projectID + "')", {
              success: function(oData) {
                if (oData) {  
                  var oJsonModel = new JSONModel(oData);
                  that.getView().setModel(oJsonModel, "projectModel");
                  that.getView().setBusy(false);
                }
              },
              error: function(oError) {
                console.error("Error while reading Projects:", oError);
                that.getView().setBusy(false);
              }
            });
        },
        
      onBack: function() {
        this.getOwnerComponent().getRouter().navTo("Home");
      }
    });
  }
);
