// JQuery Ajax Request
$(document).ready(function(){
    $("#search").click(function(){
        $.ajax({url: "demo_test.txt", success: function(result){
            $("#div1").html(result);
        }});
    });
});

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
			GetData(myArr);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

function GetData(data) {
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
	GraphData(xData, yData, title);

}

// Function to graph data onto graph.
function GraphData(xData, yData, title){
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
alert(img.src);
function GoBack(){
	//reset homepage
	document.getElementById("main_first").style.display="block";
	document.getElementById("main_graph").style.display="none";

}