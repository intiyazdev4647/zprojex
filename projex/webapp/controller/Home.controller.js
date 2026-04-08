sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
  ],
  function(Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Main", {
      onInit: function() {
        // this.getView().setModel(models.sideModel(), "side");
        var oJsonModel = new JSONModel({});
        this.getView().setModel(oJsonModel, "projectsModel");
        this.getOwnerComponent().getRouter().getRoute("Home").attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function() {
        this.loadProjectsData();
        this.loadMilestonesData();
        this.loadTasksData();
      },
      loadProjectsData: function() {
        var oList = this.getView().byId("projectsList");
        oList.setBusy(true);
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        var oTimeout = setTimeout(function() {
          oList.setBusy(false);
        }, 20000);
        oModel.read("/ProjectsSet", {
          success: function(oData) {
            if (oData && oData.results) {
              clearTimeout(oTimeout);
              oList.setBusy(false);
              var oJsonModel = that.getView().getModel("projectsModel");
              oJsonModel.setProperty("/projects", oData.results);
              // that.getView().setModel(oJsonModel, "projectsModel");
              // console.log("Projects Data:", oData.results);
            }
          },
          error: function(oError) {
            clearTimeout(oTimeout);
            oList.setBusy(false);
            console.error("Error while reading Projects:", oError);
          }
        });
      },
      loadMilestonesData: function() {
        var oList = this.getView().byId("milestonesList");
        oList.setBusy(true);
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        var oTimeout = setTimeout(function() {
          oList.setBusy(false);
        }, 20000);
        oModel.read("/MilestonesSet", {
          success: function(oData) {
            if (oData && oData.results) {
              clearTimeout(oTimeout);
              that.getView().byId("milestonesList").setBusy(false);
              var oJsonModel = that.getView().getModel("projectsModel");
              oJsonModel.setProperty("/milestones", oData.results);
              console.log(
                "Milestones data loaded successfully:",
                oData.results
              );
            }
          },
          error: function(oError) {
            clearTimeout(oTimeout);
            that.getView().byId("milestonesList").setBusy(false);
            console.error("Error while reading Milestones:", oError);
          }
        });
      },
      loadTasksData: function() {
        var oList = this.getView().byId("tasksList");
        oList.setBusy(true);
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        var oTimeout = setTimeout(function() {
          oList.setBusy(false);
        }, 20000);
        oModel.read("/TasksSet", {
          success: function(oData) {
            if (oData && oData.results) {
              clearTimeout(oTimeout);
              that.getView().byId("tasksList").setBusy(false);
              var oJsonModel = that.getView().getModel("projectsModel");
              oJsonModel.setProperty("/tasks", oData.results);
              console.log("Tasks Data:", oData.results);
            }
          },
          error: function(oError) {
            clearTimeout(oTimeout);
            that.getView().byId("tasksList").setBusy(false);
            console.error("Error while reading Tasks:", oError);
          }
        });
      },
      onProjectPress: function(oEvent) {
        var oItem = oEvent.getParameter("listItem");
        var oCtx = oItem.getBindingContext("projectsModel");
        var oProject = oCtx.getObject();
        var sProjectId = oProject.ProjectID;
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("DisplayProject", { projectID: sProjectId });
      },
      onMilestonePress: function(oEvent) {
        var oItem = oEvent.getParameter("listItem");
        var oCtx = oItem.getBindingContext("projectsModel");
        var oMilestone = oCtx.getObject();
        var sMilestoneName = oMilestone.Name;
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("DisplayMilestone", { milestoneName: sMilestoneName });
      },
      onTaskPress: function(oEvent) {
        var oItem = oEvent.getParameter("listItem");
        var oCtx = oItem.getBindingContext("projectsModel");
        var oTask = oCtx.getObject();
        var sTaskId = oTask.TaskID;
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("DisplayTask", { taskId: sTaskId });
      }
    });
  }
);
