sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/viz/ui5/format/ChartFormatter',
	'sap/viz/ui5/api/env/Format',
	'sap/ui/model/json/JSONModel'
], function (Controller, ChartFormatter, Format, JSONModel) {
	"use strict";
	/*eslint no-console: ["error", { allow: ["warn", "error"] }] */

	return Controller.extend("chart.chart.controller.View1", {
		onInit: function () {
			var sUrl = "/iot/iot/device.xsodata/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, {
				useBatch: false
			});
			this.getView().setModel(oModel);
			var aFilters1 = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ID_VSP", sap.ui.model.FilterOperator.EQ, "1"),
				new sap.ui.model.Filter("QSUM", sap.ui.model.FilterOperator.GT, 0),
			], true);

			var oVizFrame = this.getView().byId("idStackedChart");
			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					dataLabel: {
						showTotal: false
					},
					window: {
						start: 'firstDataPoint',
						end: 'lastDataPoint'
					},
					timeAxis: {
						interval: {
							unit: "auto"
						}
					},
					dataPointStyle: {
						rules: [{

						}],
						others: {
							properties: {
								lineColor: "000000",
								lineType: "solid"
							},
							displayName: "Water"
						}
					},
					marker: {
						visible: false
					}
				},
				tooltip: {
					visible: true
				},
				title: {
					text: "Stacked Bar Chart"
				}
			});
			Format.numericFormatter(ChartFormatter.getInstance());
			var formatPattern = ChartFormatter.DefaultPattern;
			var oPopOver = this.getView().byId("idPopOver");
			oPopOver.connect(oVizFrame.getVizUid());
			oPopOver.setFormatString({
				"Date": "YearMonthDay",
				"Water": formatPattern.STANDARDFLOAT
			});
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Date',
					value: {
						path: 'DATE',
						formatter: function (timestamp) {
							return new Date(timestamp);
						}
					},
					dataType: "date"
				}],

				measures: [{
					name: "Water",
					value: "{QSUM}"
				}],

				data: {
					path: "/IOT_ITEM",
					filters: aFilters1
				}

			});
			oVizFrame.setDataset(oDataset);

			oVizFrame.setModel(oModel);

			var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Water"]
				}),

				oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "timeAxis",
					"type": "Dimension",
					"values": ["Date"]
				});

			oVizFrame.addFeed(oFeedValueAxis);
			oVizFrame.addFeed(oFeedCategoryAxis);

		},
		fnSelectChange: function () {
			var dateRange = this.getView().byId("DRS2");
			var fromDate = dateRange.getDateValue(); //javascipt Date
			var toDate = dateRange.getSecondDateValue(); //javascipt Date
			var ID = this.getView().byId('id_Select').getSelectedKey();
			var aFilters1 = new sap.ui.model.Filter([
				new sap.ui.model.Filter("ID_VSP", sap.ui.model.FilterOperator.EQ, ID),
				new sap.ui.model.Filter("QSUM", sap.ui.model.FilterOperator.GT, 0),
				new sap.ui.model.Filter({
					path: "DATE",
					operator: sap.ui.model.FilterOperator.BT,
					value1: fromDate,
					value2: toDate
				})
			], true);
			var oVizFrame = this.getView().byId("idStackedChart");
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Date',
					value: {
						path: 'DATE',
						formatter: function (timestamp) {
							return new Date(timestamp);
						}
					},
					dataType: "date"
				}],

				measures: [{
					name: "Water",
					value: "{QSUM}"
				}],

				data: {
					path: "/IOT_ITEM",
					filters: aFilters1
				}

			});
			oVizFrame.setDataset(oDataset);
		},
		ZoomIn: function (oView) {
			// Hide Settings Panel for phone
			var oVizFrame = this.getView().byId("idStackedChart");
			oVizFrame.zoom({
				direction: "in"
			});
		},
		ZoomOut: function (oView) {
			// Hide Settings Panel for phone
			var oVizFrame = this.getView().byId("idStackedChart");
			oVizFrame.zoom({
				direction: "out"
			});
		},
		handleChange: function () {
			var ID = this.getView().byId('id_Select').getSelectedKey();
			var dateRange = this.getView().byId('DRS2');
			var fromDate = dateRange.getDateValue();
			var toDate = dateRange.getSecondDateValue();
			var aFilters1 = new sap.ui.model.Filter([
					new sap.ui.model.Filter("ID_VSP", sap.ui.model.FilterOperator.EQ, ID),
					new sap.ui.model.Filter("QSUM", sap.ui.model.FilterOperator.GT, 0),
					new sap.ui.model.Filter({
						path: "DATE",
						operator: sap.ui.model.FilterOperator.BT,
						value1: fromDate,
						value2: toDate
					})
				],
				true);
			var oVizFrame = this.getView().byId("idStackedChart");
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Date',
					value: {
						path: 'DATE',
						formatter: function (timestamp) {
							return new Date(timestamp);
						}
					},
					dataType: "date"
				}],

				measures: [{
					name: "Water",
					value: "{QSUM}"
				}],

				data: {
					path: "/IOT_ITEM",
					filters: aFilters1
				}

			});
			oVizFrame.setDataset(oDataset);

		},
		Day: function () {
			var ID = this.getView().byId('id_Select').getSelectedKey();
			var dateRange = this.getView().byId('DRS2');
			var fromDate = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
			var toDate = new Date();
			dateRange.setDateValue(fromDate);
			dateRange.setSecondDateValue(toDate);
			var aFilters1 = new sap.ui.model.Filter([
					new sap.ui.model.Filter("ID_VSP", sap.ui.model.FilterOperator.EQ, ID),
					new sap.ui.model.Filter("QSUM", sap.ui.model.FilterOperator.GT, 0),
					new sap.ui.model.Filter({
						path: "DATE",
						operator: sap.ui.model.FilterOperator.BT,
						value1: fromDate,
						value2: toDate
					})
				],
				true);
			var oVizFrame = this.getView().byId("idStackedChart");
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Date',
					value: {
						path: 'DATE',
						formatter: function (timestamp) {
							return new Date(timestamp);
						}
					},
					dataType: "date"
				}],

				measures: [{
					name: "Water",
					value: "{QSUM}"
				}],

				data: {
					path: "/IOT_ITEM",
					filters: aFilters1
				}

			});
			oVizFrame.setDataset(oDataset);
		},
		Week: function () {
			var ID = this.getView().byId('id_Select').getSelectedKey();
			var dateRange = this.getView().byId('DRS2');
			var fromDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
			var toDate = new Date();
			dateRange.setDateValue(fromDate);
			dateRange.setSecondDateValue(toDate);
			var aFilters1 = new sap.ui.model.Filter([
					new sap.ui.model.Filter("ID_VSP", sap.ui.model.FilterOperator.EQ, ID),
					new sap.ui.model.Filter("QSUM", sap.ui.model.FilterOperator.GT, 0),
					new sap.ui.model.Filter({
						path: "DATE",
						operator: sap.ui.model.FilterOperator.BT,
						value1: fromDate,
						value2: toDate
					})
				],
				true);
			var oVizFrame = this.getView().byId("idStackedChart");
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Date',
					value: {
						path: 'DATE',
						formatter: function (timestamp) {
							return new Date(timestamp);
						}
					},
					dataType: "date"
				}],

				measures: [{
					name: "Water",
					value: "{QSUM}"
				}],

				data: {
					path: "/IOT_ITEM",
					filters: aFilters1
				}

			});
			oVizFrame.setDataset(oDataset);
		},
		Month: function () {
			var ID = this.getView().byId('id_Select').getSelectedKey();
			var dateRange = this.getView().byId('DRS2');
			var fromDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
			var toDate = new Date();
			dateRange.setDateValue(fromDate);
			dateRange.setSecondDateValue(toDate);
			var aFilters1 = new sap.ui.model.Filter([
					new sap.ui.model.Filter("ID_VSP", sap.ui.model.FilterOperator.EQ, ID),
					new sap.ui.model.Filter("QSUM", sap.ui.model.FilterOperator.GT, 0),
					new sap.ui.model.Filter({
						path: "DATE",
						operator: sap.ui.model.FilterOperator.BT,
						value1: fromDate,
						value2: toDate
					})
				],
				true);
			var oVizFrame = this.getView().byId("idStackedChart");
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Date',
					value: {
						path: 'DATE',
						formatter: function (timestamp) {
							return new Date(timestamp);
						}
					},
					dataType: "date"
				}],

				measures: [{
					name: "Water",
					value: "{QSUM}"
				}],

				data: {
					path: "/IOT_ITEM",
					filters: aFilters1
				}

			});
			oVizFrame.setDataset(oDataset);
		}
	});
});