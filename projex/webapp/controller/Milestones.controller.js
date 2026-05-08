sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
  ],
  function(
    Controller,
    MessageBox,
    MessageToast,
    Fragment,
    JSONModel,
    Filter,
    FilterOperator
  ) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Milestones", {
      onInit: function() {
        this.loadMilestonesData();
        this.getOwnerComponent()
          .getRouter()
          .getRoute("Milestones")
          .attachPatternMatched(this._onRouteMatched, this);

        // this.getView().setModel(models.ProjectsModel(), "ProjectsModel");
      },
      _onRouteMatched: function() {
        this.loadMilestonesData();
      },
      loadMilestonesData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        this.getView().setBusy(true);
        var oTimeout = setTimeout(function() {
          that.getView().setBusy(false);
        }, 20000);
        oModel.read("/MilestonesSet", {
          success: function(oData) {
            if (oData && oData.results) {
              clearTimeout(oTimeout);
              that.getView().setBusy(false);
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
            clearTimeout(oTimeout);
            that.getView().setBusy(false);
            console.error("Error while reading Milestones:", oError);
          }
        });
      },
      onFilterPress: function() {
        var oView = this.getView();
        var oModel = this.getView().getModel("projectsModel");
        var aData = oModel.getProperty("/milestones");
        var aUniqueStatuses = [
          ...new Set(aData.map(item => item.Status))
        ].map(status => ({ Status: status }));
        var aUniqueOwners = [
          ...new Set(aData.map(item => item.Owner))
        ].map(owner => ({ Owner: owner }));
        var oFilterModel = new JSONModel({
          status: aUniqueStatuses,
          owner: aUniqueOwners
        });
        oView.setModel(oFilterModel, "filterModel");

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
          oView.addDependent(oDialog);
          oDialog.open();
        });
      },
      handleConfirm: function() {
        var oView = this.getView();
        var aFilters = [];

        // get controls from fragment
        var oStatusMCB = oView.byId("statusFilter");
        var oOwnerMCB = oView.byId("ownerFilter");

        var aSelectedStatuses = oStatusMCB.getSelectedKeys();
        var aSelectedOwners = oOwnerMCB.getSelectedKeys();

        /* ---------------- STATUS FILTER ---------------- */
        if (aSelectedStatuses.length > 0) {
          var aStatusFilters = aSelectedStatuses.map(function(sStatus) {
            return new Filter("Status", FilterOperator.EQ, sStatus);
          });

          aFilters.push(
            new Filter({
              filters: aStatusFilters,
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
        var oTable = this.byId("milestonesTable");
        var oBinding = oTable.getBinding("rows");

        if (aFilters.length > 0) {
          oBinding.filter(
            new Filter({
              filters: aFilters,
              and: true // Status AND Owner together
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

        var oStatusMCB = oView.byId("statusFilter");
        var oOwnerMCB = oView.byId("ownerFilter");

        // clear selections in dialog
        if (oStatusMCB) oStatusMCB.removeAllSelectedItems();
        if (oOwnerMCB) oOwnerMCB.removeAllSelectedItems();

        // remove filters from table
        var oTable = this.byId("milestonesTable");
        var oBinding = oTable.getBinding("rows");
        oBinding.filter([]);

        sap.m.MessageToast.show("Filters cleared");
      },
      onClear: function() {
        var oTable = this.byId("milestonesTable");
        oTable.getBinding("rows").filter([]);
        this.handleResetFilters();
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
