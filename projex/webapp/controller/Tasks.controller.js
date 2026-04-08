sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Tasks", {
      onInit: function() {
        this.loadTasksData();
        // this.getView().setModel(models.projectsModel(), "projectsModel");
        this.getOwnerComponent()
          .getRouter()
          .getRoute("Tasks")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function() {
        this.loadTasksData();
      },
      loadTasksData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/TasksSet", {
          success: function(oData) {
            if (oData && oData.results) {
              var oJsonModel = new JSONModel({
                tasks: []
              });
              oJsonModel.setProperty("/tasks", oData.results);
              that.getView().setModel(oJsonModel, "projectsModel");
            }
          },
          error: function(oError) {
            console.error("Error while reading Tasks:", oError);
          }
        });
      },
      onAddTask: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("CreateTask");
      },
      onTaskPress: function(oEvent) {
        var oSource = oEvent.getSource();
        var oContext = oSource.getBindingContext("projectsModel");
        var oData = oContext.getObject();

        // Navigate to Edit View
        var oRouter = this.getOwnerComponent().getRouter();

        oRouter.navTo("EditTask", {
          taskID: oData.TaskID
        });

        // Store selected data globally (simple approach)
        sap.ui
          .getCore()
          .setModel(new sap.ui.model.json.JSONModel(oData), "editTaskModel");
      }
    });
  }
);
