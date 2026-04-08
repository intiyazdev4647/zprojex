sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
  ],
  function(
    Controller,
    Filter,
    FilterOperator,
    MessageBox,
    JSONModel,
    Fragment
  ) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Projects", {
      onInit: function() {
        var oJsonModel = new JSONModel({});
        this.getView().setModel(oJsonModel, "projectsModel");
        this.loadProjectsData();
        // this.loadRolesData();
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
        var oTimeout = setTimeout(function() {
          oList.setBusy(false);
        }, 20000);
        oModel.read("/ProjectsSet", {
          success: function(oData) {
            var aProjects = oData.results;

            aProjects.forEach(function(oItem) {
             

              if (oItem.Tasks) {
                var sTasks = oItem.Tasks.replace(/\s/g, ""); // "/0/1"
                sTasks = sTasks.replace(/^\/+/, ""); // "0/1"
                var aTaskParts = sTasks.split("/");

                var percentT = parseFloat(aTaskParts[0]) || 0;
                var totalT = parseInt(aTaskParts[1]) || 0;

                var completedT = Math.round(percentT / 100 * totalT);

                oItem.TaskPercent = Math.round(percentT);
                oItem.TotalTasks = totalT;
                oItem.CompletedTasks = completedT;
              } else {
                oItem.TaskPercent = 0;
                oItem.TotalTasks = 0;
                oItem.CompletedTasks = 0;
              }


              if (oItem.Milestones) {
                var sMiles = oItem.Milestones.replace(/\s/g, ""); // "1/50.00/2"
                var aMilParts = sMiles.split("/");

                var completedM = parseInt(aMilParts[0]) || 0;
                var percentM = parseFloat(aMilParts[1]) || 0;
                var totalM = parseInt(aMilParts[2]) || 0;

                oItem.CompletedMilestones = completedM;
                oItem.TotalMilestones = totalM;
                oItem.MilestonePercent = Math.round(percentM);
              } else {
                oItem.CompletedMilestones = 0;
                oItem.TotalMilestones = 0;
                oItem.MilestonePercent = 0;
              }
            });

            // set to JSON model
            var oJsonModel = that.getView().getModel("projectsModel");
            oJsonModel.setProperty("/projects", aProjects);
            clearTimeout(oTimeout);
            that.getView().setBusy(false);
          },
          error: function() {
            clearTimeout(oTimeout);
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
      },
      onFilterPress: function() {
        var oView = this.getView();
        if (!this._oFilterDialog) {
          Fragment.load({
            id: oView.getId(),
            name: "com.ennovi.projex.fragments.ProjectFilter",
            controller: this
          }).then(
            function(oDialog) {
              this._oFilterDialog = oDialog;
              oView.addDependent(oDialog);
              oDialog.open();
            }.bind(this)
          );
        } else {
          this._oFilterDialog.open();
        }
      },
      onFilterCancel: function() {
        this._oFilterDialog.close();
      },
      onClear: function() {
        this.onFilterReset();
        this.byId("mainprojectsTable").getBinding("rows").filter([]);
      },
      onFilterReset: function() {
        var oView = this.getView();
        oView.byId("filterprojName").setValue("");
        oView.byId("filterOwner").setSelectedKeys([]);
        oView.byId("filterStartDateFrom").setDateValue(null);
        oView.byId("filterStartDateTo").setDateValue(null);
        oView.byId("filterEndDateFrom").setDateValue(null);
        oView.byId("filterEndDateTo").setDateValue(null);
        oView.byId("filterDepartment").setSelectedKeys([]);
        oView.byId("filterSite").setSelectedKeys([]);
        oView.byId("filterBPM").setValue("");
        oView.byId("filterEmail").setValue("");
        oView.byId("filterCompletionFrom").setValue("");
        oView.byId("filterCompletionTo").setValue("");
        oView.byId("filterFieldSearch").setValue("");
        // show all panels again
        this.onFilterFieldSearch({ getParameter: () => "" });
      }
    });
  }
);
