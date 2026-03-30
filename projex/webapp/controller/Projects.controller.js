sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, MessageBox,JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Projects", {
        
        onInit: function () {
            var oJsonModel = new JSONModel({});
            this.getView().setModel(oJsonModel, "projectsModel");
            this.loadProjectsData();
            this.loadRolesData()
        },
        loadProjectsData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            oModel.read("/ProjectsSet", {
                success: function (oData) {
                    if (oData && oData.results) {
                        var oJsonModel = that.getView().getModel("projectsModel");
                        oJsonModel.setProperty("/projects",oData.results);
                        that.getView().setModel(oJsonModel, "projectsModel");
                        // console.log("Projects Data:", oData.results);
                    }
                },
                error: function (oError) {
                    console.error("Error while reading Projects:", oError);
                }
            });
        },
        loadRolesData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            oModel.read("/RolesSet", {
                urlParameters: {
                    "$select": "Projects"
                },
                success: function (oData) {
                    if (oData && oData.results) {
                        var oJsonModel = that.getView().getModel("projectsModel");
                        oJsonModel.setProperty("/roles",oData.results);
                        that.getView().setModel(oJsonModel, "projectsModel");
                        console.log("Roles Data:", oData.results);
                    }
                    },
                error: function (oError) {
                    console.error("Error while reading Roles:", oError);
                }
            });
        },
        onAddProject: function(){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("CreateProjects");
        }
        
        
    });
});