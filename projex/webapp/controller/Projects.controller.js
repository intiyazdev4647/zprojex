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

    return Controller.extend("com.ennovi.projex.controller.Projects", {
      onInit: function() {
        var oJsonModel = new JSONModel({});
        this.getView().setModel(oJsonModel, "projectsModel");
        this.loadProjectsData();
        this.loadRolesData();
        this.getOwnerComponent()
          .getRouter()
          .getRoute("Projects")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function() {
        this.loadProjectsData();
      },
      loadProjectsData: function() {
        this.getView().setBusy(true);
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/ProjectsSet", {
          success: function(oData) {
            if (oData && oData.results) {
              var oJsonModel = that.getView().getModel("projectsModel");
              oJsonModel.setProperty("/projects", oData.results);
              that.getView().setModel(oJsonModel, "projectsModel");
              // console.log("Projects Data:", oData.results);
              that.getView().setBusy(false);
            }
          },
          error: function(oError) {
            console.error("Error while reading Projects:", oError);
            that.getView().setBusy(false);
          }
        });
      },
      loadRolesData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/RolesSet", {
          urlParameters: {
            $select: "Projects"
          },
          success: function(oData) {
            if (oData && oData.results) {
              var oJsonModel = that.getView().getModel("projectsModel");
              oJsonModel.setProperty("/roles", oData.results);
              that.getView().setModel(oJsonModel, "projectsModel");
              console.log("Roles Data:", oData.results);
            }
          },
          error: function(oError) {
            console.error("Error while reading Roles:", oError);
          }
        });
      },
      onAddProject: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("CreateProjects");
      },
      onProjectLinkPress: function(oEvent) {
        var oItem = oEvent.getSource();
        var oContext = oItem.getBindingContext("projectsModel");
        var sProjectID = oContext.getProperty("ProjectID");
        var oRouter = this.getOwnerComponent().getRouter();
        this.getOwnerComponent()
          .getRouter()
          .navTo("EditProject", { projectID: sProjectID });
      }
    });
  }
);
