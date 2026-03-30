sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.CreateTask", {
        
        onInit: function () {
        //    this.getView().setModel(models.projectsModel(), "projectsModel");
           this.getOwnerComponent().getRouter().getRoute("CreateTask").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched : function (oEvent) {
            // Clear input fields when the route is matched
            
        },
        onCreateTask: function(){
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            // var project = this.getView().byId("inpProject").getValue();
            // var milestone = this.getView().byId("inpMilestone").getValue();
            // var flag = this.getView().byId("flagCB").getSelectedKey();
            // var owner = this.getView().byId("ownerCB").getSelectedKey();
            // var sDate = this.getView().byId("sDate").getValue();
            // var eDate = this.getView().byId("eDate").getValue();
            // var businessOwner = this.getView().byId("businessOwnerCB").getSelectedKey();

            // var payload = {
            //     "project": project,
            //     "milestone": milestone,
            //     "flag": flag,
            //     "owner": owner,
            //     "startDate": sDate,
            //     "endDate": eDate,
            //     "businessOwner": businessOwner
            // };
           
            // var milestones = that.getView().getModel("projectsModel").getProperty("/tasks") || [];
            // milestones.push(payload);
            // this.getView().setModel(new JSONModel({ milestones: milestones }), "projectsModel");
            // console.log("Task created successfully:", payload);
        }
        
    });
});