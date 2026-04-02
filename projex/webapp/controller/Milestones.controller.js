sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Milestones", {
      onInit: function() {
        this.loadMilestonesData();
       
        // this.getView().setModel(models.ProjectsModel(), "ProjectsModel");
      },
      loadMilestonesData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/MilestonesSet", {
          success: function(oData) {
            if (oData && oData.results) {
              var oJsonModel = new JSONModel({
                milestones: []
              });
              oJsonModel.setProperty("/milestones", oData.results);
              that.getView().setModel(oJsonModel, "projectsModel");
              console.log(
                "Milestones data loaded successfully:",
                oData.results
              );
            }
          },
          error: function(oError) {
            console.error("Error while reading Milestones:", oError);
            
          }
        });
      },
      onFilterPress: function() {
        var oView = this.getView();

        if (!this._pDialog) {
          this._pDialog = Fragment.load({
            id: oView.getId(),
            name: "com.ennovi.projex.fragments.MilestoneFilter",
            controller: this
          }).then(
            function(oDialog) {
              return oDialog;
            }.bind(this)
          );
        }
        this._pDialog.then(function(oDialog) {
            oDialog.setModel(oView.getModel("projectsModel"), "projectsModel");
            oDialog.open();
        });
      },
      onAddMilestone: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("CreateMilestone");
      },
      onMilestonePress: function(oEvent) {
        var oItem = oEvent.getSource();
        var oContext = oItem.getBindingContext("projectsModel");
        var sMilestoneName = oContext.getProperty("Name");
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("EditMilestone", {
          milestoneName: sMilestoneName
        });
      }
    });
  }
);
