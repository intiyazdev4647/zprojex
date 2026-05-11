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
        this._comboTimer = null;
        this.getOwnerComponent().getModel("userModel").attachRequestCompleted(this.loadDropDownData, this);

        this.getView().findAggregatedObjects(true, function (oControl) {
            return oControl.isA("sap.m.ComboBox");
        }).forEach(function (oCombo) {

            oCombo.addEventDelegate({

                onmouseover: function () {

                    clearTimeout(this._comboTimer);

                    this._comboTimer = setTimeout(function () {

                        if (!oCombo.isOpen()) {
                            oCombo.open();
                        }

                    }, 150);

                }.bind(this),

                onmouseout: function () {
                    clearTimeout(this._comboTimer);
                }.bind(this)

            });

        }.bind(this));
        this.loadProjectsData();
        var oMilestoneModel = new sap.ui.model.json.JSONModel({
          visible: false
        });

        this.getView().setModel(oMilestoneModel, "milestone");
        this.getOwnerComponent()
          .getRouter()
          .getRoute("CreateMilestone")
          .attachPatternMatched(this._onRouteMatched, this);
      },
      _onRouteMatched: function(oEvent) {
        this.clearFields();
      },
      onSelectProject: function(oEvent) {
        var sSelectedKey = oEvent.getSource().getSelectedKey();

        var oMilestoneModel = this.getView().getModel("milestone");

        oMilestoneModel.setProperty("/visible", !!sSelectedKey);
      },
      loadOwnersData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/DropdownSet", {
          urlParameters: {
            $filter: "EntitySet eq 'ProjectsSet'"
          },
          success: function(oData) {
            if (oData && oData.results) {
              var Owners = oData.results
                .filter(item => item.Code === "Owner")
                .map(item => ({ text: item.ValText, key: item.DomVal }));

              var oJsonModel = new JSONModel({
                Owners: Owners
              });
              that.getView().setModel(oJsonModel, "dropdownModel");
              // console.log("Dropdown data:", oJsonModel.getData());
            }
          },
          error: function(oError) {
            console.error("Error while reading Owners:", oError);
          }
        });
      },

      clearFields: function() {
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
            $select: "Owner,BusProjMngr,ProjectID"
          },
          success: function(oData) {
            if (oData && oData.results) {
              var uniqueProjects = [
                ...new Set(oData.results.map(item => item.ProjectID))
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
        var that = this;

        var oView = this.getView();

        var oModel = this.getOwnerComponent().getModel();

        var project = oView.byId("idProjCB").getSelectedKey();

        var milestone = oView.byId("inpMilestone").getValue().trim();

        var flag = oView.byId("flagCB").getSelectedKey();

        var owner = oView.byId("ownerCB").getSelectedKey();

        var sDate = oView.byId("sDate").getDateValue();

        var eDate = oView.byId("eDate").getDateValue();

        var businessOwner = oView.byId("businessOwnerCB").getSelectedKey();

        // Mandatory validation
        if (!project || !milestone || !flag || !owner || !sDate) {
          sap.m.MessageBox.error("Please fill all required fields");

          return;
        }

        // Date validation
        if (eDate && eDate < sDate) {
          sap.m.MessageBox.error("End Date cannot be before Start Date");

          return;
        }

        // Prevent timezone shift
        if (sDate) {
          sDate = new Date(sDate);

          sDate.setHours(12, 0, 0, 0);
        }

        if (eDate) {
          eDate = new Date(eDate);

          eDate.setHours(12, 0, 0, 0);
        }

        var payload = {
          Project: project,

          Name: milestone,

          Flag: flag,

          Owner: owner,

          StartDate: sDate,

          EndDate: eDate,

          BusinessOwner: businessOwner
        };

        console.log("Payload for Milestone Creation:", payload);

        oModel.create("/MilestonesSet", payload, {
          success: function() {
            sap.m.MessageBox.success("Milestone created successfully!", {
              title: "Success",

              actions: [sap.m.MessageBox.Action.OK],

              onClose: function(sAction) {
                if (sAction === sap.m.MessageBox.Action.OK) {
                  that.clearFields();

                  that.navBack();
                }
              }
            });
          },

          error: function(oError) {
            sap.m.MessageToast.show("Error creating milestone.");

            console.error("Error creating milestone:", oError);
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
                that.clearFields();
                that.navBack();
              }
            }
          }
        );
      },
      onAfterRendering: function() {
        var oCombo = this.byId("idProjCB");
        var timer;

        oCombo.$().on("mouseenter", function() {
          timer = setTimeout(function() {
            oCombo.open();
          }, 300);
        });

        oCombo.$().on("mouseleave", function() {
          clearTimeout(timer);
          oCombo.close();
        });
      },
      // milestoneChange: function(oEvent) {
      //   var oInput = oEvent.getSource();
      //   var sValue = oInput.getValue().trim();

      //   // If empty, remove error state
      //   if (!sValue) {
      //     oInput.setValueState("None");
      //     return;
      //   }

      //   // Allows:
      //   // letters, numbers, hyphen (-), underscore (_)
      //   // length: 5 to 20
      //   // no spaces
      //   var oRegExp = /^[a-zA-Z0-9_-]{5,20}$/;

      //   if (!oRegExp.test(sValue)) {
      //     oInput.setValueState("Error");
      //     oInput.setValueStateText(
      //       "Milestone Name must be 5-20 characters and can contain letters, numbers, hyphen (-), and underscore (_)"
      //     );
      //   } else {
      //     oInput.setValueState("None");
      //   }
      // },
      navBack: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Milestones", {}, true);
      }
    });
  }
);
