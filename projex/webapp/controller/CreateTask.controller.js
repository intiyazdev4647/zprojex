sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.CreateTask", {
      onInit: function() {
        //    this.getView().setModel(models.projectsModel(), "projectsModel");
        this.getOwnerComponent()
          .getRouter()
          .getRoute("CreateTask")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        // Clear input fields when the route is matched
      },
      onCreateTask: function() {
        var oView = this.getView();
        var bValid = true;

        // Helper function for validation
        var validateField = function(oControl, sFieldName) {
          var sValue = oControl.getValue
            ? oControl.getValue()
            : oControl.getDateValue();

          if (!sValue) {
            oControl.setValueState("Error");
            oControl.setValueStateText(sFieldName + " is required");
            bValid = false;
          } else {
            oControl.setValueState("None");
          }
        };

        // === Mandatory Fields Validation ===

        validateField(oView.byId("inpProjectName"), "Project Name");
        validateField(oView.byId("inpTaskName"), "Task Name");
        validateField(oView.byId("inpDescription"), "Description");

        validateField(oView.byId("inpOwner"), "Owner");
        validateField(oView.byId("inpCurrentOwner"), "Current Owner");
        validateField(oView.byId("inpCRNature"), "CR Nature");
        validateField(oView.byId("inpChangeType"), "Change Type");

        validateField(oView.byId("inpImpact"), "Impact");

        validateField(oView.byId("inpRegion"), "Region");

        validateField(oView.byId("inpProblemDesc"), "Problem Description");

        // Stop if validation fails
        if (!bValid) {
          sap.m.MessageToast.show("Please fill all mandatory fields");
          return;
        }

        // === Payload Creation ===
        var oPayload = {
          TaskName: oView.byId("inpTaskName").getValue(),
          Description: oView.byId("inpDescription").getValue(),
          ProjectID: oView.byId("inpProjectName").getValue(),

          Owner: oView.byId("inpOwner").getValue(),
          CurrentOwner: oView.byId("inpCurrentOwner").getValue(),
          CRNature: oView.byId("inpCRNature").getValue(),
          ChangeType: oView.byId("inpChangeType").getValue(),
          SolmanCRID: oView.byId("inpSolManCRId").getValue(),

          StartDate: oView.byId("inpStartDate").getDateValue(),
          EndDate: oView.byId("inpDueDate").getDateValue(),

          HDTicketNo: oView.byId("inpHelpDesk").getValue(),
          Sprint: oView.byId("inpSprint").getValue(),

          FuncOwner: oView.byId("inpFuncOwner").getValue(),
          SAPCOEGrp: oView.byId("inpCoEGroup").getValue(),
          Priority: oView.byId("inpPriority").getValue(),
          CRModule: oView.byId("inpModule").getValue(),
          Impact: oView.byId("inpImpact").getValue(),

          // FSDURL: oView.byId("inpFuncSpecUrl").getValue(),
          // FTURL: oView.byId("inpFuncTestScript").getValue(),
          // ConfigDocURL: oView.byId("inpConfigDoc").getValue(),
          // AddDocURL: oView.byId("inpAddDocs").getValue(),

          TechAssessor: oView.byId("inpTechAssessor").getValue(),
          TechDuration: oView.byId("inpDevDuration").getValue(),
          TechDeveloper: oView.byId("inpTechDeveloper").getValue(),
          TechComplexity: oView.byId("inpTechComplexity").getValue(),
          TechStartDate: oView.byId("inpTechStart").getDateValue(),
          TSDURL: oView.byId("inpTechDesignDoc").getValue(),

          RqstrEmail: oView.byId("inpReqEmail").getValue(),
          Site: oView.byId("inpCompanySite").getValue(),
          RqstrPosition: oView.byId("inpRole").getValue(),
          Region: oView.byId("inpRegion").getValue(),

          CountryCode: "+91", // ⚠️ MUST SEND
          MobilePhone: oView.byId("inpContact").getValue(),

          AsIs: oView.byId("inpProblemDesc").getValue(),
          ToBe: oView.byId("inpToBeState").getValue(),
          BRDSPURL: oView.byId("inpBRDLink").getValue(),

          PriorityToImpl: oView.byId("inpPriorityImplement").getValue()

          // BillableType: oView.byId("inpBillType").getValue()
        };

        // === OData Create Call ===
        var oModel = this.getView().getModel();

        oModel.create("/TasksSet", oPayload, {
          success: function() {
            sap.m.MessageBox.success("Task created successfully!");
          },
          error: function() {
            sap.m.MessageBox.error("Error while creating task");
          }
        });
      },
      onFieldLiveChange: function(oEvent) {
        var oControl = oEvent.getSource();

        var sValue = oControl.getValue
          ? oControl.getValue()
          : oControl.getDateValue();

        if (sValue) {
          oControl.setValueState("None");
        }
      },
      taskIdChange: function(oEvent) {
        var oInput = oEvent.getSource();
        var sValue = oInput.getValue();

        // Simple validation: Task ID must be alphanumeric and 5-10 characters and no spaces in between
        var oRegExp = /^[a-zA-Z0-9]{5,10}$/;

        if (!oRegExp.test(sValue)) {
          oInput.setValueState("Error");
          oInput.setValueStateText(
            "Task ID must be 5-10 characters, alphanumeric, and no spaces"
          );
        } else {
          oInput.setValueState("None");
        }
      }
    });
  }
);
