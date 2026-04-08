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
      onCreateProject: function() {
        var that = this;
        var oView = this.getView();

        // Get all fields
        var oProjId = oView.byId("inpProjId");
        var oProjName = oView.byId("inpProjName");
        var oProjOwner = oView.byId("inpProjOwner");
        var oProjDesc = oView.byId("inpProjDesc");
        var oStartDate = oView.byId("startD");
        var oEndDate = oView.byId("endD");
        var oDept = oView.byId("idDepartment");
        var oSite = oView.byId("idSite");

        // Reset value states
        var aFields = [
          oProjId,
          oProjName,
          oProjOwner,
          oProjDesc,
          oStartDate,
          oDept,
          oSite
        ];
        aFields.forEach(function(oField) {
          oField.setValueState("None");
        });

        var bError = false;

        // Validation function
        function validateField(oField, message) {
          if (!oField.getValue()) {
            oField.setValueState("Error");
            oField.setValueStateText(message);
            bError = true;
          }
        }

        // Mandatory field checks
        validateField(oProjId, "Project Id is required");
        validateField(oProjName, "Project Name is required");
        validateField(oProjOwner, "Project Owner is required");
        validateField(oProjDesc, "Project Description is required");
        validateField(oStartDate, "Start Date is required");
        validateField(oDept, "Department is required");
        validateField(oSite, "Site is required");

        // Stop if error
        if (bError) {
          sap.m.MessageBox.error("Please fill all mandatory fields");
          return;
        }

        // Additional validation (Date check)
        var startDate = new Date(oStartDate.getValue());
        var endDate = new Date(oEndDate.getValue());

        if (oEndDate.getValue() && endDate < startDate) {
          oEndDate.setValueState("Error");
          oEndDate.setValueStateText("End Date cannot be before Start Date");
          sap.m.MessageBox.error("Invalid date range");
          return;
        }

        // Prepare payload
        var payload = {
          ProjectID: oProjId.getValue(),
          ProjectName: oProjName.getValue(),
          Owner: oProjOwner.getValue(),
          Description: oProjDesc.getValue(),
          StartDate: oStartDate.getDateValue(),
          EndDate: oEndDate.getDateValue(),
          Department: oDept.getValue(),
          Site: oSite.getValue(),
          Email: oView.byId("idEmail").getValue(),
          MobilePhone: oView.byId("idPhone").getValue(),
          BusProjMngr: oView.byId("idBusinessPM").getValue(),
          CountryCode: oView.byId("countryCodeCB").getSelectedKey()
        };
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
        var that = this;
        var oModel = this.getView().getModel();
        oModel.create("/ProjectsSet", payload, {
            success: function() {
                MessageBox.success("Project created successfully!",{
                    title: "Success",
                    actions: [MessageBox.Action.OK],
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            that.getOwnerComponent().getRouter().navTo("Projects");
                        }
                    }
                });
            },error: function(oError) {
                console.error("Error while creating project:", oError);
                MessageBox.error("Error while creating project. Please try again.");
            }
        }); 
      },
      projectIdChange: function(oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        // Simple validation: Project ID must be alphanumeric and 5-10 characters and no spaces in between
        var oRegExp = /^[a-zA-Z0-9]{5,10}$/;

        if (!oRegExp.test(sValue)) {
          oInput.setValueState("Error");
          oInput.setValueStateText(
            "Project ID must be 5-10 characters, alphanumeric, and no spaces"
          );
        } else {
          oInput.setValueState("None");
        }

        
      },
      onCancel: function() {
        var that = this;
        MessageBox.confirm("Are you sure you want to cancel? All unsaved changes will be lost.", {
          title: "Confirm Cancel",
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function(oAction) {
            if (oAction === MessageBox.Action.YES) {
              that.getOwnerComponent().getRouter().navTo("Projects");
            }
      }
    });
  }
 });
});
