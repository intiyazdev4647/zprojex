sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, Device, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.EditProject", {

        onInit: function () {        
           this.getOwnerComponent().getRouter().getRoute("EditProject")
           .attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched : function (oEvent) {
            // Clear input fields when the route is matched
           let projectID = oEvent.getParameter("arguments").projectID;
           let that=this;
           const oModel  = this.getView().getModel();

              oModel.read("/ProjectsSet('"+projectID+"')", {
                success: function (oData) {
                    if (oData) {
                        var oJsonModel = new JSONModel({
                            "project" : {}
                        });
                        oJsonModel.setProperty("/project",oData);
                        that.getView().setModel(oJsonModel, "projectModel");
                        console.log("Projects Data:", oData.results);
                    }
                },
                error: function (oError) {
                    console.error("Error while reading Projects:", oError);
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