sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, Device, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.EditProject", {
      onInit: function() {
        this.getOwnerComponent()
          .getRouter()
          .getRoute("EditProject")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        // Clear input fields when the route is matched
        let projectID = oEvent.getParameter("arguments").projectID;
        let that = this;
        this.getView().setBusy(true);
        const oModel = this.getView().getModel();

        oModel.read("/ProjectsSet('" + projectID + "')", {
          success: function(oData) {
            if (oData) {
              var oJsonModel = new JSONModel(oData);
              that.getView().setModel(oJsonModel, "projectModel");
              // console.log("Projects Data:", oData);
              that.getView().setBusy(false);
            }
          },
          error: function(oError) {
            console.error("Error while reading Projects:", oError);
            that.getView().setBusy(false);
          }
        });
      },
      onSaveProject: function() {
        var that = this;
        const oModel = this.getView().getModel();

        const payload = this.getView().getModel("projectModel").getData();

        // ✅ Fix timezone issue for EndDate
        if (payload.EndDate) {
          let oEndDate = new Date(payload.EndDate);
          oEndDate.setHours(12, 0, 0, 0); // 🔥 Prevent date shift
          payload.EndDate = oEndDate;
        }

        // ✅ Fix for StartDate also (important!)
        if (payload.StartDate) {
          let oStartDate = new Date(payload.StartDate);
          oStartDate.setHours(12, 0, 0, 0);
          payload.StartDate = oStartDate;
        }

        console.log("Payload for update:", payload);

        oModel.update("/ProjectsSet('" + payload.ProjectID + "')", payload, {
          success: function() {
            MessageBox.success("Project updated successfully!",{
                title: "Success",
                actions: [MessageBox.Action.OK],
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            that.navBack();
                        }
                }
            });
          },
          error: function(oError) {
            console.error("Error while Updating Projects:", oError);
            MessageBox.error("Error while updating project. Please try again.");
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
      navBack: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Projects");
      }
    });
  }
);
