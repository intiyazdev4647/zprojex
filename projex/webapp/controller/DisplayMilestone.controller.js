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

    return Controller.extend("com.ennovi.projex.controller.DisplayMilestone", {
      onInit: function() {
        this.getOwnerComponent()
          .getRouter()
          .getRoute("DisplayMilestone")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        let milestoneName = oEvent.getParameter("arguments").milestoneName;
        let that = this;
        this.getView().setBusy(true);
        const oModel = this.getView().getModel();
        oModel.read("/MilestonesSet('" + milestoneName + "')", {
          success: function(oData) {
            if (oData) {
              var oJsonModel = new JSONModel(oData);
              that.getView().setModel(oJsonModel, "projectModel");
              that.getView().setBusy(false);
            }
          },
          error: function(oError) {
             var oModel = that.getView().getModel("projectModel");
            if (oModel) {
              oModel.setData({});
            }
            that.getView().setBusy(false);
            MessageBox.error(
              "Error while reading Milestone details. Please try again.",
              {
                title: "Error",
                onClose: function() {
                  that.onBack();
                }
              }
            );
            console.error("Error while reading Milestones:", oError);
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
