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
		h = 600,
		xPadding = 0,
		yPadding = 10,
		x_axis_format = "%b %e",
		yMax = d3.max(data.deaths, function(d) { return d.age; });

	var p1 = 450, //start x
		p2 = 480, //start y
		p3 = -300, //end x
		p4 = -425, //end y
		horizontal_skew = 3;
		
	var yScale = d3.scale.linear()
        .domain([0, yMax])
        .range([-30, -450]);
		
	
    //draw svg
	var svg = d3.select(container)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

		

	svg.selectAll("path")
		.data(data.deaths)
		.enter().append("svg:path")
			.attr("opacity", 0.9)
			.attr("id", function(d) { return "p" + d.id; })
			.attr("stroke-width", 1)
			.attr("stroke", "cyan")
			.attr("d", function(d) {
				//once go left and once go right
				//p3 = (d.id % 2 == 0) ? p3 : p3 * -1;
				
				//add a random amount to each
				//p1 += Math.floor((Math.random()*1)+1);
				
				return "m " + p1 + "," + (p2+200) + " L " + p1 + "," + p2 + " c 0,0 0,0 0,0"; 
			})
			.on('mouseover', function(d) {
				console.log(d);
				$("path").attr("stroke-width", 1); //reset all strokes
				$("#p" + d.id).attr("stroke-width", 5);

				var age = (d.age == 0) ? d.actual_age : d.age + " years";
				var html = d.name + "<br />" 
					+ age + "<br />"
					+ d.date_of_death + "<br />"
					+ d.type_of_death;

				$("#details").html(html);
			})
			/*.on('mouseout', function(d) {
				$("#p" + d.id)
					.attr("stroke-width", 1);
			})*/
			.transition()
				.duration(2500)
				.delay(function(d, i){ console.log(d); return 10*(i*3); })
				.attr("d", function(d) {
					//once go left and once go right
					p3 = (d.id % 2 == 0) ? p3 : p3 * -1;
				
					//add a random amount to each
					p1 += Math.floor((Math.random()*1)+1);
				
					return "m " + p1 + "," + (p2+200) + " L " + p1 + "," + p2 + " c " + horizontal_skew + "," + yScale(d.age) + " " + p3 + "," + yScale(d.age) + " " + p3 + "," + yScale(d.age);
				})
			.attr("stroke", function(d) {
				var colorScale = d3.scale.linear().domain([0,yMax]).range(["red", "cyan"]);
				return colorScale(d.age);
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

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}