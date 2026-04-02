sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, Device, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.EditMilestone", {

        onInit: function () {        
           this.getOwnerComponent().getRouter().getRoute("EditMilestone")
           .attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched : function (oEvent) {
            // Clear input fields when the route is matched
        //    this.getView().busy(true);
           let milestoneName = oEvent.getParameter("arguments").milestoneName;
           let that=this;
           const oModel  = this.getView().getModel();

              oModel.read("/MilestonesSet('"+milestoneName+"')", {
                success: function (oData) {
                    if (oData) {
                        // that.getView().busy(false);
                        // created a jsonmodel
                        var oJsonModel = new JSONModel(oData);
                        that.getView().setModel(oJsonModel, "projectModel");
                        console.log("Milestones Data:", oData);
                    }
                },
                error: function (oError) {
                    // that.getView().busy(false);
                    console.error("Error while reading Milestones:", oError);
                }
            });


        },
        onEditSave : function(){
            const oModel = this.getView().getModel();

            const payload = this.getView().getModel("projectModel").getData().project;

            oModel.update("/ProjectsSet('"+payload.ProjectID+"')", payload,  {
                success : function(){
                    console.log("Projects Data:", oData.results);
                },
                error: function (oError) {
                    console.error("Error while Updating Projects:", oError);
                }
            })
        }
       
        
        });
        
      });