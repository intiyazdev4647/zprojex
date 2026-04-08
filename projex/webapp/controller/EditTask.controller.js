sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Edittask", {
      onInit: function() {
        //    this.getView().setModel(models.projectsModel(), "projectsModel");
        this.getOwnerComponent()
          .getRouter()
          .getRoute("EditTask")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        let taskID = oEvent.getParameter("arguments").taskID;
        let that = this;
        this.getView().setBusy(true);
        const oModel = this.getView().getModel();
        oModel.read("/TasksSet('" + taskID + "')", {
          success: function(oData) {
            if (oData) {
              var oJsonModel = new JSONModel(oData);
              that.getView().setModel(oJsonModel, "editTaskModel");
              console.log("Task Data:", oData);
              that.getView().setBusy(false);
            }
          },
          error: function(oError) {
            var oModel = that.getView().getModel("editTaskModel");
            if (oModel) {
              oModel.setData({});
            }
            MessageBox.error(
              "Error while reading Task details. Please try again.",
              {
                title: "Error",
                onClose: function() {
                  that.getOwnerComponent().getRouter().navTo("Tasks");
                }
              }
            );
            console.error("Error while reading Task:", oError);
            that.getView().setBusy(false);
          }
        });
      },
      onUpdateTask: function() {
        var oView = this.getView();
        var oModel = this.getView().getModel(); 
        var oData = oView.getModel("editTaskModel").getData();
        var that = this;

        var sPath = "/TasksSet('" + oData.TaskID + "')";

        var oPayload = {
          TaskName: oData.TaskName,
          Description: oData.Description,
          ProjectID: oData.ProjectID,

          Owner: oData.Owner,
          CurrentOwner: oData.CurrentOwner,
          CRNature: oData.CRNature,
          ChangeType: oData.ChangeType,
          SolmanCRID: oData.SolmanCRID,

          StartDate: oData.StartDate,
          EndDate: oData.EndDate,

          HDTicketNo: oData.HDTicketNo,
          Sprint: oData.Sprint,

          FuncOwner: oData.FuncOwner,
          SAPCOEGrp: oData.SAPCOEGrp,
          Priority: oData.Priority,
          CRModule: oData.CRModule,
          Impact: oData.Impact,

          FSDURL: oData.FSDURL,
          FTURL: oData.FTURL,
          ConfigDocURL: oData.ConfigDocURL,
          AddDocURL: oData.AddDocURL,

          TechAssessor: oData.TechAssessor,
          TechDuration: oData.TechDuration,
          TechDeveloper: oData.TechDeveloper,
          TechComplexity: oData.TechComplexity,
          TechStartDate: oData.TechStartDate,
          TSDURL: oData.TSDURL,

          RqstrEmail: oData.RqstrEmail,
          Site: oData.Site,
          RqstrPosition: oData.RqstrPosition,
          Region: oData.Region,

          CountryCode: oData.CountryCode,
          MobilePhone: oData.MobilePhone,

          AsIs: oData.AsIs,
          ToBe: oData.ToBe,
          BRDSPURL: oData.BRDSPURL,

          PriorityToImpl: oData.PriorityToImpl,
          BillableType: oData.BillableType
        };

        oModel.update(sPath, oPayload, {
          success: function() {
            MessageBox.success("Task updated successfully!",{
                title: "Success",
                actions: [MessageBox.Action.OK],
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            that.getOwnerComponent().getRouter().navTo("Tasks");
                        }
                    }
            });
          },
          error: function() {
            MessageBox.error("Update failed", {
                title: "Error"
            });
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
                    that.getOwnerComponent().getRouter().navTo("Tasks");
                }
            }
            }
        );
      }
    });
  }
);
