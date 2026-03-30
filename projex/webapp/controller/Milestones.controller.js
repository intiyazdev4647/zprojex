sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, Fragment, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Milestones", {
      onInit: function() {
        this.loadMilestonesData();
        var oJsonModel = new JSONModel({
              milestones: [
                {
                  ID: "M001",
                  Name: "Project Kickoff",
                  Project: "S/4HANA Migration",
                  Completion: 100,
                  Status: "Completed",
                  Owner: "Ravi Kumar",
                  StartDate: "2026-02-20",
                  EndDate: "2026-03-10"
                },
                {
                  ID: "M002",
                  Name: "Requirement Finalization",
                  Project: "Fiori Launchpad Upgrade",
                  Completion: 60,
                  Status: "In Progress",
                  Owner: "Sneha Reddy",
                  StartDate: "2026-03-01",
                  EndDate: "2026-03-18"
                },
                {
                  ID: "M003",
                  Name: "Design Approval",
                  Project: "Mobile App Development",
                  Completion: 30,
                  Status: "Pending",
                  Owner: "Imran Khan",
                  StartDate: "2026-03-05",
                  EndDate: "2026-03-25"
                },
                {
                  ID: "M004",
                  Name: "Development Completion",
                  Project: "Analytics Dashboard",
                  Completion: 20,
                  Status: "Pending",
                  Owner: "Priya Singh",
                  StartDate: "2026-03-10",
                  EndDate: "2026-04-05"
                },
                {
                  ID: "M005",
                  Name: "Integration Testing",
                  Project: "Cloud Integration Implementation",
                  Completion: 15,
                  Status: "Pending",
                  Owner: "Rahul Das",
                  StartDate: "2026-03-15",
                  EndDate: "2026-04-15"
                },
                {
                  ID: "M006",
                  Name: "User Acceptance Testing",
                  Project: "Workflow Automation",
                  Completion: 10,
                  Status: "Pending",
                  Owner: "Suresh Babu",
                  StartDate: "2026-03-20",
                  EndDate: "2026-04-25"
                },
                {
                  ID: "M007",
                  Name: "Go-Live Preparation",
                  Project: "Performance Optimization",
                  Completion: 25,
                  Status: "Pending",
                  Owner: "Deepak Rao",
                  StartDate: "2026-03-22",
                  EndDate: "2026-05-05"
                },
                {
                  ID: "M008",
                  Name: "Production Go-Live",
                  Project: "Security Enhancement",
                  Completion: 5,
                  Status: "Pending",
                  Owner: "Amit Patel",
                  StartDate: "2026-04-01",
                  EndDate: "2026-05-15"
                },
                {
                  ID: "M009",
                  Name: "Data ValIDation Signoff",
                  Project: "Data Migration Initiative",
                  Completion: 45,
                  Status: "In Progress",
                  Owner: "Vikram Shetty",
                  StartDate: "2026-03-05",
                  EndDate: "2026-04-10"
                },
                {
                  ID: "M010",
                  Name: "Chatbot Prototype Demo",
                  Project: "AI Chatbot Implementation",
                  Completion: 35,
                  Status: "In Progress",
                  Owner: "Farhan Ali",
                  StartDate: "2026-03-12",
                  EndDate: "2026-04-20"
                },
                {
                  ID: "M011",
                  Name: "HR Module Deployment",
                  Project: "HR System Upgrade",
                  Completion: 85,
                  Status: "In Progress",
                  Owner: "Manoj Tiwari",
                  StartDate: "2026-02-28",
                  EndDate: "2026-03-30"
                },
                {
                  ID: "M012",
                  Name: "Frontend Freeze",
                  Project: "E-Commerce Platform Revamp",
                  Completion: 40,
                  Status: "Pending",
                  Owner: "Karthik Iyer",
                  StartDate: "2026-03-18",
                  EndDate: "2026-05-01"
                },
                {
                  ID: "M013",
                  Name: "CRM Go-Live",
                  Project: "CRM Integration",
                  Completion: 55,
                  Status: "In Progress",
                  Owner: "Naveen Gupta",
                  StartDate: "2026-03-10",
                  EndDate: "2026-04-30"
                },
                {
                  ID: "M014",
                  Name: "Supply Chain Audit",
                  Project: "Supply Chain Optimization",
                  Completion: 50,
                  Status: "In Progress",
                  Owner: "Harish NaIDu",
                  StartDate: "2026-03-15",
                  EndDate: "2026-05-10"
                },
                {
                  ID: "M015",
                  Name: "Customer Portal Release",
                  Project: "Customer Portal Enhancement",
                  Completion: 20,
                  Status: "Pending",
                  Owner: "Akash Verma",
                  StartDate: "2026-03-25",
                  EndDate: "2026-05-20"
                },
                {
                  ID: "M016",
                  Name: "CI/CD Production Rollout",
                  Project: "DevOps Automation",
                  Completion: 65,
                  Status: "In Progress",
                  Owner: "Rohit Kulkarni",
                  StartDate: "2026-03-05",
                  EndDate: "2026-04-25"
                },
                {
                  ID: "M017",
                  Name: "Compliance Signoff",
                  Project: "Compliance Audit Program",
                  Completion: 95,
                  Status: "Completed",
                  Owner: "Girish Nambiar",
                  StartDate: "2026-02-20",
                  EndDate: "2026-03-15"
                },
                {
                  ID: "M018",
                  Name: "Disaster Recovery Drill",
                  Project: "Disaster Recovery Setup",
                  Completion: 30,
                  Status: "Pending",
                  Owner: "Tarun Malhotra",
                  StartDate: "2026-03-28",
                  EndDate: "2026-05-30"
                },
                {
                  ID: "M019",
                  Name: "Launchpad Testing Complete",
                  Project: "Fiori Launchpad Upgrade",
                  Completion: 70,
                  Status: "In Progress",
                  Owner: "Sneha Reddy",
                  StartDate: "2026-03-20",
                  EndDate: "2026-04-28"
                },
                {
                  ID: "M020",
                  Name: "Final Data Migration",
                  Project: "S/4HANA Migration",
                  Completion: 50,
                  Status: "In Progress",
                  Owner: "Ravi Kumar",
                  StartDate: "2026-03-22",
                  EndDate: "2026-05-10"
                }
              ]
            });
            this.getView().setModel(oJsonModel, "projectsModel");
            console.log("Milestones data loaded successfully:");
        // this.getView().setModel(models.ProjectsModel(), "ProjectsModel");
      },
      loadMilestonesData: function() {
        var oModel = this.getOwnerComponent().getModel();
        var that = this;
        oModel.read("/MilestonesSet", {
          success: function(oData) {
            if (oData && oData.results) {
              var oJsonModel = new JSONModel({
                milestones: []
              });
              oJsonModel.setProperty("/milestones", oData.results);
              that.getView().setModel(oJsonModel, "projectsModel");
              console.log(
                "Milestones data loaded successfully:",
                oData.results
              );
            }
          },
          error: function(oError) {
            console.error("Error while reading Milestones:", oError);
            
          }
        });
      },
      onFilterPress: function() {
        var oView = this.getView();

        if (!this._pDialog) {
          this._pDialog = Fragment.load({
            id: oView.getId(),
            name: "com.ennovi.projex.fragments.MilestoneFilter",
            controller: this
          }).then(
            function(oDialog) {
              return oDialog;
            }.bind(this)
          );
        }
        this._pDialog.then(function(oDialog) {
            oDialog.setModel(oView.getModel("projectsModel"), "projectsModel");
            oDialog.open();
        });
      },
      onAddMilestone: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("CreateMilestone");
      }
    });
  }
);
