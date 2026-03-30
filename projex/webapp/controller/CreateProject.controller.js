sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.CreateProject", {
        
        onInit: function () {
        //    this.getView().setModel(models.projectsModel(), "projectsModel");
           this.getOwnerComponent().getRouter().getRoute("CreateProjects").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched : function (oEvent) {
            // Clear input fields when the route is matched
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
        onCreateProject: function(){
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            var projectName = this.getView().byId("inpProjName").getValue();
            var projectOwner = this.getView().byId("inpProjOwner").getValue();
            var projectDesc = this.getView().byId("inpProjDesc").getValue();
            var startDate = this.getView().byId("startD").getValue();
            var endDate = this.getView().byId("endD").getValue();
            var department = this.getView().byId("idDepartment").getValue();
            var site = this.getView().byId("idSite").getValue();
            var email = this.getView().byId("idEmail").getValue();
            var phone = this.getView().byId("idPhone").getValue();
            var businessPM = this.getView().byId("idBusinessPM").getValue();
            var eDate = this.getView().byId("endD").getValue();

            var payload = {
                "project": projectName,
                "owner": projectOwner,
                "description": projectDesc,
                "startDate": startDate,
                "endDate": endDate,
                "department": department,
                "site": site,
                "email": email,
                "phone": phone,
                "businessPM": businessPM
            };
                
            // add this payload object to the projects array in the projectModel
            var projects = that.getView().getModel("projectsModel").getProperty("/projects") || [];
            projects.push(payload);
            this.getView().setModel(new JSONModel({ projects: projects }), "projectsModel");
            console.log("Project created successfully:", payload);
        }
        
    });
});