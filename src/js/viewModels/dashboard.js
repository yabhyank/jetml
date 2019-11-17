/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['knockout', 'axios', 'ojs/ojbootstrap', 'text!../testdata.csv',
            'ojs/ojarraydataprovider', 'ojs/ojknockout', 'ojs/ojchart', 'ojs/ojmodel', 'ojs/ojtable', 'ojs/ojcollectiontabledatasource', 'ojs/ojinputnumber', 'ojs/ojbutton'],
 function(ko, axios, Bootstrap, csv, ArrayDataProvider) {

    function DashboardViewModel() {
      var self = this;
      
	  self.currentValue = ko.observable(0);
      self.max = ko.observable(50);
      self.min = ko.observable(0);
      self.step = ko.observable(1);
 
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.
	  
    self.activityDataProvider = ko.observable();
	var csvData = csvJSON(csv);
	var r1 = [];
	var newobj = {};
		
	function c2() {
		return new Promise((resolve, reject) => {
			return axios.get(`http://localhost:5000/${self.currentValue()}`, {    
			}).then(results => {
				var i = self.deptObservableArray().length;
	  	        i++;
				newobj["id"] = i.toString();
				newobj["x"] = self.currentValue();
				newobj["y"] = results.data.y;
				newobj["series"] = "Prediction";
				newobj["group"] = "";

				resolve(newobj);
			});
		});
	}
		
	function csvJSON(csv){

		var lines=csv.split("\n");
		var result = [];
		
		var headers=lines[0].split(",");
		for(var i=1;i<lines.length;i++){
			var obj = {};
			var currentline=lines[i].split(",");
			for(var j=0;j<headers.length;j++){
				if (j==1 || j==2) {
				obj[headers[j]] = Number(currentline[j]);
				} else {
					obj[headers[j]] = currentline[j];
				}					
			}
			result.push(obj);
		}
		
		return result; 

	}

	  self.deptObservableArray = ko.observableArray(csvData);
	  this.dataProvider = new ArrayDataProvider(self.deptObservableArray, {keyAttributes: 'id'});

	  self.setSeriesValue = function() {

		var response_body
		async function makeSynchronousRequest(request) {
			try {
				response_body = await c2();
			}
			catch(error) {
			// Promise rejected
				console.log(error);
			}
		}
		(async function () {
		// wait to http request to finish
			await makeSynchronousRequest();
	
			self.deptObservableArray.push(JSON.parse(JSON.stringify(response_body)));
			console.log('dep2 '+ JSON.stringify(self.deptObservableArray()));
			this.dataProvider = new ArrayDataProvider(self.deptObservableArray, {keyAttributes: 'id'});
		})();
		};

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.connected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      self.disconnected = function() {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      self.transitionCompleted = function() {
        // Implement if needed
      };
    }

    /*
     * Returns a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.  Return an instance of the ViewModel if
     * only one instance of the ViewModel is needed.
     */
    return new DashboardViewModel();
  }
);
