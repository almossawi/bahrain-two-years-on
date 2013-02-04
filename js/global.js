"use strict";

var LANG;

$(document).ready(function () {	
	//provide lang literals globally
	d3.json("lang/en_US.json", function(data) {
		LANG = data;
		
		//other initializations
		$("input, textarea, select").uniform();
		
		assignEventListeners();
		//drawCharts("ff_dnt_perc_weekly.json");
		drawMainVisual("#trend");
	});
});

function assignEventListeners() {	
}

//draw the arcs
function drawMainVisual(container) {
  d3.json("data/feb2011.json", function(data) {
	var w = 900,
		h = 500,
		xPadding = 0,
		yPadding = 10,
		x_axis_format = "%b %e",
		yMax = d3.max(data.deaths, function(d) { return d.age; });

	var p1 = 450, //start x
		p2 = 480, //start y
		p3 = -150, //end x
		p4 = -425, //end y
		horizontal_skew = 3;
		
	var yScale = d3.scale.linear()
        .domain([0, yMax])
        .range([0, -450]);
		
	
    //draw svg
	var svg = d3.select(container)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

		

	svg.selectAll("path")
		.data(data.deaths)
		.enter().append("svg:path")
			.attr("opacity", 0.5)
			.attr("stroke", function(d) {
				if(d.age <= 12) return "#8c6d31";
				else if(d.age <= 19) return "#bd9e39";
				else if(d.age <= 60) return "#e7ba52";
				else if(d.age > 60) return "#e7cb94";
			})
			.attr("d", function(d) {
				console.log(d.age, yScale(d.age));
				
				p3 = (d.id % 2 == 0) ? p3 : p3 * -1; //once go left and once go right
				p3 += Math.floor((Math.random()*30)+1) //add a random amount to each
				p1 += Math.floor((Math.random()*1)+1) //add a random amount to each
				
				return "m " + p1 + "," + p2 + " c " + horizontal_skew + "," + yScale(d.age) + " " + p3 + "," + yScale(d.age) + " " + p3 + "," + yScale(d.age); 
			});
			


	/*svg.append("path")
		.attr("d", "m " + p1 + "," + p2 + " c 0,0 0,0 0,0")
		.transition()
			.duration(2000)
			.delay(1000)
			.attr("d", "m " + p1 + "," + p2 + " c " + horizontal_skew + "," + p4 + " " + p3 + "," + p4 + " " + p3 + "," + p4);
	*/

	/*svg.append("path")
		.attr("d", "m " + p1 + "," + p2 + " c 0,0 0,0 0,0")
		.transition()
			.duration(2200)
			.delay(1300)
			.attr("d", "m " + p1 + "," + p2 + " c " + horizontal_skew + "," + (p4+200) + " " + (p3+20) + "," + (p4+200) + " " + (p3+20) + "," + (p4+200));
	*/
  
  });
}

function drawCharts(json) {console.log(json);
	d3.json("data/annotations.json", function(annotations) {
	d3.json("data/" + json, function(data) {
		var format = "%",
			humanify_numbers = false,
			custom_units = "",
			splice_from = 0,
			show_confidence = false;
				
			draw(data, "#trend", format, humanify_numbers, custom_units, splice_from, annotations, show_confidence);
	});
	});
}

function addCommas(nStr) {
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function getHumanSize(size) {
	var sizePrefixes = ' kmbtpezyxwvu';
	if(size <= 0) return '0';
	var t2 = Math.min(Math.floor(Math.log(size)/Math.log(1000)), 12);
	return (Math.round(size * 100 / Math.pow(1000, t2)) / 100) +
	//return (Math.round(size * 10 / Math.pow(1000, t2)) / 10) +
		sizePrefixes.charAt(t2).replace(' ', '');
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}