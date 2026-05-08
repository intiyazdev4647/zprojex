sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, Device, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.EditMilestone", {
      onInit: function() {
        this.getOwnerComponent()
          .getRouter()
          .getRoute("EditMilestone")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        // Clear input fields when the route is matched
        this.loadOwnersData();
        this.getView().setBusy(true);
        this.loadProjectsData();
        let milestoneName = oEvent.getParameter("arguments").milestoneName;
        var that = this;
        const oModel = this.getView().getModel();
        oModel.read(`/MilestonesSet('${milestoneName}')`, {
          success: function(oData) {
            if (oData) {
              that.getView().setBusy(false);
              // created a jsonmodel
              var oJsonModel = new JSONModel(oData);
              that.getView().setModel(oJsonModel, "projectModel");
              console.log("Milestones Data:", oData);
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
                  that.navBack();
                }
              }
            );
            console.error("Error while reading Milestones:", oError);
          }
        });
      },
      loadProjectsData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/ProjectsSet", {
          urlParameters: {
            $select: "Owner,BusProjMngr,ProjectID"
          },
          success: function(oData) {
            if (oData && oData.results) {
              var uniqueProjects = [
                ...new Set(oData.results.map(item => item.ProjectID))
              ];
              var uniqueOwners = [
                ...new Set(oData.results.map(item => item.Owner))
              ];
              var uniqueBusProjMngr = [
                ...new Set(oData.results.map(item => item.BusProjMngr))
              ];

              var oJsonModel = new sap.ui.model.json.JSONModel({
                Projects: uniqueProjects,
                Owners: uniqueOwners,
                BusProjMngrs: uniqueBusProjMngr
              });

              that.getView().setModel(oJsonModel, "projectsModel");

              console.log("Unique Data:", oJsonModel.getData());
            }
          },
          error: function(oError) {
            console.error("Error while reading Projects:", oError);
          }
        });
      },
      onSaveMilestone: function() {
        const oModel = this.getView().getModel();

        var that = this;

        const payload = Object.assign(
          {},
          this.getView().getModel("projectModel").getData()
        );

        // Prevent timezone/date shift issue
        // Replace "StartDate" and "EndDate"
        // with your actual date field names

        if (payload.StartDate) {
          payload.StartDate = new Date(payload.StartDate);

          payload.StartDate.setHours(12, 0, 0, 0);
        }

        if (payload.EndDate) {
          payload.EndDate = new Date(payload.EndDate);

          payload.EndDate.setHours(12, 0, 0, 0);
        }

        console.log("Payload for update:", payload);

        oModel.update("/MilestonesSet('" + payload.Name + "')", payload, {
          success: function() {
            sap.m.MessageBox.success("Milestone updated successfully!", {
              title: "Success",

              actions: [sap.m.MessageBox.Action.OK],

              onClose: function(oAction) {
                if (oAction === sap.m.MessageBox.Action.OK) {
                  that.navBack();
                }
              }
            });
          },

          error: function(oError) {
            console.error("Error while Updating Milestones:", oError);

            sap.m.MessageBox.error("Error while updating milestone");
          }
        });
      },
      onCancel: function() {
        var that = this;
        MessageBox.confirm(
          "Are you sure you want to cancel? Unsaved changes will be lost.",
          {
            title: "Confirm Cancel",
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function(oAction) {
              if (oAction === MessageBox.Action.YES) {
                that.navBack();
              }
            }
          }
        );
      },
      loadOwnersData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/DropdownSet", {
          urlParameters: {
            $filter: "EntitySet eq 'ProjectsSet'"
          },
          success: function(oData) {
            if (oData && oData.results) {
              var Owners = oData.results
                .filter(item => item.Code === "Owner")
                .map(item => ({ text: item.ValText, key: item.DomVal }));

              var oJsonModel = new JSONModel({
                Owners: Owners
              });
              that.getView().setModel(oJsonModel, "dropdownModel");
              // console.log("Dropdown data:", oJsonModel.getData());
            }
          },
          error: function(oError) {
            console.error("Error while reading Owners:", oError);
          }
        });
      },
      navBack: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Milestones", {}, true);
      }
    });
  }
);
