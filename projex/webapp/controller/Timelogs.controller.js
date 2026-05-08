sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
  ],
  function(Controller, MessageBox, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("com.ennovi.projex.controller.Timelogs", {
      onInit: function() {
        this.getOwnerComponent()
          .getRouter()
          .getRoute("TimeLogs")
          .attachPatternMatched(this._onRouteMatched, this);
        var today = new Date();
        var startOfWeek = this._getStartOfWeek(today);
        var endOfWeek = this._getEndOfWeek(startOfWeek);
        var oView = this.getView();
        this.loadWeekDaysDetails(startOfWeek, endOfWeek);
        var oJsonModel = new JSONModel({
          timelogs: [
            {
              isGroup: true,
              date: new Date(2026, 3, 22),
              hours: "08:00",
              children: [
                {
                  logTitle: "ProjeX",
                  project: "SAP Change Request",
                  hours: "01:00",
                  user: "Kumar CHIRIGU",
                  billingType: "Billable"
                },
                {
                  logTitle: "ZPEPO - URL Issue",
                  project: "SAP Change Request",
                  hours: "02:00",
                  user: "Kumar CHIRIGU",
                  billingType: "Billable"
                }
              ]
            },
            {
              isGroup: true,
              date: new Date(2026, 3, 21),
              hours: "08:00",
              children: [
                {
                  logTitle: "ProjeX",
                  project: "SAP Change Request",
                  hours: "03:00",
                  user: "Kumar CHIRIGU",
                  billingType: "Billable"
                }
              ]
            }
          ]
        });
        console.log(oJsonModel.getData());
        oView.setModel(oJsonModel, "projectsModel");
        
        this._allData = oJsonModel.getProperty("/timelogs");
      },
      _onRouteMatched: function(oEvent) {
        this._setCurrentWeek(new Date());
        oView.getModel("projectsModel").setProperty("/isNextEnabled", "true");
      },
      formatDate: function(date) {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
          return null;
        }
        var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
          pattern: "yyyy-MM-dd",
          style: "long"
        });
        return oDateFormat.format(date) + "T00:00:00";
      },

      _setCurrentWeek: function(date) {
        const oModel = this.getView().getModel("projectsModel");

        const d = new Date(date);
        const day = d.getDay();

        const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
        const start = new Date(d.setDate(diffToMonday));
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        // Week number calculation
        const oneJan = new Date(start.getFullYear(), 0, 1);
        const week = Math.ceil(
          ((start - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
        );

        const format = dt => dt.toLocaleDateString("en-GB"); // DD/MM/YYYY

        const text = `${format(start)} to ${format(end)}`;

        oModel.setProperty("/currentWeekText", text);
        oModel.setProperty("/weekStart", start);
        oModel.setProperty("/weekEnd", end);

        this._filterByDate(start, end);
      },
      onPrevWeek: function() {
        const oModel = this.getView().getModel("projectsModel");
        const start = new Date(oModel.getProperty("/weekStart"));
        start.setDate(start.getDate() - 7);
        this._setCurrentWeek(start);
      },

      onNextWeek: function() {
        const oModel = this.getView().getModel("projectsModel");
        const start = new Date(oModel.getProperty("/weekStart"));
        start.setDate(start.getDate() + 7);
        this._setCurrentWeek(start);
      },
      onDateRangeChange: function(oEvent) {
        const start = oEvent.getParameter("from");
        const end = oEvent.getParameter("to");

        if (start && end) {
          this._filterByDate(start, end);
        }
      },
      _filterByDate: function(start, end) {
        const oModel = this.getView().getModel("projectsModel");

        const filtered = this._allData
          .map(group => {
            const groupDate = new Date(group.date);

            if (groupDate >= start && groupDate <= end) {
              return {
                ...group,
                children: group.children || []
              };
            }

            return null;
          })
          .filter(Boolean);

        oModel.setProperty("/timelogs", filtered);
      },
      loadWeekDaysDetails: function(startOfWeek, endOfWeek) {
        var that = this;
        var oDataModel = this.getOwnerComponent().getModel("ZCA_TRACKER_SRV");
        var aFilters = this._createTimesheetFilters(startOfWeek, endOfWeek);

        oDataModel.read("/TimesheetSet", {
          filters: aFilters,
          success: function(oData) {
            var lopUpdateModel = that.getView().getModel("lopUpdateModel");
            // var modelData = lopUpdateModel.getData();

            // modelData.timesheetData = oData.results;
            console.log(oData.results);

            //   that.processTimesheetData(modelData.timesheetData, modelData);
          },
          error: function(oError) {
            console.log(oError);
          }
        });
      },
      _createTimesheetFilters: function(startDate, endDate) {
        var startDateFormatted = this.formatDate(startDate);
        var endDateFormatted = this.formatDate(endDate);

        var aFilters = [
          new sap.ui.model.Filter(
            "CreatedAt",
            sap.ui.model.FilterOperator.GE,
            startDateFormatted
          ),
          new sap.ui.model.Filter(
            "CreatedAt",
            sap.ui.model.FilterOperator.LE,
            endDateFormatted
          )
        ];

        return aFilters;
      },
      _getStartOfWeek: function(date) {
        var day = date.getDay();
        var diff = date.getDate() - day;
        return new Date(date.setDate(diff));
      },

      _getEndOfWeek: function(startDate) {
        var endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return endDate;
      }
    });
  }
);
