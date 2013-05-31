"use strict";

//options
var LANG,
	default_opacity = 0.7,
	fixed_card = true,
	default_stroke_width = 1,
	trans_stroke_width = 10,
	highlighted_stroke_width = 4,
	death_count = 0;
	
var from_selected = -1,
	age_selected = -1,
	death_code_selected = -1;

$(document).ready(function () {	
	//provide lang literals globally
	d3.json("lang/en_US.json", function(data) {
		LANG = data;
		
		//other initializations
		$("select, input, a.button, button").uniform();
		
		assignEventListeners();
		drawMainVisual("#tree");
		
		//In Firefox, reset dropdowns
		$("#age").val($("#age option:first").val())
		$("#death_code").val($("#death_code option:first").val())
		$("#from").val($("#from option:first").val())
		$.uniform.update();

		//damn IE
		if(Function('/*@cc_on return document.documentMode===10@*/')()){
		    document.documentElement.className+=' ie10';
		}
	});
});

function resetAllStrokes() {
	//reset all strokes
	$("path.treebranch")
		.attr("stroke-width", default_stroke_width)
		.attr("opacity", default_opacity);
}

function assignMainVisualListeners() {
	$("#show_band_45yrs").toggle(function() {
		$("#band_45yrs").show();
	},
	function() {console.log("two");
		$("#band_45yrs").hide();
	});
	
	$("#show_band_90yrs").toggle(function() {
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
	
	/*$("#controls_cover").on("mouseenter", function() {
		$("#controls_cover").fadeOut();
		$("#controls")
			.delay(500)
			.animate({ opacity: 1}, 1000);
	});*/
	
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
	
	//handle dropdowns
	/*$("#from").on("change", function(d_event) {
		//reset others dropdowns //$("#age").val($("#age option:first").val()); $("#death_code").val($("#death_code option:first").val()); $.uniform.update();
		from_selected = d_event.target.value;

		//bring back all transparent paths; to make the transparent paths more sensitive, remove the rest
		$(".treebranch_transparent").attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
		
		if(d_event.target.value == "-1") { //i.e. show all/cancel filter
			resetDropdownBox(from_selected);
			return false;
		}

		handleDropdownBox(d_event);
	});
	
	$("#age").on("change", function(d_event) {
		//reset other ones dropdowns //$("#from").val($("#from option:first").val()); $("#death_code").val($("#death_code option:first").val()); $.uniform.update();
		age_selected = d_event.target.value;
		
		//bring back all transparent paths; to make the transparent paths more sensitive, remove the rest
		$(".treebranch_transparent").attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
			
		if(d_event.target.value == "-1") { //i.e. show all/cancel filter
			resetDropdownBox(age_selected);
			return false;
		}
		
		handleDropdownBox(d_event);
	});
	
	$("#death_code").on("change", function(d_event) {
		//reset other ones dropdowns //$("#age").val($("#age option:first").val()); $("#from").val($("#from option:first").val()); $.uniform.update();
		death_code_selected = d_event.target.value;
		
		//bring back all transparent paths; to make the transparent paths more sensitive, remove the rest
		$(".treebranch_transparent").attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
			
		if(d_event.target.value == "-1") { //i.e. show all/cancel filter
			resetDropdownBox(death_code_selected);
			return false;
		}
		
		handleDropdownBox(d_event);
	});*/
	
	
	
	
	$("#ages img").mouseenter(function (e) {
		$("#ages_menu").show();
	});
	
	$("#ages img").mouseleave(function (e) {
		$("#ages_menu").hide();
	});
	
	$("#ages_menu").mouseenter(function (e) {
		$("#ages_menu").show();
	});
	
	$("#ages_menu").mouseleave(function (e) {
		$("#ages_menu").hide();
	});
	
	$("#ages_menu ul li a").on("click", function (e) {
		$("#ages_menu ul li a").css("font-weight", "300");
		$(this).css("font-weight", "600");
		$("#ages span").html($(this).html());
		
		//console.log($(this).attr("code"));
		age_selected = $(this).attr("code");
		
		//bring back all transparent paths; to make the transparent paths more sensitive, remove the rest
		$(".treebranch_transparent").attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
			
		if($(this).attr("code") == "-1") { //i.e. show all/cancel filter
			resetDropdownBox(age_selected);
			return false;
		}
		
		handleDropdownBox();
		return false;
	});
	
	$("#death_code img").mouseenter(function (e) {
		$("#death_code_menu").show();
	});
	
	$("#death_code img").mouseleave(function (e) {
		$("#death_code_menu").hide();
	});
	
	$("#death_code_menu").mouseenter(function (e) {
		$("#death_code_menu").show();
	});
	
	$("#death_code_menu").mouseleave(function (e) {
		$("#death_code_menu").hide();
	});
	
	$("#death_code_menu ul li a").on("click", function (e) {
		$("#death_code_menu ul li a").css("font-weight", "300");
		$(this).css("font-weight", "600");
		$("#death_code span").html($(this).html());
		
		//console.log($(this).attr("code"));
		death_code_selected = $(this).attr("code");
		
		//bring back all transparent paths; to make the transparent paths more sensitive, remove the rest
		$(".treebranch_transparent").attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
			
		if($(this).attr("code") == "-1") { //i.e. show all/cancel filter
			resetDropdownBox(death_code_selected);
			return false;
		}
		
		handleDropdownBox();
		return false;
	});
	
	$("#from img").mouseenter(function (e) {
		$("#from_menu").show();
	});
	
	$("#from img").mouseleave(function (e) {
		$("#from_menu").hide();
	});
	
	$("#from_menu").mouseenter(function (e) {
		$("#from_menu").show();
	});
	
	$("#from_menu").mouseleave(function (e) {
		$("#from_menu").hide();
	});
	
	$("#from_menu ul li a").on("click", function (e) {
		$("#from_menu ul li a").css("font-weight", "300");
		$(this).css("font-weight", "600");
		$("#from span").html($(this).html());
		
		//console.log($(this).attr("code"));
		from_selected = ($(this).attr("code") == "-1") ? $(this).attr("code") : $(this).html();
		
		//bring back all transparent paths; to make the transparent paths more sensitive, remove the rest
		$(".treebranch_transparent").attr("visibility", "visible");
			
		resetAllStrokes();
		$("#details").hide(); //remove info box
			
		if($(this).attr("code") == "-1") { //i.e. show all/cancel filter
			resetDropdownBox(from_selected);
			return false;
		}
		
		handleDropdownBox();
		return false;
	});
}

function convertToArabicMonth(month_english) {
	var month_arabic = {
        'Jan': 'يناير',
        'Feb': 'فبراير',
        'Mar': 'مارس',
        'Apr': 'أبريل',
        'May': 'مايو',
        'Jun': 'يونيو',
        'Jul': 'يوليو',
        'Aug': 'أغسطس',
        'Sep': 'سبتمبر',
        'Oct': 'أكتوبر',
        'Nov': 'نوفمبر',
        'Dec': 'ديسمبر'
    }
	
	return month_arabic[month_english];
}

function convertToIndian(number) {
	var rep = {
        '0': '&#1632;',
        '1': '&#1633;',
        '2': '&#1634;',
        '3': '&#1635;',
        '4': '&#1636;',
        '5': '&#1637;',
        '6': '&#1638;',
        '7': '&#1639;',
        '8': '&#1640;',
        '9': '&#1641;'
    }

    var number_converted = "",
    	number_str = number.toString();
    
    for(var i=0;i<number_str.length;i++) {
    	number_converted += rep[number_str[i]];
    }

    return number_converted;
}

function resetDropdownBox(which_one) {
	window.which_one = -1;
	//$("#count").html(death_count + " LIVES");
	
	//show these branches		
	var count = 0;
	d3.selectAll(".treebranch")
		.each(function(d, i) {
			//console.log((age_selected == -1 || (d.age > Number(age_selected) && d.age < (Number(age_selected)+9))), (death_code_selected == -1 || d.death_code == death_code_selected), (from_selected == -1 || d.from == from_selected));
			//console.log(age_selected, death_code_selected, from_selected);

			//show only if the path matches the enabled filters
			//console.log("age check", d, age_selected, Number(age_selected)+9);
			if((age_selected == -1 || ((d.age > 60 && Number(age_selected) == 60) || (d.age >= Number(age_selected) && d.age < (Number(age_selected)+9))))
						&& (death_code_selected == -1 || d.death_code == death_code_selected)
						&& (from_selected == -1 || d.from == from_selected)
					) {
				$(this)
					.attr("class", "treebranch") //remove the off class
					.css("opacity", default_opacity)
						
				count++;
			}
			else {
				//hide its transparent path
				$("#transp" + d.id)
					.attr("visibility", "hidden")
			}
		});

	if(count == 1)
		$("#count").html("روح واحدة");
	else
		$("#count").html(" الأرواح" + " " + convertToIndian(count));
}

function handleDropdownBox() {
	var count = 0;
	d3.selectAll(".treebranch")
			.each(function(d, i) {
				//console.log((age_selected == -1 || (d.age > Number(age_selected) && d.age < (Number(age_selected)+9))), (death_code_selected == -1 || d.death_code == death_code_selected), (from_selected == -1 || d.from == from_selected));
				//console.log(age_selected, death_code_selected, from_selected);
				//console.log("age check", d.age, age_selected, Number(age_selected)+9);
				if((age_selected == -1 || ((d.age > 60 && Number(age_selected) == 60) || (d.age >= Number(age_selected) && d.age < (Number(age_selected)+9))))
						&& (death_code_selected == -1 || d.death_code == death_code_selected)
						&& (from_selected == -1 || d.from == from_selected)
					) {
					$("#p"+d.id)
						.delay(500)
						.attr("class", "treebranch")
						.css("opacity", default_opacity);	

					count++;
				}
				else {
					$("#p"+d.id)
						.attr("class", "treebranch off")
						.css("opacity", 0.1);
						
						//to make the transparent paths more sensitive, remove the rest
						$("#transp"+d.id)
							.attr("visibility", "hidden");
				}
			});
			
	if(count == 1)
		$("#count").html("روح واحدة");
	else
		$("#count").html(" الأرواح" + " " + convertToIndian(count));
		
	return false;
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

	var w = 950,
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
	var xMax = +new Date("2011-01-01"),
	    xMin = +new Date("2013-02-28"),
	    yMin = 0,
	    yMax = d3.max(d3.values(data), function(d) { return d.count; });

	yMax += 1;
		
	var xScale = d3.time.scale()
        .domain([xMin, xMax])
        .range([xPadding+22, w-xPadding-18]);
            
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
        .orient("right")
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
    		.attr('x2', w-yPadding-8);
    		
	//draw x axis
	var xAxis = svg.append("g")
    	.attr("class", "axis x")
	    .attr("transform", "translate(-4," + (h-xPadding-6) + ")")
    	.call(xAxis);
    	    	
	//draw y axis
	svg.append("g")
    	.attr("class", "axis y")
	    .attr("transform", "translate(" + (yPadding+875) + ",0)")
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
   			//.attr("y", function(d) { return h-yPadding-1; })
   			//.attr("height", function(d) { return 0; })
   			.attr('opacity', 0.8)
   			.attr("width", 1)
   			.attr("y", function(d) { return yScale(d.value.count)-1; })
	   		.attr("height", function(d) {
   				console.log((h-yPadding) - yScale(d.value.count));
    		    return (h-yPadding) - yScale(d.value.count);
	   		})
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
						    .attr('x1', xScale(d.value.date)-6)
						    .attr('x2', xScale(d.value.date)-6);
							    
					d3.select(which_metric + " svg")
						.append('svg:text')
							.attr("class", "annotation_text")
							.text(annotations[ze_date].annotation)
							.attr("text-anchor", "end")
    						.attr('y', 20)
						    .attr('x', xScale(d.value.date)-16);
							    
					d3.select(which_metric + " svg")
						.append('svg:text')
							.attr("class", "annotation_text")
							.text(annotations[ze_date].annotation_line2)
							.attr("text-anchor", "end")
    						.attr('y', 39)
						    .attr('x', xScale(d.value.date)-16);
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
			});
   			/*.transition()
   			.duration(1000)
   				.attr("y", function(d) { return yScale(d.value.count)-1; })
   				.attr("height", function(d) {
    	    		return (h-yPadding) - yScale(d.value.count);
	   			});*/
}

//draw the arcs
function drawMainVisual(container) {
 	d3.json("data/feb2013_arabic.json", function(data) {
 	d3.json("data/annotations_arabic.json", function(annotations) {
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

		var p1 = 455, //start x
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
    		.style("font-size", "16px")
	    	.attr("transform", "rotate(-90, 10 , 20) translate(-240, 0)")
    		.text("عمر الضحية");
	    	
    	svg.append("svg:text")
			.style("fill", "#cccccc")
    		.attr('x', 26)
	    	.attr('y', 20)
    		.style("font-size", "14px")
	    	.attr("id", "show_band_90yrs")
	    	.text("٩٠ عاماً");
	    	
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
    		.style("font-size", "14px")
	    	.text("٤٥ عاماً");
	    	
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
	    	.style("font-size", "14px")
    		.text("رضيع");

		var fill_counter = 0;
		svg.selectAll("path")
			.data(data.deaths)
			.enter().append("svg:path")
				.attr("opacity", function() {
					return default_opacity;
					//var r = Math.random();
					//return (r < 0.3) ? 0.3 : r;
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

						var p1_d = p1 + fill_counter;
						fill_counter=fill_counter+2;
				
						return "m " + p1_d + "," + (p2+200) + " L " + p1_d + "," + p2 + " c " + horizontal_skew + "," + yScale(d.age) + " " + p3_d + "," + yScale(d.age) + " " + p3_d + "," + yScale(d.age);
					})
				.attr("stroke", function(d) {
					var colorScale = d3.scale.linear().domain([0,yMax]).range(["#e33258", "cyan"]);
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
	
					var day_indian = convertToIndian(Date.parse(d.date_of_death).toString('d')),
						month_indian = convertToArabicMonth(Date.parse(d.date_of_death).toString('MMM')),
						year_indian = convertToIndian(Date.parse(d.date_of_death).toString('yyyy')),
						date_indian = day_indian + " " + month_indian + " " + year_indian;
						
					var age = (d.age < 1) ? d.actual_age : convertToIndian(d.age) + " عاماً";
					var html = "<span style='font-size:22px'>" + d.name + "</span><br />"
						+ age + " من " + d.from + "<br />"
						+ date_indian + "<br />"
						+ "<p>&rdquo;" + d.type_of_death_full + "&ldquo;</p>";

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
				
		
		if(data.deaths.length == 1)
			$("#count").html("روح واحدة");
		else
			$("#count").html(" الأرواح" + " " + convertToIndian(data.deaths.length));
		
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