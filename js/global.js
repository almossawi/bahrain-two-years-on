"use strict";

var LANG,
	default_opacity = 0.6,
	fixed_card = true,
	default_stroke_width = 1,
	trans_stroke_width = 10,
	highlighted_stroke_width = 4,
	death_count = 0;

$(document).ready(function () {	
	//provide lang literals globally
	d3.json("lang/en_US.json", function(data) {
		LANG = data;
		
		//other initializations
		$("input, textarea, select").uniform();
		
		assignEventListeners();
		drawMainVisual("#tree");
		
		//In Firefox, reset dropdowns
		$("#age").val($("#age option:first").val())
		$("#death_code").val($("#death_code option:first").val())
		$("#from").val($("#from option:first").val())
		$.uniform.update();
	});
});

function resetAllStrokes() {
	//reset all strokes
	$("path.treebranch")
		.attr("stroke-width", default_stroke_width)
		.attr("opacity", default_opacity);
}

function assignMainVisualListeners() {
	$("#show_band_45yrs").toggle(function() {console.log("on");
		$("#band_45yrs").show();
	},
	function() {console.log("two");
		$("#band_45yrs").hide();
	});
	
	$("#show_band_90yrs").toggle(function() {console.log("on");
		$("#band_90yrs").show();
	},
	function() {console.log("two");
		$("#band_90yrs").hide();
	});
}

function assignEventListeners() {
	$("body").on("click", function() {
		$("#details").fadeOut();
		resetAllStrokes();
	});
	
	$("#controls_cover").on("mouseenter", function() {
		$("#controls_cover").fadeOut();
		$("#controls")
			.delay(500)
			.animate({ opacity: 1}, 1000);
	});
	
	/*$("#color_using").on("change", function(d_event) {
		if(d_event.target.value == "by_age") {
			$(".treebranch")
				.attr("stroke", function(d) {
					var colorScale = d3.scale.linear().domain([0, yMax]).range(["#e33258", "cyan"]);
					return colorScale(d.death_code);
				});
			return false;
		}
		else if(d_event.target.value == "by_death_code") {
			d3.selectAll(".treebranch")
				.attr("stroke", function(d) {
					var colorScale = d3.scale.ordinal().domain([1,2,3,4,5,6,7]).range(["#e33258", "cyan", "#C7003F", "#FAAB00", "#e33232", "#FCF0D0", "#DAF204"]);
					return colorScale(d.death_code);
				});
				
			return false;
		}
		else if(d_event.target.value == "by_hometown") {
			//TODO
			return false;
		}
	});*/
	
	$("#fix_or_float").on("change", function(d_event) {
		if(d_event.target.value == "fix") {
			fixed_card = true;
		}
		else if(d_event.target.value == "float") {
			fixed_card = false;
		}

		return false;
	});
	
	$("#from").on("change", function(d_event) {
		//reset others
		$("#age").val($("#age option:first").val())
		$("#death_code").val($("#death_code option:first").val())
		$.uniform.update();
		
		//bring back all transparent paths; to make the
		//transparent paths more sensitive, remove the rest
		$(".treebranch_transparent")
			.attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
		
		if(d_event.target.value == "cancel_all") {
			$("#count").html(death_count + " LIVES");
			
			$(".treebranch")
				.attr("class", "treebranch")
				.css("opacity", default_opacity);
			return false;
		}

		var count = 0;
		d3.selectAll(".treebranch")
			.each(function(d, i) {
				if(d.from != $(d_event.target).val()) {
					$("#p"+d.id)
						.attr("class", "treebranch off")
						.css("opacity", 0.1);
						
					//to make the transparent paths more sensitive, remove the rest
					$("#transp"+d.id)
						.attr("visibility", "hidden");
				}
				else {
					$("#p"+d.id)
						.delay(500)
						.attr("class", "treebranch")
						.css("opacity", default_opacity);
						
					count++;
				}
			});
			
		var suffix = (count == 1) ? "LIFE" : "LIVES";
		$("#count").html(count + " " + suffix);
			
		return false;
	});
	
	$("#age").on("change", function(d_event) {
		$("#from").val($("#from option:first").val())
		$("#death_code").val($("#death_code option:first").val())
		$.uniform.update();
		
		//bring back all transparent paths; to make the
		//transparent paths more sensitive, remove the rest
		$(".treebranch_transparent")
			.attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
			
		if(d_event.target.value == "cancel_all") {
			$("#count").html(death_count + " LIVES");
			
			$(".treebranch")
				.attr("class", "treebranch")
				.css("opacity", default_opacity);
			return false;
		}
		
		var count = 0;
		d3.selectAll(".treebranch")
			.each(function(d, i) {
				if(d.age < Number(d_event.target.value) || d.age > (Number(d_event.target.value)+9)) {
					$("#p"+d.id)
						.attr("class", "treebranch off")
						.css("opacity", 0.1);
						
						//to make the transparent paths more sensitive, remove the rest
						$("#transp"+d.id)
							.attr("visibility", "hidden");
				}
				else {
					$("#p"+d.id)
						.delay(500)
						.attr("class", "treebranch")
						.css("opacity", default_opacity);
						
					count++;
				}
			});
			
		var suffix = (count == 1) ? "LIFE" : "LIVES";
		$("#count").html(count + " " + suffix);
		
		return false;
	});
	
	$("#death_code").on("change", function(d_event) {
		$("#age").val($("#age option:first").val())
		$("#from").val($("#from option:first").val())
		$.uniform.update();
		
		//bring back all transparent paths; to make the
		//transparent paths more sensitive, remove the rest
		$(".treebranch_transparent")
			.attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
			
		if(d_event.target.value == "cancel_all") {
			$("#count").html(death_count + " LIVES");
			
			$(".treebranch")
				.attr("class", "treebranch")
				.css("opacity", default_opacity);
			return false;
		}
		
		var count = 0;
		d3.selectAll(".treebranch")
			.each(function(d, i) {
				if(d.death_code != Number(d_event.target.value)) {
					$("#p"+d.id)
						.attr("class", "treebranch off")
						.css("opacity", 0.1);
						
						//to make the transparent paths more sensitive, remove the rest
						$("#transp"+d.id)
							.attr("visibility", "hidden");
				}
				else {
					$("#p"+d.id)
						.delay(500)
						.attr("class", "treebranch")
						.css("opacity", default_opacity);	

					count++;
				}
			});
			
		var suffix = (count == 1) ? "LIFE" : "LIVES";
		$("#count").html(count + " " + suffix);
		
		return false;
	});
}

function drawTimeSeries(data, container, format, humanify_numbers, custom_units, annotations) {
	var histogram = new Object();
	
	//first, go through all elements and create a histogram
	$.each(data.deaths, function(i, d) {

		if(histogram[d.date_of_death] == undefined) {
			histogram[d.date_of_death] = {"date": 0, "count": 0};
							
			histogram[d.date_of_death].date = +new Date(d.date_of_death);
			histogram[d.date_of_death].count = 1;
		}
		else {
			histogram[d.date_of_death].count = histogram[d.date_of_death].count+1;
		}
	});
	
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
	//console.log(data);
	
    //prepare our scales and axes
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
      			return "translate(0, " + (yScale(d)+1) + ")";
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
	    .attr("transform", "translate(2," + (h-xPadding-6) + ")")
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
   			.each(function(d, i) {
   				var ze_date = Date.parse(d.key).toString('yyyy')
						+ "-" + Date.parse(d.key).toString('MM')
						+ "-" + Date.parse(d.key).toString('dd');

   				if("undefined" != typeof annotations[ze_date]) {
					//add a vertical line at that point
					d3.select(which_metric + " svg")
						.append('svg:line')
							.attr("class", "annotation_line")
					    	.attr("stroke-dasharray","1,3")
    						.attr('y1', 7)
						    .attr('y2', 36)
						    .attr('x1', xScale(d.value.date)-1)
						    .attr('x2', xScale(d.value.date)-1);
							    
					d3.select(which_metric + " svg")
						.append('svg:text')
							.attr("class", "annotation_text")
							.text(annotations[ze_date].annotation)
    						.attr('y', 17)
						    .attr('x', xScale(d.value.date)+4);
							    
					d3.select(which_metric + " svg")
						.append('svg:text')
							.attr("class", "annotation_text")
							.text(annotations[ze_date].annotation_line2)
    						.attr('y', 31)
						    .attr('x', xScale(d.value.date)+4);
				}
   			})
   			.on('mouseover.tooltip', function(d) {
   				var d_orig = d;
   				d=d.value;
   				
	    		d3.select(".tooltip_box").remove();
		  		d3.selectAll(".tooltip").remove(); //timestamp is used as id
				d3.select(which_metric + " svg")
					.append("svg:rect")
						.attr("width", 15)
						.attr("height", 16)
						.attr("x", xScale(d.date)-10)
						.attr("y", function() {
							return yScale(d.count)-24;
						})
						.attr("class", "tooltip_box");
						
						d3.select(which_metric + " svg")
							.append("text")
								.text(function() {
									var ze_date = Date.parse(d_orig.key).toString('MMMM dd, yyyy');
									$("#full_date").html(ze_date).fadeIn();
									return d.count;
								})					
								.attr("x", function() { return xScale(d.date)-2; })
								.attr("y", function() {
									return yScale(d.count)-11;
								})
								.style("cursor", "default")
								.attr("dy", "0.35m")
								.attr("text-anchor", "middle")
								.attr("class", "tooltip");
			})
   			.transition()
   			.duration(1000)
   				.attr("y", function(d) { return yScale(d.value.count)-1; })
   				.attr("height", function(d) {
    	    		return (h-yPadding) - yScale(d.value.count);
	   			});
}

//draw the arcs
function drawMainVisual(container) {
 	d3.json("data/feb2011.json", function(data) {
 	d3.json("data/annotations.json", function(annotations) {
		//data.deaths = data.deaths.shuffle();
		
		death_count = data.deaths.length;
		
		var format = "s",
			humanify_numbers = false,
			custom_units = "";
			
  		drawTimeSeries(data, "#time_series", format, humanify_numbers, custom_units, annotations);
  	
		var w = 1100,
			h = 600,
			xPadding = 0,
			yPadding = 10,
			x_axis_format = "%b %e",
			yMax = d3.max(data.deaths, function(d) { return d.age; });

		var p1 = 450, //start x
			p2 = 480, //start y
			p3 = -400, //end x
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
    		.attr('y1', 10)
	    	.attr('y2', 460)
    		.attr('x2', 20);
    	
	    svg.append("svg:text")
    		.attr("id", "ali")
			.style("fill", "#cccccc")
    		.attr('x', 13)
	    	.attr('y', 20)
    		.style("font-size", "10px")
	    	.attr("transform", "rotate(-90, 10 , 20) translate(-240, 0)")
    		.text("Victim's age");
	    	
    	svg.append("svg:text")
			.style("fill", "#cccccc")
    		.attr('x', 26)
	    	.attr('y', 20)
    		.style("font-size", "10px")
	    	.attr("id", "show_band_90yrs")
	    	.text("90 years");
	    	
	    svg.append('svg:rect')
	    	.attr("fill", "#7b7b7b")
	    	.attr("opacity", "0.1")
	    	.attr("id", "band_90yrs")
	    	.style("display", "none")
    		.attr('x', 18)
    		.attr('y', 20)
    		.attr('height',215)
    		.attr('width', 1150);
	    	
	    svg.append("svg:text")
			.style("fill", "#cccccc")
    		.attr('x', 26)
	    	.attr('y', 235)
	    	.attr("id", "show_band_45yrs")
    		.style("font-size", "10px")
	    	.text("45 years");
	    	
	    svg.append('svg:rect')
	    	.attr("fill", "#7b7b7b")
	    	.attr("opacity", "0.1")
	    	.attr("id", "band_45yrs")
	    	.style("display", "none")
    		.attr('x', 18)
    		.attr('y', 235)
    		.attr('height',215)
    		.attr('width', 1150);
    	
	    svg.append("svg:text")
			.style("fill", "#cccccc")
	    	.attr('x', 26)
    		.attr('y', 458)
	    	.style("font-size", "10px")
    		.text("Newborn");

		svg.selectAll("path")
			.data(data.deaths)
			.enter().append("svg:path")
				.attr("opacity", function() {
					return default_opacity;
					//return Math.floor((Math.random()*1)+0.5)
				})
				.attr("id", function(d) { return "p" + d.id; })
				.attr("stroke-width", default_stroke_width)
				.attr("stroke", "cyan")
				.attr("class", "treebranch")
				.attr("d", function(d) {
					//once go left and once go right
					//p3 = (d.id % 2 == 0) ? p3 : p3 * -1;
				
					//add a random amount to each
					//p1 += Math.floor((Math.random()*1)+1);
				
					return "m " + p1 + "," + (p2+200) + " L " + p1 + "," + p2 + " c 0,0 0,0 0,0"; 
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
				})
				.each(function(d, i) {
					//a transparent copy of each path to make it easier to hover over them
					svg.append('svg:path')
		    			.attr('shape-rendering', 'crispEdges')
		    			.style('opacity', '0')
				.attr("id", function() { return "transp" + d.id; })
				.attr("stroke-width", trans_stroke_width)
				.attr("stroke", "white")
				.attr("class", "treebranch_transparent")
				.attr("d", function() {
					//console.log($("#p"+d.id).attr("d"));
					
					return $("#p"+d.id).attr("d");
					//once go left and once go right
					//p3 = (d.id % 2 == 0) ? p3 : p3 * -1;
				
					//add a random amount to each
					//p1 += Math.floor((Math.random()*1)+1);
				
					return "m " + p1 + "," + (p2+200) + " L " + p1 + "," + p2 + " c 0,0 0,0 0,0"; 
				})
				.on('mouseover', function() {									
					if($("#p"+d.id).attr("class") == "treebranch off") {
						return false;
					}
					
					resetAllStrokes();
				
					$("#p" + d.id)
						.attr("stroke-width", highlighted_stroke_width)
						.attr("opacity", 1);
	
					var age = (d.age < 1) ? d.actual_age : d.age + " years";
					var html = "<span style='font-weight:bold;font-size:15px'>" + d.name + "</span><br />"
						+ age + ", from " + d.from + "<br />"
						+ "Killed " + Date.parse(d.date_of_death).toString('dddd, MMM d, yyyy') + "<br />"
						+ "<p>&ldquo;" + d.type_of_death_full + "&rdquo;</p>";

					//are we floating the pane or showing it at its fixed location?
					if(fixed_card) {
						//position the details block at fixed coords
						$("#details")
							.css("top", function() {
								return "100px";
							})
							.css("margin-left", function() {
								return "990px";
							})
					}
					else {	
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
					}
					
					$("#details").fadeIn().html(html);
				})
				});
				
		$("#count").html(data.deaths.length + " LIVES");
		
		assignMainVisualListeners();
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