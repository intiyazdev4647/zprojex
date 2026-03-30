sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, MessageBox,JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.displayProjects", {
        
       onCreate : function(){
        const oModel = this.getView().getModel();
/**
 * <d:ProjectID>Project1</d:ProjectID>
<d:ProjectName>Test Project 1</d:ProjectName>
<d:Description>Test Project 1</d:Description>
<d:Completion/>
<d:Owner>IPT.ABAP03</d:Owner>
<d:Tasks/>
<d:Milestones/>
<d:StartDate>2026-03-10T00:00:00</d:StartDate>
<d:EndDate>2026-05-10T00:00:00</d:EndDate>
<d:Department>IT</d:Department>
<d:Site>Banglore</d:Site>
<d:BusProjMngr>IEH.10093808</d:BusProjMngr>
<d:Email>kumar.c@in.ennovi.com</d:Email>
<d:CountryCode>+91</d:CountryCode>
<d:MobilePhone>9876543210</d:MobilePhone>
 */
        const payLoad = {
            ProjectID : this.getView().byId("ProjectID").getValue(),
            ProjectName : this.getView().byId("ProjectName").getValue(),
            Description : this.getView().byId("Description").getValue(),
            Completion : this.getView().byId("Completion").getValue(),
            Owner : this.getView().byId("Owner").getValue(),
            Tasks : this.getView().byId("Tasks").getValue(),
            Milestones : this.getView().byId("Milestones").getValue(),
            StartDate : this.getView().byId("StartDate").getValue(),
             EndDate : this.getView().byId("EndDate").getValue(),
              Department : this.getView().byId("Department").getValue(),
               Site : this.getView().byId("Site").getValue(),
                BusProjMngr : this.getView().byId("BusProjMngr").getValue(),
             Email : this.getView().byId("Email").getValue(),
              CountryCode : this.getView().byId("CountryCode").getValue(),
               MobilePhone : this.getView().byId("MobilePhone").getValue(),

            

        } 

         oModel.create("/ProjectsSet", payLoad, {
            success :function(){},
            error : function(){}
       });

       },
       onCancel : function(){
        this.getOwnerComponent().getRouter().navTo("Home");
       }

      
     
        
    });
});