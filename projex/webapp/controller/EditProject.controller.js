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
        this.loadDropDownData();
        // Clear input fields when the route is matched
        let projectID = oEvent.getParameter("arguments").projectID;
        let that = this;
        this.getView().setBusy(true);
        const oModel = this.getView().getModel();

        oModel.read("/ProjectsSet('" + projectID + "')", {
          success: function(oData) {
            if (oData) {
              // Convert comma separated string to array
              if (oData.Owner) {
                oData.Owner = oData.Owner.split(",");
              }

              // Optional for other MultiComboBoxes
              if (oData.Department) {
                oData.Department = oData.Department.split(",");
              }

              if (oData.Site) {
                oData.Site = oData.Site.split(",");
              }

              var oJsonModel = new JSONModel(oData);

              that.getView().setModel(oJsonModel, "projectModel");

              console.log("Projects Data:", oData);

              that.getView().setBusy(false);
            }
          },

          error: function(oError) {
            console.error("Error while reading Projects:", oError);

            that.getView().setBusy(false);
          }
        });
      },
      loadDropDownData: function(oEvent) {
        var oView = this.getView();
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
              var Sites = oData.results
                .filter(item => item.Code === "Site")
                .map(item => ({ text: item.ValText, key: item.DomVal }));
              var Departments = oData.results
                .filter(item => item.Code === "Department")
                .map(item => ({ text: item.ValText, key: item.DomVal }));
              var CountryCode = oData.results
                .filter(item => item.Code === "Country Code")
                .map(item => ({ text: item.ValText, key: item.DomVal }));
              console.log("Owners from OData:", Owners);
              console.log("Sites from OData:", Sites);
              console.log("Country Codes from OData:", CountryCode);
              console.log("Department from OData:", Departments);

              var oJsonModel = new JSONModel({
                Owners: Owners,
                Sites: Sites,
                Departments: Departments,
                CountryCodes: CountryCode
              });
              that.getView().setModel(oJsonModel, "dropdownModel");
              console.log("Dropdown data:", oJsonModel.getData());
            }
          },
          error: function(oError) {
            console.error("Error while reading Owners:", oError);
          }
        });
      },
      onSaveProject: function() {
        var that = this;

        var oView = this.getView();

        var oModel = oView.getModel();

        var oProjectModel = oView.getModel("projectModel");

        var payload = Object.assign({}, oProjectModel.getData());

        // Mandatory field validation
        var aRequiredFields = [
          payload.ProjectName,
          payload.Owner,
          payload.Description,
          payload.StartDate,
          payload.Department,
          payload.Site
        ];

        var bMissingField = aRequiredFields.some(function(vField) {
          if (Array.isArray(vField)) {
            return vField.length === 0;
          }

          return !vField;
        });

        if (bMissingField) {
          sap.m.MessageBox.error("Please fill all required fields");

          return;
        }

        // Date Validation
        if (
          payload.EndDate &&
          new Date(payload.EndDate) < new Date(payload.StartDate)
        ) {
          sap.m.MessageBox.error("End Date cannot be before Start Date");

          return;
        }

        // Convert arrays to comma separated string
        if (Array.isArray(payload.Owner)) {
          payload.Owner = payload.Owner.join(",");
        }

        if (Array.isArray(payload.Department)) {
          payload.Department = payload.Department.join(",");
        }

        if (Array.isArray(payload.Site)) {
          payload.Site = payload.Site.join(",");
        }

        // Prevent timezone shift
        if (payload.StartDate) {
          payload.StartDate = new Date(payload.StartDate);

          payload.StartDate.setHours(12, 0, 0, 0);
        }

        if (payload.EndDate) {
          payload.EndDate = new Date(payload.EndDate);

          payload.EndDate.setHours(12, 0, 0, 0);
        }

        console.log("Payload for update:", payload);

        // Update Project
        oModel.update("/ProjectsSet('" + payload.ProjectID + "')", payload, {
          success: function() {
            sap.m.MessageBox.success("Project updated successfully!", {
              title: "Success",

              onClose: function() {
                that.navBack();
              }
            });
          },

          error: function(oError) {
            console.error("Error while Updating Projects:", oError);

            sap.m.MessageBox.error(
              "Error while updating project. Please try again."
            );
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
