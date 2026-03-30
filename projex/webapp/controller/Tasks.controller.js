sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Tasks", {
        
        onInit: function () {
            this.loadTasksData();
            // this.getView().setModel(models.projectsModel(), "projectsModel");
        },
        loadTasksData: function () {
            var oModel = this.getOwnerComponent().getModel();
            var that = this;
            oModel.read("/TasksSet", {
                success: function (oData) {
                    if (oData && oData.results) {
                        var oJsonModel = new JSONModel({
                            "tasks" : []
                        });
                        oJsonModel.setProperty("/tasks",oData.results);
                        that.getView().setModel(oJsonModel, "projectsModel");
                    }
                },
                error: function (oError) {
                    console.error("Error while reading Tasks:", oError);
                }
            });
        },
        onAddTask: function(){
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("CreateTask");
         }
        
    });
});