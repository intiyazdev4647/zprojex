sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Tasks", {
      onInit: function() {
        this.loadTasksData();
        // this.getView().setModel(models.projectsModel(), "projectsModel");
        this.getOwnerComponent()
          .getRouter()
          .getRoute("Tasks")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function() {
        this.loadTasksData();
      },
      loadTasksData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        this.getView().setBusy(true);
        var oTimeout = setTimeout(function() {
          that.getView().setBusy(false);
        }, 20000);
        oModel.read("/TasksSet", {
          success: function(oData) {
            if (oData && oData.results) {
              clearTimeout(oTimeout);
              that.getView().setBusy(false);
              var oJsonModel = new JSONModel({
                tasks: []
              });
              oJsonModel.setProperty("/tasks", oData.results);
              // console.log("Tasks data loaded successfully:", oData.results);
              that.getView().setModel(oJsonModel, "projectsModel");
            }
          },
          error: function(oError) {
            clearTimeout(oTimeout);
            that.getView().setBusy(false);
            console.error("Error while reading Tasks:", oError);
          }
        });
      },
      onAddTask: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("CreateTask");
      },
      onTaskPress: function(oEvent) {
        var oSource = oEvent.getSource();
        var oContext = oSource.getBindingContext("projectsModel");
        var oData = oContext.getObject();

        // Navigate to Edit View
        var oRouter = this.getOwnerComponent().getRouter();

        oRouter.navTo("EditTask", {
          taskID: oData.TaskID
        });

        // Store selected data globally (simple approach)
        sap.ui
          .getCore()
          .setModel(new sap.ui.model.json.JSONModel(oData), "editTaskModel");
      },
      onFilterPress: function() {
        // open the filter fragment
        var oView = this.getView();
        var oModel = this.getView().getModel("projectsModel");
        var aData = oModel.getProperty("/tasks");
        var aUniqueProjects = [
          ...new Set(aData.map(item => item.ProjectID))
        ].map(project => ({ Project: project }));
        var aUniqueOwners = [
          ...new Set(aData.map(item => item.Owner))
        ].map(owner => ({ Owner: owner }));
        var oFilterModel = new JSONModel({
          project: aUniqueProjects,
          owner: aUniqueOwners
        });

        oView.setModel(oFilterModel, "filterModel");
        oView.setBusy(true);
        if (!this._pDialog) {
          this._pDialog = Fragment.load({
            id: oView.getId(),
            name: "com.ennovi.projex.fragments.TaskFilter",
            controller: this
          }).then(
            function(oDialog) {
              return oDialog;
            }.bind(this)
          );
        }
        this._pDialog.then(function(oDialog) {
          oDialog.setModel(oView.getModel("filterModel"), "filterModel");
          oDialog.open();
          oView.setBusy(false);
        });
      },
      handleConfirm: function() {
        var oView = this.getView();
        var aFilters = [];

        // get controls from fragment
        var oProjectMCB = oView.byId("projectFilter");
        var oOwnerMCB = oView.byId("ownerFil");

        var aSelectedProjects = oProjectMCB.getSelectedKeys();
        var aSelectedOwners = oOwnerMCB.getSelectedKeys();

        /* ---------------- PROJECT FILTER ---------------- */
        if (aSelectedProjects.length > 0) {
          var aProjectFilters = aSelectedProjects.map(function(sProject) {
            return new Filter("ProjectID", FilterOperator.EQ, sProject);
          });

          aFilters.push(
            new Filter({
              filters: aProjectFilters,
              and: false // OR condition inside same field
            })
          );
        }

        /* ---------------- OWNER FILTER ---------------- */
        if (aSelectedOwners.length > 0) {
          var aOwnerFilters = aSelectedOwners.map(function(sOwner) {
            return new Filter("Owner", FilterOperator.EQ, sOwner);
          });

          aFilters.push(
            new Filter({
              filters: aOwnerFilters,
              and: false
            })
          );
        }

        /* ---------------- APPLY TO TABLE ---------------- */
        var oTable = this.byId("tasksTable");
        var oBinding = oTable.getBinding("rows");

        if (aFilters.length > 0) {
          oBinding.filter(
            new Filter({
              filters: aFilters,
              and: true // Project AND Owner together
            })
          );
        } else {
          oBinding.filter([]); // no filter
        }

        this._pDialog.then(function(oDialog) {
          oDialog.close();
        });
      },
      handleCancel: function() {
        this._pDialog.then(function(oDialog) {
          oDialog.close();
        });
      },
      handleResetFilters: function() {
        var oView = this.getView();

        var oProjectMCB = oView.byId("projectFilter");
        var oOwnerMCB = oView.byId("ownerFil");

        // clear selections in dialog
        if (oProjectMCB) oProjectMCB.removeAllSelectedItems();
        if (oOwnerMCB) oOwnerMCB.removeAllSelectedItems();

        // remove filters from table
        var oTable = this.byId("tasksTable");
        var oBinding = oTable.getBinding("rows");
        oBinding.filter([]);

        sap.m.MessageToast.show("Filters cleared");
      },
      onClear: function() {
        var oTable = this.byId("tasksTable");
        oTable.getBinding("rows").filter([]);
        this.handleResetFilters();
      }
    });
  }
);
