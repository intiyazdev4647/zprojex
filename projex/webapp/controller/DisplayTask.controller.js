sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.DisplayTask", {
      onInit: function() {
        //    this.getView().setModel(models.projectsModel(), "projectsModel");
        this.getOwnerComponent()
          .getRouter()
          .getRoute("DisplayTask")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        let taskID = oEvent.getParameter("arguments").taskId;
        let that = this;
        this.getView().setBusy(true);
        const oModel = this.getView().getModel();
        oModel.read("/TasksSet('" + taskID + "')", {
          success: function(oData) {
            if (oData) {
              var oJsonModel = new JSONModel(oData);
              that.getView().setModel(oJsonModel, "displayTaskModel");
              console.log("Task Data:", oData);
              that.getView().setBusy(false);
            }
          },
          error: function(oError) {
            var oModel = that.getView().getModel("displayTaskModel");
            if (oModel) {
              oModel.setData({});
            }
            MessageBox.error(
              "Error while reading Task details. Please try again.",
              {
                title: "Error",
                onClose: function() {
                  that.getOwnerComponent().getRouter().navTo("Tasks");
                }
              }
            );
            console.error("Error while reading Task:", oError);
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
