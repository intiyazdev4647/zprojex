sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.CreateMilestone", {
      onInit: function() {
        //    this.getView().setModel(models.projectsModel(), "projectsModel");
        this.loadProjectsData();
        this.getOwnerComponent()
          .getRouter()
          .getRoute("CreateMilestone")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        // Clear input fields when the route is matched
        this.clearFields();
      },
      clearFields: function(){
        this.getView().byId("idProjCB").setSelectedKey("");
        this.getView().byId("inpMilestone").setValue("");
        this.getView().byId("flagCB").setSelectedKey("");
        this.getView().byId("ownerCB").setSelectedKey("");
        this.getView().byId("sDate").setValue("");
        this.getView().byId("eDate").setValue("");
        this.getView().byId("businessOwnerCB").setSelectedKey("");
      },
      loadProjectsData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/ProjectsSet", {
          urlParameters: {
            $select: "Owner,BusProjMngr,ProjectName"
          },
          success: function(oData) {
            if (oData && oData.results) {
              var uniqueProjects = [
                ...new Set(oData.results.map(item => item.ProjectName))
              ];
              var uniqueOwners = [
                ...new Set(oData.results.map(item => item.Owner))
              ];
              var uniqueBusProjMngr = [
                ...new Set(oData.results.map(item => item.BusProjMngr))
              ];

              var oJsonModel = new sap.ui.model.json.JSONModel({
                Projects: uniqueProjects,
                Owners: uniqueOwners,
                BusProjMngrs: uniqueBusProjMngr
              });

              that.getView().setModel(oJsonModel, "projectsModel");

              console.log("Unique Data:", oJsonModel.getData());
            }
          },
          error: function(oError) {
            console.error("Error while reading Projects:", oError);
          }
        });
      },
      onCreateMilestone: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        var project = this.getView().byId("idProjCB").getSelectedKey();
        var milestone = this.getView().byId("inpMilestone").getValue();
        var flag = this.getView().byId("flagCB").getSelectedKey();
        var owner = this.getView().byId("ownerCB").getSelectedKey();
        var sDate = this.getView().byId("sDate").getDateValue();
        var eDate = this.getView().byId("eDate").getDateValue();
        var businessOwner = this.getView()
          .byId("businessOwnerCB")
          .getSelectedKey();

        var payload = {
          Project: project,
          Name: milestone,
          Flag: flag,
          Owner: owner,
          StartDate: "/Date(" + new Date(sDate).getTime() + ")/",
          EndDate: "/Date(" + new Date(eDate).getTime() + ")/"
        //   ,businessOwner: businessOwner
        };
        console.log("Payload for Milestone Creation:", payload);
        var oModel = this.getOwnerComponent().getModel();
        oModel.create("/MilestonesSet", payload, {
            success: function(oData) {
                MessageToast.show("Milestone created successfully!");
                console.log("Milestone created successfully:", oData);
                that.clearFields();
            },
            error: function(oError) {
                MessageToast.show("Error creating milestone.");
                console.error("Error creating milestone:", oError);

            }
        });
       
      }
    });
  }
);
