function ComputeData(){
	// Get the country
	var e = document.getElementById("country");
	var CountryCode = e.options[e.selectedIndex].value;

	// Get the country
	var h = document.getElementById("edit-indicators");
	var SelectedOpt = h.options[h.selectedIndex].value;

	
	var xmlhttp = new XMLHttpRequest();
	var url = "http://api.worldbank.org/countries/" + CountryCode +"/indicators/" + SelectedOpt + "?per_page=100&date=1960:2016&format=json";

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			GetData(myArr, CountryCode);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function GetData(data, CountryCode) {
	// Array to keep track of all data (x-axis)
	var xData = new Array();
	
	var yData = new Array();
	
	// Set the title of the graph.
	var title = data[1][0]["indicator"]["value"];
    // loop all the data and plot the valid graphs.
    Object.keys(data[1]).forEach(function(key) {
		// Check if there exist NO null data.
		if (data[1][key]["value"] == null){
			void(0);
		}
		else{
			// Push x-data
			xData.push(data[1][key]["date"]);
			
			// Push y-data
			yData.push(data[1][key]["value"]);
		}
    });	
	GraphData(xData, yData, title, CountryCode);

}

// Function to graph data onto graph.
function GraphData(xData, yData, title, CountryCode){
	
	// Create the left sidebar!
	
	SideBarCompute(CountryCode);
	//reset homepage
	document.getElementById("main_first").style.display="none";
	document.getElementById("main_graph").style.display="block";

	
	var dps = new Array();
	var size = 0;
	while (size < xData.length){
		dps.push({x: new Date(xData[size], 0), y:yData[size]/100});
		size = size + 1;
	}
	
	
	
	var chart = new CanvasJS.Chart("chartContainer",
		{
			zoomEnabled: false,
                        animationEnabled: true,
			title:{
				text: title
			},
			axisY2:{
				valueFormatString:"0%",
				
				maximum: 1.0,
				interval: 0.1,
				interlacedColor: "#F5F5F5",
				gridColor: "#D7D7D7",      
	 			tickColor: "#D7D7D7"								
			},
                        theme: "theme2",
                        toolTip:{
                                shared: true
                        },
			legend:{
				verticalAlign: "bottom",
				horizontalAlign: "center",
				fontSize: 15,
				fontFamily: "Lucida Sans Unicode"

			},
			data: [
			{        
				type: "line",
				lineThickness:3,
				axisYType:"secondary",
				showInLegend: true,           
				name: "Recorded Data", 
				dataPoints: dps}
			],
          legend: {
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
              e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chart.render();
            }
          }
        });

chart.render();

// Start of Country rendering information box on left.

var img = new Image();
var div = document.getElementById('left_content');

img.onload = function() {
  div.appendChild(img);
};
var e = document.getElementById("country");

img_name = e.options[e.selectedIndex].innerHTML;
img.src = 'flag/' + img_name + '.png';
img.id = "flaging";
}
function GoBack(){
	//reset homepage
	document.getElementById("main_first").style.display="block";
	document.getElementById("main_graph").style.display="none";
	$('#left_content').empty(); // Removes everything that was previously create.
}

function SideBarCompute(CountryCode){
	
	var xmlhttp = new XMLHttpRequest();
	var url = "https://restcountries.eu/rest/v1/alpha?codes=co;" + CountryCode + ";no"
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			// START OF LEFT SIDE BAR COMPUTATION!
			// Insert Country Name
			var div = document.getElementById("title_ltf")
			var h = document.createElement("h1")                // Create a <h1> element
			var t = document.createTextNode(myArr[1]["name"]);     // Create a text node
			div.appendChild(h.appendChild(t));

			// Insert population graph.
			var dps = []; // dataPoints

		var chart = new CanvasJS.Chart("update_chart",{
			title :{
				text: "Live Population of " + myArr[1]["name"]
			},			
			data: [{
				type: "line",
				dataPoints: dps 
			}]
		});
		// Live estimate, warning this is psedo estimate. Just for testing.
		var xVal = parseInt(myArr[1]["population"]);
		var yVal = 0;	
		var updateInterval = 1;
		var dataLength = 500; // number of dataPoints visible at any point

		var updateChart = function (count) {
			count = count || 1;
			// count is number of times loop runs to generate random dataPoints.
			
			for (var j = 0; j < count; j++) {	
				yVal = yVal +  0.002;
				dps.push({
					x: xVal,
					y: yVal
				});
				xVal = xVal + 0.0002;
			};
			if (dps.length > dataLength)
			{
				dps.shift();				
			}
			
			chart.render();		

		};

		// generates first set of dataPoints
		updateChart(dataLength); 

		// update chart after specified time. 
		setInterval(function(){updateChart()}, updateInterval); 

	}
		}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}
