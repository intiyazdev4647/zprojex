sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.CreateProject", {
      onInit: function() {
        //    this.getView().setModel(models.projectsModel(), "projectsModel");
        this.getOwnerComponent()
          .getRouter()
          .getRoute("CreateProjects")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        this.clearFields();
      },
      clearFields: function() {
        // Clear input fields when the route is matched
        this.getView().byId("inpProjId").setValue("");
        this.getView().byId("inpProjName").setValue("");
        this.getView().byId("inpProjOwner").setValue("");
        this.getView().byId("inpProjDesc").setValue("");
        this.getView().byId("startD").setValue("");
        this.getView().byId("endD").setValue("");
        this.getView().byId("idDepartment").setValue("");
        this.getView().byId("idSite").setValue("");
        this.getView().byId("idEmail").setValue("");
        this.getView().byId("idPhone").setValue("");
        this.getView().byId("idBusinessPM").setValue("");
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
      onCreateProject: function() {
        var that = this;
        var oView = this.getView();

        // Controls
        var oProjId = oView.byId("inpProjId");
        var oProjName = oView.byId("inpProjName");
        var oProjOwner = oView.byId("inpProjOwner");
        var oProjDesc = oView.byId("inpProjDesc");
        var oStartDate = oView.byId("startD");
        var oEndDate = oView.byId("endD");
        var oDept = oView.byId("idDepartment");
        var oSite = oView.byId("idSite");
        var oCountryCode = oView.byId("countryCodeCB");

        // Reset Value States
        [
          oProjId,
          oProjName,
          oProjOwner,
          oProjDesc,
          oStartDate,
          oEndDate,
          oDept,
          oSite
        ].forEach(function(oField) {
          oField.setValueState("None");
        });

        var bError = false;

        // Generic Validation
        function validateInput(oField, sMessage) {
          var bValid = true;

          // For MultiComboBox
          if (oField.isA("sap.m.MultiComboBox")) {
            bValid = oField.getSelectedKeys().length > 0;
          } else {
            bValid = !!oField.getValue().trim();
          }

          if (!bValid) {
            oField.setValueState("Error");
            oField.setValueStateText(sMessage);
            bError = true;
          }
        }

        // Mandatory validations
        validateInput(oProjId, "Project Id is required");
        validateInput(oProjName, "Project Name is required");
        validateInput(oProjOwner, "Project Owner is required");
        validateInput(oProjDesc, "Project Description is required");
        validateInput(oStartDate, "Start Date is required");
        validateInput(oDept, "Department is required");
        validateInput(oSite, "Site is required");

        // Stop if validation failed
        if (bError) {
          sap.m.MessageBox.error("Please fill all mandatory fields");
          return;
        }

        // Project ID regex validation
        var sProjectId = oProjId.getValue().trim();
        var oRegExp = /^[a-zA-Z0-9_-]{5,20}$/;

        if (!oRegExp.test(sProjectId)) {
          oProjId.setValueState("Error");
          oProjId.setValueStateText(
            "Project ID must be 5-20 characters and can contain letters, numbers, hyphen (-), and underscore (_)"
          );

          sap.m.MessageBox.error("Invalid Project ID");
          return;
        }

        // Date Validation
        var dStartDate = oStartDate.getDateValue();
        var dEndDate = oEndDate.getDateValue();

        if (dEndDate && dEndDate < dStartDate) {
          oEndDate.setValueState("Error");
          oEndDate.setValueStateText("End Date cannot be before Start Date");

          sap.m.MessageBox.error("Invalid date range");
          return;
        }

        // Payload
        var payload = {
          ProjectID: sProjectId,

          ProjectName: oProjName.getValue().trim(),

          // MultiComboBox values
          Owner: oProjOwner.getSelectedKeys().join(","),

          Description: oProjDesc.getValue().trim(),

          StartDate: dStartDate,

          EndDate: dEndDate,

          Department: oDept.getSelectedKeys().join(","),

          Site: oSite.getSelectedKeys().join(","),

          Email: oView.byId("idEmail").getValue().trim(),

          MobilePhone: oView.byId("idPhone").getValue().trim(),

          BusProjMngr: oView.byId("idBusinessPM").getValue().trim(),

          CountryCode: oCountryCode.getSelectedKey()
        };

        // Prevent timezone shift
        if (payload.StartDate) {
          payload.StartDate.setHours(12, 0, 0, 0);
        }

        if (payload.EndDate) {
          payload.EndDate.setHours(12, 0, 0, 0);
        }

        // Create OData Entry
        var oModel = oView.getModel();

        oModel.create("/ProjectsSet", payload, {
          success: function() {
            sap.m.MessageBox.success("Project created successfully!", {
              title: "Success",

              onClose: function() {
                that.getOwnerComponent().getRouter().navTo("Projects");
              }
            });
          },

          error: function(oError) {
            console.error("Error while creating project:", oError);

            sap.m.MessageBox.error(
              "Error while creating project. Please try again."
            );
          }
        });
      },
      projectIdChange: function(oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue().trim();

        // If empty, remove error state
        if (!sValue) {
          oInput.setValueState("None");
          return;
        }

        // Allows:
        // letters, numbers, hyphen (-), underscore (_)
        // length: 5 to 20
        // no spaces
        var oRegExp = /^[a-zA-Z0-9_-]{5,20}$/;

        if (!oRegExp.test(sValue)) {
          oInput.setValueState("Error");
          oInput.setValueStateText(
            "Project ID must be 5-20 characters and can contain letters, numbers, hyphen (-), and underscore (_)"
          );
        } else {
          oInput.setValueState("None");
        }
      },
      onCancel: function() {
        var that = this;
        MessageBox.confirm(
          "Are you sure you want to cancel? All unsaved changes will be lost.",
          {
            title: "Confirm Cancel",
            actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            onClose: function(oAction) {
              if (oAction === MessageBox.Action.YES) {
                that.getOwnerComponent().getRouter().navTo("Projects");
              }
            }
          }
        );
      }
    });
  }
);
