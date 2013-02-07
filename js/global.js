"use strict";

var LANG,
	default_opacity = 0.8;

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
	$("body").on("click", function() {
		$("#details").fadeOut();
	});
}

function drawTimeSeries(data, container, format, humanify_numbers, custom_units, splice_from, annotations, show_confidence) {
	var histogram = new Object();
	
	//first, go through all elements and create a histogram
	$.each(data.deaths, function(i, d) {

		if(histogram[d.date_of_death] == undefined) {
			histogram[d.date_of_death] = {"date": 0, "count":0};
			//console.log(d,+new Date(d.date_of_death));
			histogram[d.date_of_death].date = +new Date(d.date_of_death);
			histogram[d.date_of_death].count = 1;
		}
		else {
			histogram[d.date_of_death].count = histogram[d.date_of_death].count+1;
		}
	});
	
	console.log(histogram);
	
	data=histogram;
	

var w = 900,
		h = 200,
		xPadding = 22,
		yPadding = 30,
		x_axis_format = "%b %e, %Y";
	
	//we always use the div within the container for placing the svg
	container += " div";
	
	//for clarity, we reassign
	var which_metric = container;
	
	d3.entries(data).sort(function(a,b) { return a.date-b.date; });
	console.log(data);
	
    //prepare our scales and axes
    //var xMin = 1,
	//    xMax = Object.keys(data).length,
	//var xMin = d3.min(d3.values(data), function(d) { return d.date; }),
	//    xMax = d3.max(d3.values(data), function(d) { return d.date; }),
	var xMin = +new Date("2011-01-01"),
	    xMax = +new Date("2013-02-14"),
	    yMin = 0,
	    yMax = d3.max(d3.values(data), function(d) { return d.count; });

	yMax += 1;
		
	var xScale = d3.time.scale()
        .domain([xMin, xMax])
        .range([xPadding+16, w-xPadding]);
            
    var yScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([h-yPadding+2, yPadding-6]);
            
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickFormat(d3.time.format(x_axis_format))
        .ticks(10);
        
	$(".x g text").attr("text-anchor", "left");
   
            
	var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format(format))
        .ticks(5);
            
    //draw svg
	var svg = d3.select(container)
        .append("svg")
        .attr("width", w)
        .attr("height", h);
	    	    
    //draw extended ticks (horizontal)
    var ticks = svg.selectAll('.ticky')
    	.data(yScale.ticks(5))
    	.enter()
    		.append('svg:g')
    		.attr('transform', function(d) {
      			return "translate(0, " + (yScale(d)) + ")";
    		})
    		.attr('class', 'ticky')
    	.append('svg:line')
    		.attr('y1', -1)
    		.attr('y2', -1)
    		.attr('x1', yPadding+5)
    		.attr('x2', w-yPadding+8);
    		
	//draw x axis
	var xAxis = svg.append("g")
    	.attr("class", "axis x")
	    .attr("transform", "translate(0," + (h-xPadding-3) + ")")
    	.call(xAxis);
    	    	
	//draw y axis
	svg.append("g")
    	.attr("class", "axis y")
	    .attr("transform", "translate(" + (yPadding+10) + ",0)")
    	.call(yAxis);
    
    //draw left y-axis
    /*svg.append('svg:line')
    	.attr('x1', yPadding+6)
    	.attr('x2', yPadding+6)
    	.attr('y1', yPadding-14)
    	.attr('y2', h-xPadding-5);*/
    
    //extended ticks (vertical)
    ticks = svg.selectAll('.tickx')
    	.data(xScale.ticks(9))
    	.enter()
    		.append('svg:g')
    			.attr('transform', function(d, i) {
				    return "translate(" + (xScale(d)-26) + ", 0)";
			    })
			    .attr('class', 'tickx');
	
	//draw y ticks
    ticks.append('svg:line')
    	.attr('y1', h-xPadding)
    	.attr('y2', xPadding)
    	.attr('x1', 0)
    	.attr('x2', 0);
			
	//draw bars
	var bar = svg.selectAll("rect")
   		.data(d3.entries(data))
   		.enter()
   			.append("rect")
   			.attr('class','bar')
   			.attr('opacity', 1)
   			.attr('fill', function(d) {
   					return "#fff";
   			})
   			.attr("x", function(d, i) { return xScale(d.value.date)-3; })
   			.attr("y", function(d) { return h-yPadding-1; })
   			.attr("height", function(d) { return 0; })
   			.attr('opacity', 0.8)
   			.attr("width", 1)
   			.transition()
   			.duration(1000)
   				.attr("y", function(d) { return yScale(d.value.count)-1; })
   				.attr("height", function(d) {
    	    		return (h-yPadding) - yScale(d.value.count);
	   			});

	//draw points
	var circle = svg.selectAll("circle")
   		.data(d3.values(data))
   		.enter()
   			.append("circle")
   			.attr('class', function(d,i) { return "point_" + i + " point"; })
   			.attr('opacity', 1)
   			.attr("cx", function(d) {
        		return xScale(d.date);
   			})
   			.attr("cy", function(d) { 
   				return yScale(d.count);
   			})
   			.attr("r", 2)
   			.each(function(d, i) {
   					var ze_date = new Date(d.date).getFullYear() 
							+ "-" + ('0' + (new Date(d.date).getMonth()+1)).slice(-2)
							+ "-" + ('0' + new Date(d.date).getDate()).slice(-2);

   					if("undefined" != typeof annotations[ze_date]) {
						//add a vertical line at that point
						d3.select(which_metric + " svg")
							.append('svg:line')
								.attr("class", "annotation_line")
						    	.attr("stroke-dasharray","1,3")
    							.attr('y1', 7)
							    .attr('y2', 36)
							    .attr('x1', xScale(d.date)-1)
							    .attr('x2', xScale(d.date)-1);
							    
						d3.select(which_metric + " svg")
							.append('svg:text')
								.attr("class", "annotation_text")
								.text(annotations[ze_date].annotation)
    							.attr('y', 17)
							    .attr('x', xScale(d.date)+2);
					}
					
					//a transparent copy of each rect to make it easier to hover over rects
					svg.append('rect')
		    			.attr('shape-rendering', 'crispEdges')
		    			.style('opacity', 0)
			    		.attr('x', function() {
			    			//TODO
			    			//subtract from width/2 to shift rect to middle of point rather than from left edge of point
			    			return xScale(d.date);
			    		})
    					.attr('y', 0)
	    				.attr("class", function() { return "trans_rect_" + i + " trans_rect"; })
	    				.attr('width', function() {
	    					return 1;
			    		})
				    	.attr('height', h-yPadding+2) //height of transparent bar
				    	.on('mouseover.tooltip', function(d_local) {
				    		d3.select(".tooltip_box").remove();
				    		//$(".trans_rect").css("opacity", 0);
				    		//$(".trans_rect_" + i).css("opacity", 0.2);
				    		//$(".point").hide();
				    		//$(".point_" + i).show();
				    	
							d3.selectAll(".tooltip").remove(); //timestamp is used as id
							d3.select(which_metric + " svg")
								.append("svg:rect")
									.attr("width", 44)
									.attr("height", 16)
									.attr("x", xScale(d.date)-22)
									.attr("y", function() {
										return yScale(d.count)-24;
									})
									.attr("class", "tooltip_box");
						
							d3.select(which_metric + " svg")
								.append("text")
									.text(function() {
										var ze_date = new Date(d.date).getFullYear() 
												+ "-" + ('0' + (new Date(d.date).getMonth()+1)).slice(-2)
												+ "-" + ('0' + new Date(d.date).getDate()).slice(-2);
										
										$("#full_date").html(ze_date);
										return d.count;
									})					
									.attr("x", function() { return xScale(d.date); })
									.attr("y", function() {
										return yScale(d.count)-13;
									})
									.style("cursor", "default")
									.attr("dy", "0.35m")
									.attr("text-anchor", "middle")
									.attr("class", "tooltip");
								})
								/*.on('mouseout.tooltip', function() {
									d3.select(".tooltip_box").remove();
									d3.select(".tooltip")
										.transition()
										.duration(200)
										.style("opacity", 0)
										.attr("transform", "translate(0,-10)")
										.remove();
								});*/
				});

}

//draw the arcs
function drawMainVisual(container) {
  d3.json("data/feb2011.json", function(data) {
  d3.json("data/annotations.json", function(annotations) {
  	//data.deaths = data.deaths.shuffle();
  	//console.log(data.deaths.length);
  	
  	
  	
  	var format = "s",
			humanify_numbers = false,
			custom_units = "",
			splice_from = 0,
			show_confidence = false;
			
			
  	drawTimeSeries(data, "#time_series", format, humanify_numbers, custom_units, splice_from, annotations, show_confidence);
  	
  	
  	
  	
  	
  	
	var w = 1100,
		h = 600,
		xPadding = 0,
		yPadding = 10,
		x_axis_format = "%b %e",
		yMax = d3.max(data.deaths, function(d) { return d.age; });

	var p1 = 427, //start x
		p2 = 480, //start y
		p3 = -390, //end x
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
        
	svg.append("svg:line")
		.attr("id", "yaxis")
		.attr("stroke", "#cccccc")
		.attr("stroke-width", "1")
    	.attr('x1', 20)
    	.attr('y1', 20)
    	.attr('y2', 460)
    	.attr('x2', 20);
    	
    svg.append("svg:text")
    	.attr("id", "ali")
		.style("fill", "#cccccc")
    	.attr('x', 10)
    	.attr('y', 20)
    	.style("font-size", "10px")
    	.attr("transform", "rotate(-90, 10 , 20) translate(-240, 0)")
    	.text("Victim's age");
    	
    svg.append("svg:text")
		.style("fill", "#cccccc")
    	.attr('x', 26)
    	.attr('y', 30)
    	.style("font-size", "10px")
    	.text("90 years");
    	
    svg.append("svg:text")
		.style("fill", "#cccccc")
    	.attr('x', 26)
    	.attr('y', 458)
    	.style("font-size", "10px")
    	.text("Newborn");

		

	svg.selectAll("path")
		.data(data.deaths)
		.enter().append("svg:path")
			.attr("opacity", default_opacity)
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
				
				//reset all strokes
				$("path")
					.attr("stroke-width", 1)
					.attr("opacity", default_opacity);
				
				$("#p" + d.id)
					.attr("stroke-width", 4)
					.attr("opacity", 1);

				var age = (d.age < 1) ? d.actual_age : d.age + " years";
				var html = "<strong>" + d.name + "</strong><br />"
					+ age + ", from " + d.from + "<br />"
					+ "Killed " + Date.parse(d.date_of_death).toString('dddd, MMM d, yyyy') + "<br />"
					+ "<p>&ldquo;" + d.type_of_death_full + "&rdquo;</p>";

				$("#details").fadeIn().html(html);
				
				//reposition the details block
				$("#details")
					.css("top", function() {
						return p2 + yScale(d.age);
					})
					.css("margin-left", function() {
						if(d.id == 1)
							return "990px";
						else if(d.id % 2 == 1)
							return "-160px";
						else
							return "990px";
					})
			})
			/*.on('mouseout', function(d) {
				$("#p" + d.id)
					.attr("stroke-width", 1);
			})*/
			.transition()
				.duration(2500)
				.delay(function(d, i){ 
					//console.log(d);
					return 10*(i*2);
				})
				.attr("d", function(d) {
					//once go left and once go right (first one always right for now (id == 1))
					var p3_d = (d.id % 2 == 1 && d.id != 1) ? p3 : p3 * -1;

					//add a random amount to each
					//we need to make sure that we cover the entire spread from 1 to 30
					//TODO fill empty ones first before randomizing
					//TODO
					p1 += Math.floor((Math.random()*3)+1);
				
					return "m " + p1 + "," + (p2+200) + " L " + p1 + "," + p2 + " c " + horizontal_skew + "," + yScale(d.age) + " " + p3_d + "," + yScale(d.age) + " " + p3_d + "," + yScale(d.age);
				})
			.attr("stroke", function(d) {
				var colorScale = d3.scale.linear().domain([0,yMax]).range(["#e33258", "cyan"]);
				//var colorScale = d3.scale.linear().domain([0,yMax]).range(["red", "cyan"]);
				//var colorScale = d3.scale.linear().domain([0,yMax]).range(["#FAAB00", "#C7003F"]);
				//var colorScale = d3.scale.linear().domain([0,yMax]).range(["#DAF204", "red"]);
				//var colorScale = d3.scale.linear().domain([0,yMax]).range(["#FCF0D0", "#e33232"]);
				//var colorScale = d3.scale.linear().domain([0,yMax]).range(["#30D5C8", "#F8F8FF"]);

				return colorScale(d.age);
			});
			
			//highlight first one
			


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
  });
}

function drawCharts(json) {//console.log(json);
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

Array.prototype.shuffle = function () {
    for (var i = this.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = this[i];
        this[i] = this[j];
        this[j] = tmp;
    }

    return this;
}