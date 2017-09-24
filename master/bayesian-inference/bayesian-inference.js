//Handles functionality of Bayesian Inference

// TO DO:
// - Scaling and animation for posterior
// - SVG => Canvas for prior
// - Update history for prior
// - Clean up code
// - Add resize and reset functions 

// load visualizations
$( window ).load(function() {
  bayes();
  likelihood();
  prior();
});

// window resize
$(window).on("resize", function () {

});


//*******************************************************************************//
// Bayes' Theorem
//*******************************************************************************//

function bayes() {

}

//*******************************************************************************//
//point estimation
//*******************************************************************************//
// // 1: Set up dimensions of SVG
// var margin = {top: 30, right: 30, bottom: 60, left: 70},
//   width = 700 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom;

// // 2: Create SVG
// var svg = d3.select("#svg_pe").append("svg")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
//     .attr("preserveAspectRatio", "xMidYMid meet")
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // 3: Scales
// var x = d3.scale.linear()
//     .range([0, width]);
// var y = d3.scale.linear()
//     .domain([0,0.25])
//     .range([height, 0]);
// var color = d3.scale.category10();

// // 4: Axes
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom")
//     .ticks(3);
// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left")
//     .ticks(2);

// // 5: Graph
// svg.append("g")
//   .attr("class", "x axis")
//   .attr("transform", "translate(0," + height + ")")
//   .call(xAxis);
// svg.append("g")
//   .attr("class", "y axis")
//   .attr("transform", "translate(0,0)")
//   .call(yAxis);

// // 6: Axes Labels
// svg.append("text")
//   .attr("class", "labels")
//   .attr("text-anchor", "middle")
//   .attr("transform", "translate(" + width / 2 + "," + (height + margin.bottom / 2) + ")")
//   .text("p");              
// svg.append("text")
//   .attr("class", "labels")
//   .attr("text-anchor", "middle")
//   .attr("transform", "translate(" + margin.left / -2 + "," + height / 2 + ")rotate(-90)")
//   .text("Mean Square Error");

// // Constants
// var n_pe = 1,
//     p_pe = 0.5,
//     property = "Mean Square Error",
//     time = 300;

// //7: Join, Update, Enter, Exit
// function update() {

//   // 7.2: Update Axes Labels
//   svg.selectAll("text.labels")
//     .data(["p", property])
//     .text(function(d) { return d; });

//   // Define line function
//   var line = d3.svg.line()
//     .x(function(d) { return x(d[0])})
//     .y(function(d) { return y(d[1])})
//     .interpolate("basis");

//   // Get Data
//   var p = d3.range(0, 1.01, 0.01),
//       data = get_data(p, n_pe);

//   // JOIN new data with old elements.
//   var estimator = svg.selectAll("path.estimator")
//     .data(data);

//   // UPDATE old elements present in new data.
//   estimator.transition().duration(time)
//     .attr("d", line);

//   // ENTER new elements present in new data.
//   estimator.enter().append("path")
//     .attr("class", "estimator")
//     .attr("d", line)
//     .attr("fill", "none")
//     .attr("stroke-width", "3px")
//     .style("stroke", function(d, i) { return color(i); });

//   // EXIT old elements not present in new data.
//   estimator.exit()
//     .remove();
// }

// // focus line
// function focus(time) {
//   // Get Data
//   var data = get_data([p_pe], n_pe);

//   // Add verticle line
//   var line = svg.selectAll("line.focus")
//     .data([p_pe]);

//   line.enter().append("line")
//     .attr("class", "focus")
//     .style("stroke", "black")
//     .style("stroke-width", 2)
//     .style("stroke-dasharray", ("2, 2"));

//   line.transition().duration(time)
//     .attr("x1", function (d) { return x(d); })
//     .attr("y1", y.range()[0])
//     .attr("x2", function (d) { return x(d); })
//     .attr("y2", y.range()[1]);

//   // Add circles
//   var circles = svg.selectAll("circle.focus")
//     .data(data);

//   circles.enter().append("circle")
//     .attr("r", 5)
//     .attr("class", "focus")
//     .style("fill", function(d, i) { return color(i); })
//     .style("stroke", "white")
//     .style("stroke-width", 2);

//   circles.transition().duration(time)
//     .attr("cx", function(d) { return x(d[0][0]); })
//     .attr('cy', function(d) { return y(d[0][1]); });
// }

// // Return array of data
// function get_data(p, n) {
//   var prop;
//   if (property == "Mean Square Error") {
//     prop = mean_square_error(p,n);
//   } else if (property == "Variance") {
//     prop = variance(p,n);
//   } else {
//     prop = bias_squared(p,n);
//   }
//   return [d3.zip(p,prop.p1), d3.zip(p,prop.p2), d3.zip(p,prop.p3)];
// }

// // Calculate Variance
// function variance (p, n) {
//   var data = {"p1":[], "p2":[], "p3":[]};
//   data.p1 = new Array(p.length).fill(0);
//   data.p2 = p.slice().map(function(d) { return (d * (1 - d) / n); });
//   data.p3 = p.slice().map(function(d) { return (n * d * (1 - d) / Math.pow(n + 2, 2)); });
//   return data;
// }

// // Calculate Bias Squared
// function bias_squared (p, n) {
//   var data = {"p1":[], "p2":[], "p3":[]};
//   data.p1 = p.slice().map(function(d) { return (Math.pow(d,2) - d + 0.25); });
//   data.p2 = new Array(p.length).fill(0);
//   data.p3 = p.slice().map(function(d) { return Math.pow((1 - 2 * d) / (n + 2), 2); });
//   return data;
// }

// // Calculate MSE
// function mean_square_error (p, n) {
//   var data = {"p1":[], "p2":[], "p3":[]};
//   data.p1 = p.slice().map(function(d) { return (Math.pow(d,2) - d + 0.25); });
//   data.p2 = p.slice().map(function(d) { return (d * (1 - d) / n); });
//   data.p3 = p.slice().map(function(d) { 
//     return (n * d * (1 - d) / Math.pow(n + 2, 2)) + Math.pow((1 - 2 * d) / (n + 2), 2); 
//   });
//   return data;
// }

// ////////////////////////
// // Estimator Bar SVG //
// //////////////////////

// var labels = ['p', 'p\u0302\u2081', 'p\u0302\u2082', 'p\u0302\u2083'];

// // 1: Set up dimensions of SVG
// var margin = {top: 10, right: 10, bottom: 20, left: 10},
//   width = 300 - margin.left - margin.right,
//   height = 200 - margin.top - margin.bottom;

// // 2: Create SVG
// var estimators = d3.select("#svg_p_pe").append("svg")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
//     .attr("preserveAspectRatio", "xMidYMid meet")
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // 3: Scales
// var x_e = d3.scale.ordinal()
// 	.domain([0,1,2,3])
// 	.rangeRoundBands([0, width], .5);
// var y_e = d3.scale.linear()
//     .domain([0,1])
//     .range([height, 0]);

// // 4: Axes
// var xAxis_e = d3.svg.axis()
//     .scale(x_e)
//     .orient("bottom")
//     .tickFormat(function (d) { return labels[d]});

// // 5: Graph
// estimators.append("g")
//   .attr("class", "x axis")
//   .attr("transform", "translate(0," + height + ")")
//   .call(xAxis_e);

// //Drag Function
// var drag = d3.behavior.drag()
// 	.origin(function() { return {x: 0, y:d3.select(this).attr("y")};})
// 	.on('drag', function(d,i) {
// 		p_pe = Math.max(0, Math.min(y_e.invert(d3.event.y),1));
// 		tipCP.show(p_pe, this)
// 		focus(0);
// 		update_estimators([p_pe], 0)
// 		count(0, 0);
// 	})

// //Tool tip for Prob
// var tipCP = d3.tip()
// 	.attr('class', 'd3-tip')
// 	.offset([-10, 0])
// 	.html(function(d,i) { return round(d,2); });


// function update_estimators(data, time) {
// 	// JOIN new data with old elements.
// 	var rects = estimators.selectAll("rect")
// 		.data(data);

// 	// ENTER new elements present in new data.
// 	rects.enter().append("rect")
// 		.attr('x', function(d,i){ return x_e(i); })
// 	    .attr('width', x_e.rangeBand())
// 	    .style("fill", function(d, i) { return (i ? color(i - 1) : "black"); })
// 	    .style("fill-opacity", function(d, i) { return (i ? 0.5 : 1); })
// 	    .style("stroke", function(d, i) { return (i ? color(i - 1) : "black"); })
// 	    .style("stroke-width", 2) 
// 	    .on("mouseover", function(d) { tipCP.show(d, this); })
// 		.on("mouseout", tipCP.hide)
// 		.on('mouseup', tipCP.hide);

// 	// UPDATE old elements present in new data.
// 	rects.transition().duration(time)
// 		.attr('y', function(d,i){ return y_e(d); })
// 		.attr('height', function(d,i){ return y_e(1-d); });

// 	// EXIT old elements not present in new data.
// 	rects.exit()
// 		.remove();

// 	// pull axis to front
// 	estimators.select(".x.axis").moveToFront();
// }

// function count(t, h) {
// 	$("#tail").html(t);
// 	$("#head").html(h);
// }

// function sample() {
// 	var x = new Array(n_pe).fill(0).map(function() { return (Math.random() < p_pe); }),
// 		h = d3.sum(x),
// 		p1 = 0.5,
// 		p2 = d3.mean(x),
// 		p3 = (1 + n_pe * p2) / (n_pe + 2);
// 	update_estimators([p_pe, p1, p2, p3], time);
// 	count(n_pe - h, h);
// }

// // function theoretical() {
// // 	var p1 = 0.5,
// // 		p2 = p_pe,
// // 		p3 = (1 + n_pe * p_pe) / (n_pe + 2);
// // 	update_estimators([p_pe, p1, p2, p3], time);
// // 	var std1 = 0,
// // 		std2 = p_pe * (1 - p_pe) / n_pe,
// // 		std3 = n_pe * p_pe * (1 - p_pe) / Math.pow(n_pe + 2, 2);
// // 	deviation([{"p":p1, "std":std1}, {"p":p2, "std":std2}, {"p":p3, "std":std3}], time); 
// // }

// // function deviation(data, time) {
// // 	// JOIN new data with old elements.
// // 	var lines = estimators.selectAll("line.center")
// // 		.data(data);

// // 	// ENTER new elements present in new data.
// // 	lines.enter().append("line")
// // 	    .attr("class", "center")
// // 	    .style("stroke", "black")
// // 	    .style("stroke-width", 2)
// // 	    .style("stroke-dasharray", ("2, 2"));

// // 	lines.transition().duration(time)
// // 		.attr("x1", function(d,i) { return x_e(i + 1) + x_e.rangeBand() / 2; })
// // 		.attr("y1", function(d) { return y_e(d.p + Math.sqrt(d.std)); })
// // 		.attr("x2", function(d,i) { return x_e(i + 1) + x_e.rangeBand() / 2; })
// // 		.attr("y2", function(d) { return y_e(d.p - Math.sqrt(d.std)); });

// // 	// EXIT old elements not present in new data.
// // 	lines.exit()
// // 		.remove();
// // }

// // update sample size
// $("#samplesize_pe").on("change", function(e) {
//   n_pe = e.value.newValue;
//   update();
//   focus(time);
//   update_estimators([p_pe], time);
//   count(0, 0);
//   $("#samplesize_pe-value").html(n_pe);
// });

// //Handle Y axis buttons
// $('.property').on('click', function(){
//   $('.property').removeClass('active');
//   $(this).toggleClass('active');
//   property = $(this).html();
//   update();
//   focus(time);
// })

// // add sample button
// $("#sample").on("click", sample);

// // Setup
// update();
// focus();
// sample();
// estimators.select("rect").attr("id","true").call(drag);
// estimators.call(tipCP);


//*******************************************************************************//
// Likelihood
//*******************************************************************************//
function likelihood() {

	// 1: Set up dimensions of SVG
	var margin = {top: 60, right: 20, bottom: 60, left: 20},
		width = 700 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// 2: Create SVG
	var svg = d3.select("#likelihood").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Resize and format Slider
	$("#parameter").css('width',width).css('margin-left',margin.left);
  	$("#parameter").slider('refresh');
  	$('#parameter').slider({
		formatter: function(value) {
			return "\u03B8" + " = " + value;
		}
	});

	// constants
	var dt = 400,
		n = 1,
	    dist = "",
	    param = [],
	    h1 = height / 3,
	    h2 = 2 * height / 3,
	    h3 = height,
      	samples = [],
      	gap = 15;

    // distribution parameters
	var view_parameters = {'uniform':[-2,8], 'normal':[-5,5], 'exponential':[-2,8], '': [-2,8], 'bernoulli': [-1, 2], 'binomialDiscrete': [-1, 4], 'poisson': [-2,8]},
		initial_parameters = {'uniform':[0,6], 'normal':[0,1], 'exponential':[1], '': [], 'bernoulli': [0.5], 'binomialDiscrete': [3, 0.5], 'poisson': [3]};


	// scales
	var x = d3.scale.linear()
		.range([0, width]);
	var y1 = d3.scale.linear()
		.domain([0, 1])
		.range([h1, gap]);
	var y2 = d3.scale.linear()
		.domain([0, 1])
		.range([h2, h1 + gap]);
	var y3 = d3.scale.linear()
		.range([h3, h2 + gap]);


    // draw clips
	function draw_clip(selection, x, y, w, h, label) {
		  // clip path
		selection.append("clipPath")
	      .attr("id", label)
	      .append("rect")
	        .attr("x", x)
	        .attr("y", y)
	        .attr("width", w)
	        .attr("height", h);
	};

	// create three clips
	svg.call(draw_clip, 0, 0, width, h1, "view_y1");
	svg.call(draw_clip, 0, h1, width, h2, "view_y2");
	svg.call(draw_clip, 0, h2, 0, h3, "view_y3");


	// draw horizontal bar
	function draw_bar(selection, dy, label) {
	  // group
	  var axis = selection.append("g")
	  	.attr("class", "axis");
	  // bar
	  axis.append("line")
	    .attr("x1", 0)
	    .attr("x2", width)
	    .attr("y1", dy)
	    .attr("y2", dy);
	  // label
	  axis.append("text")
	    .attr("x", 0)
	    .attr("y", dy)
	    .attr("dy", "1em")
	    .text(label);
	};
	// create three bars
	svg.call(draw_bar, h1, "sampling distribution");
	svg.call(draw_bar, h2, "density f(x | \u03B8)");
	svg.call(draw_bar, h3, "likelihood L(\u03B8|x)");


	// compute probability density
	function density(distribution, parameters, range) {
		var datum = d3.range(range[0], range[1], 0.01).map(function(x) {
			var params = [x].concat(parameters);
			return [x, Math.max(Math.min(jStat[distribution].pdf.apply(null, params), 100), 0)]; 
		})
		return datum;
	}

	// compute likelihood function
	function likelihood(start, end) {
		var datum = d3.range(start, end, 0.01).map(function(p) {
			var prob = jStat(samples, function(x) {
				var params = [x].concat(param)
				if (dist == "uniform" || dist == "binomialDiscrete") 	params[2] = p;
				else 													params[1] = p;
				return Math.max(jStat[dist].pdf.apply(null, params),0);
			});
			return [p, jStat.product(prob[0])]; 
		});
		return datum;
	}

	// draw distribution
	function draw_distribution(datum, dur, x_scale, y_scale, class_name, clip_id) {
	  // path function
	  var line = d3.svg.line()
	    .x(function(d) { return x_scale(d[0]); })
	    .y(function(d) { return y_scale(d[1]); })
	    .interpolate("basis");
	  // bind data
	  var path = svg.selectAll("path." + class_name)
	  	.data([datum]);
	  // add path
	  path.enter().append("path")
	  	.attr("class", "distribution " + class_name)
        .attr("clip-path", "url(" + clip_id + ")");
      // plot path
	  path.transition()
	  	.duration(dur)
	    .attr("d", line);
	  // remove path
	  path.exit()
	  	.remove();
	}

	// sample from distribution
	function sample(distribution, paramters, n) {
		// check distribution is not ""
		if (dist == "") return;
		// take samples
		var data = [];
		for (var i = 0; i < n; i++) {
			data.push(jStat[dist].sample.apply(null, param));
		};
		// bind samples
		var circle = svg.selectAll("circle.sample")
		  .data(data);
		// add circles and transition
		circle.enter().append("circle")
		  .transition()
      	  .delay(function(d, i) { return i * dt / n; })
		  .attr("cx", function(d) { return x(d); })
	      .attr("cy", h1)
		  .attr("class", "sample")
		  .attr("clip-path", "url(#view_y2")
		  .attr("r", 5)
		  .transition()
	      .duration(dt)
	      .attr("cy", h2 - 5);
	    // remove extra circles
	    circle.exit()
	      .remove();
	    // return samples
    	return data;
	}

	// add drop down to circles
	function drop(parameters, p) {

		// Add drop lines
		var lines = svg.selectAll("line.sample-line")
		  .data(samples);
		lines.enter().append("line")
		  .attr("class", "sample-line")
		  .attr("clip-path", "url(#view_y2");
		lines.attr("x1", function(d) { return x(d); })
	      .attr("x2", function(d) { return x(d); })
	      .attr("y1", function(d) { 
	      	return y2(Math.max(jStat[dist].pdf.apply(null, [d].concat(parameters)), 0)); 
	      })
	      .attr("y2", h2);
	    lines.exit()
	      .remove();

	    // Move Circles
	    var circles = svg.selectAll("circle.sample");
		circles.attr("cy", function(d) {
			return y2(Math.max(jStat[dist].pdf.apply(null, [d].concat(parameters)), 0)) - 5; 
		})
		.moveToFront();

		// Update clip view
		svg.select("#view_y3 rect")
		  .attr("width", x(p));

		// Update likelihood
		svg.select(".likelihood")
		  .attr("clip-path", "url(#view_y3");


		if (!samples.length) return

		// Add drop lines
		var line = svg.selectAll("line.likelihood-line")
		  .data([p]);
		line.enter().append("line")
		  .attr("class", "likelihood-line");
		line.attr("x1", function(d) { return x(d); })
	      .attr("x2", function(d) { return x(d); })
	      .attr("y1", function(d) { 
	      	var prob = jStat(samples, function(x) {
				var params = [x].concat(parameters)
				return Math.max(jStat[dist].pdf.apply(null, params),0);
			});
	      	return y3(jStat.product(prob[0])); 
	      })
	      .attr("y2", h3);
	    lines.exit()
	      .remove();

	    // Add drop circle
		var circle = svg.selectAll("circle.likelihood")
		  .data([p]);
		circle.enter().append("circle")
		  .attr("class", "likelihood");
		circle.attr("r", 3)
	      .attr("cx", function(d) { return x(d); })
	      .attr("cy", function(d) { 
	      	var prob = jStat(samples, function(x) {
				var params = [x].concat(parameters)
				return Math.max(jStat[dist].pdf.apply(null, params),0);
			});
	      	return y3(jStat.product(prob[0])); 
	      });
	    circle.exit()
	      .remove();
	}


	// reset sampling
	function reset() {
		svg.selectAll(".likelihood").remove();
		svg.selectAll(".likelihood-line").remove();
		svg.selectAll(".density").remove();
		svg.selectAll(".sample-line").remove();
		svg.select("#view_y3 rect").attr("width", 0);
		$("#parameter").slider('setValue', view[0]);
	    samples = sample(dist, param, 0);
	}

	// set slider view
	function setview(range) {
		// Change slider min, max and step
		$("#parameter").slider('setAttribute', 'max', range[1]);
   		$("#parameter").slider('setAttribute', 'min', range[0]);
   		$("#parameter").slider('setAttribute', 'step', (range[1] - range[0]) / 100);
		// Apply setValue to redraw slider
		$("#parameter").slider('setValue', range[0]);
		// Refresh slider
		$("#parameter").slider('refresh');
		// set x domain
		x.domain(range);
	}

	// handle distribution change
	$("#dist a").on('click', function() {
	    dist = $(this).attr('value');
	    param = initial_parameters[dist];
	    var data;
	    if (dist == "") {
	      reset();
	      $('#dist_name').val("");
	      dist = null;
	      data = [];
	    } else {
	      $('#dist_name').val($(this).html());
	      view = view_parameters[dist];
	      setview(view);
	      data = density(dist, param, view);
	    }
	    draw_distribution(data, 0, x, y1, "sampling", "#view_y1");
	    reset();
	});

	// update sample size
	$("#sample_size").on("slide", function(e) {
		n = e.value;
		$("#sample_size-value").html(n);
	});

	// handle sample button
	$('#sample').on('click', function() {
		reset();
		samples = sample(dist, param, n);
		var data = likelihood(view[0], view[1]);
		// reset y3 scale
		var max = data.reduce(function(a, b) {
		    return Math.max(a, b[1]);
		}, 0);
		y3.domain([0, max]);
		draw_distribution(data, 0, x, y3, "likelihood", "#view_y3");
	});

	// update parameter
	$("#parameter").on("slide", function(e) {
		var p = e.value;
		if (dist == "") return
		var parameters = param.slice()
		if (dist == "uniform" || dist == "binomialDiscrete") 	parameters[1] = p;
		else 													parameters[0] = p;
		var data = density(dist, parameters, view);
		draw_distribution(data, 0, x, y2, "density", "#view_y2");
		drop(parameters, p);
	});
	
	return {'setup': null, 'resize': null, 'reset': null, 'update': null};
};


//*******************************************************************************//
// prior
//*******************************************************************************//
// Turn to canvas to make less laggy: https://bl.ocks.org/mbostock/1550e57e12e73b86ad9e

function prior() {

	//Handles CSS animation for coin and die
	//Adapted from http://jsfiddle.net/byrichardpowell/38MGS/1/
	$.fn.animatecss = function(anim, time, cb) {
	    if (time) this.css('-webkit-transition', time / 1000 + 's');
	    this.addClass(anim);
	    if ($.isFunction(cb)) {
	        setTimeout(function() {
	            $(this).each(cb);         
	        }, (time) ? time : 250);
	    }
	    return this;
	};

	// 1: Set up dimensions of SVG
	var margin = {top: 60, right: 20, bottom: 60, left: 20},
		width = 700 - margin.left - margin.right,
		height = 550 - margin.top - margin.bottom;

	// 2: Create SVG
	var svg = d3.select("#prior").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 3: Scales
	var x = d3.scale.linear()
		.domain([0, 1])
	    .range([0, width]);
	var y = d3.scale.linear()
		.domain([0,3])
	    .range([height, 0]);

	// 4: Axes
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(3);

	// 5: Graph
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	// 6: Axes Labels
	svg.append("text")
	  .attr("class", "label")
	  .attr("text-anchor", "middle")
	  .attr("transform", "translate(" + width / 2 + "," + (height + margin.bottom / 2) + ")")
	  .text("p");              

	// computes pdf of beta with input parameters
	function posterior(a, b) {
		return d3.range(0, 1.01, 0.01).map(function(x) { 
	    		return [x, Math.min(jStat.beta.pdf(x, a, b), 100)];
	    });
	}

	// Variables and Data
	var p = 0.5,
		alpha = 1,
		beta = 1,
		count = 0,
		n = 0,
		data = [posterior(alpha, beta)];


	//7: Join, Update, Enter, Exit
	function update(time) {

		// update y domain
		var mode = (alpha + count - 1) / (alpha + beta + n - 2);
			max = jStat.beta.pdf([mode], alpha + count, beta + n - count);
		if (max > y.domain()[1]) {
			y.domain([0, 1.1 * max]);
		}

		// Add verticle line
		var line = svg.selectAll("line.true")
		  .data([p]);

		line.enter().append("line")
		  .attr("class", "true");

		line.transition().duration(time)
		  .attr("x1", function (d) { return x(d); })
		  .attr("y1", y.range()[0])
		  .attr("x2", function (d) { return x(d); })
		  .attr("y2", y(2 * y.domain()[1]));

		// path function
		var line = d3.svg.line()
			.x(function(d) { return x(d[0]); })
			.y(function(d) { return y(d[1]); })
			.interpolate("basis");

		// JOIN new data with old elements.
		var priors = svg.selectAll("path.beta")
		  .data(data);

		// ENTER new elements present in new data.
		priors.enter().append("path")
		  .attr("class", "beta");

		// UPDATE old elements present in new data.
		priors.transition().duration(time)
		  .attr("d", line)
		  .attr("stroke-width", function(d, i) { return ((i == data.length - 1) ? 3 : 1); })
		  .attr("stroke-opacity", function(d, i) { return Math.max(1 / (data.length - i), 0.2); });

		// EXIT old elements not present in new data.
		priors.exit()
		  .remove();

		// Update coin count
	 	$("#head").html(count);
	 	$("#tail").html(data.length - 1 - count);
	}

	//Determines outcome of coin flip and updates data
	function flip(coin) {
		var num = Math.random(),
			img = (num < p) ? "url(../img/head.png)" : "url(../img/head.png)";
		n += 1;
		count += ((num < p) ? 1 : 0);
		coin.css("background-image", img);
		data.push(posterior(alpha + count, beta + n - count));
		update(100);
	}

	// resets count and data
	function reset() {
		n = 0;
		count = 0;
		data = [posterior(alpha, beta)];
		y.domain([0,3])
		update(0);
	}

	// flip coin 1
	$('#flip_1').click(function() {
		var coin = $("#coin");
	    coin.animatecss('blur-out', 500, function() {
	    	coin.css("font-size", "50px");
	    	flip(coin);
	        coin.removeClass('blur-out');
	    });
	});

	// flip coin 10
	$('#flip_10').click(function() {
		var coin = $("#coin");
		var count = 0;
		var interval = setInterval(function() {
			coin.animatecss('blur-out', 15, function() {
		    	coin.css("font-size", "50px");
		    	flip(coin);
		        coin.removeClass('blur-out');
		    });
		   	if (++count === 10){
	        	clearInterval(interval);
	       	}    
		}, 15);
	});

	// update p
	$("#p").on("slide", function(e) {
	  p = e.value;
	  d3.select("#p-value").text(round(p, 2));
	  reset();
	});

	// update alpha
	$("#alpha").on("slide", function(e) {
	  alpha = e.value;
	  d3.select("#alpha-value").text(round(alpha, 2));
	  reset();
	});

	// update beta
	$("#beta").on("slide", function(e) {
	  beta = e.value;
	  d3.select("#beta-value").text(round(beta, 2));
	  reset();
	});

	// setup
	update();
}

//*******************************************************************************//
// posterior
//*******************************************************************************//

// function posterior() {

// 	// set up dimensions of SVG
// 	var margin = {top: 60, right: 20, bottom: 60, left: 20},
// 		width = 700 - margin.left - margin.right,
// 		height = 600 - margin.top - margin.bottom;

// 	// create SVG
// 	var svg = d3.select("#posterior").append("svg")
// 	    .attr("width", width + margin.left + margin.right)
// 	    .attr("height", height + margin.top + margin.bottom)
// 	  .append("g")
// 	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 	// resize posterior slider
// 	$("#integrate").css('width',width).css('margin-left',margin.left);
//   	$("#integrate").slider('refresh');

// 	// define constants
// 	var dt = 1000,
// 		n = 1,
// 		a = 1,
// 		b = 1,
// 	    dist = "",
// 	    param = [],
// 	    h1 = height / 3,
// 	    h2 = 2 * height / 3,
// 	    h3 = height,
//       	samples = [],
//       	gap = 15,
//       	product = false;

//    // distribution parameters
// 	var view_parameters = {'uniform':[-2,8], 'normal':[-2,8], 'exponential':[-2,8], "": [0,0]},
// 		initial_parameters = {'uniform':[0,6], 'normal':[3,1], 'exponential':[1], "": []},
// 		unknown_parameters = {'uniform':"b", 'normal':"\u03BC", 'exponential': "\u03BB", "":""},
// 		conjugate_prior = {'uniform': 'pareto', 'normal': 'normal', 'exponential': 'gamma', "": ""};

// 	// set up scales
// 	var x = d3.scale.linear()
// 		.range([0, width]);
// 	var y1 = d3.scale.linear()
// 		.domain([0, 1])
// 		.range([h1, gap]);
// 	var y2 = d3.scale.linear()
// 		.domain([0, 1])
// 		.range([h3, h1 + gap]);
// 	// var y3 = d3.scale.linear()
// 	// 	.domain([0, 1])
// 	// 	.range([h3, h2 + gap]);

//     // draw clip paths
// 	function draw_clip(selection, x, y, w, h, label) {
// 		selection.append("clipPath")
// 	      .attr("id", label)
// 	      .append("rect")
// 	        .attr("x", x)
// 	        .attr("y", y)
// 	        .attr("width", w)
// 	        .attr("height", h);
// 	};
// 	// create clip paths
// 	svg.call(draw_clip, 0, 0, width, h1, "view_h1");
// 	svg.call(draw_clip, 0, h1, width, 2 * h1, "view_h2");
// 	svg.call(draw_clip, 0, h1, 0, 2 * h1, "view_h3");

// 	// draw horizontal bar
// 	function draw_bar(selection, dy, label, class_name, display) {
// 	  // group
// 	  var axis = selection.append("g")
// 	  	.attr("class", "axis");
// 	  // bar
// 	  axis.append("line")
// 	    .attr("x1", 0)
// 	    .attr("x2", width)
// 	    .attr("y1", dy)
// 	    .attr("y2", dy);
// 	  // label
// 	  axis.append("text")
// 	    .attr("x", 0)
// 	    .attr("y", dy)
// 	    .attr("dy", "1em")
// 	    .attr("class", class_name)
// 	    .attr("display", display)
// 	    .text(label);
// 	};
// 	// create three bars
// 	svg.call(draw_bar, h1, "sampling distribution", 'sampling_bar');
// 	svg.call(draw_bar, h3, "likelihood P(x|\u03B8) & prior P(\u03B8)", 'bar');
// 	svg.call(draw_bar, h3, "posterior P(\u03B8|x)", 'bar', 'none');


// 	// compute probability density
// 	function density(distribution, parameters, range) {
// 		var datum = d3.range(range[0], range[1], 0.01).map(function(x) {
// 			var params = [x].concat(parameters);
// 			return [x, Math.max(Math.min(jStat[distribution].pdf.apply(null, params), 100), 0)]; 
// 		})
// 		return datum;
// 	}

// 	// computes likelihood of samples
// 	function likelihood(distribution, paramaters, samples, p) {
// 		var prob = jStat(samples, function(x) {
// 			var params = [x].concat(paramaters)
// 			if (distribution == "uniform") 	params[2] = p;
// 			else 							params[1] = p;
// 			return Math.max(jStat[distribution].pdf.apply(null, params),0);
// 		});
// 		return jStat.product(prob[0]); 
// 	}

// 	// computes marginalizing constant
// 	function marginal(sampling, conjugate, param_likelihood, param_prior, param_posterior, samples) {
// 		var mode = jStat[conjugate].mode.apply(null, param_posterior),
// 			l = likelihood(sampling, param_likelihood, samples, mode),
// 			prior = jStat[conjugate].pdf.apply(null, [mode].concat(param_prior)),
// 			posterior = jStat[conjugate].pdf.apply(null, [mode].concat(param_posterior));
// 		if (sampling == "uniform") {
// 			return l * prior / posterior;
// 		}
// 		if (sampling == "normal") {
// 			var s = param_likelihood[1],
// 				n = samples.length,
// 				m = param_prior[0],
// 				t = param_prior[1],
// 				x = jStat.mean(samples)
// 				x2 = jStat.sumsqrd(samples);
// 			var c = Math.sqrt(s) / (Math.pow(Math.sqrt(2 * Math.PI), n) * Math.sqrt(n * t + s));
// 			var e1 = Math.exp(- x2 / (2 * s) - m * m / (2 * t));
// 			var e2 = Math.exp(((t * n * n * x * x / s) + (s * m * m / t) + (2 * n * x * m)) / (2 * (n * t + s)));
// 			console.log(c * e1 * e2)
// 			return c * e1 * e2;
// 		}
// 		if (sampling == "exponential") {
// 			return l * prior / posterior;
// 		}
// 	}

// 	// computes marginal likelihood
// 	function marginal_likelihood(sampling, conjugate, param_likelihood, param_prior, param_posterior, samples, range) {
// 		var m = marginal(sampling, conjugate, param_likelihood, param_prior, param_posterior, samples);
// 		var datum = d3.range(range[0], range[1], 0.01).map(function(p) {
// 			var l = likelihood(sampling, param_likelihood, samples, p);
// 			return [p, l];/// m]; 
// 		});
// 		return datum;
// 	}


// 	// compute posterior parameters
// 	function posterior(prior, parameters, samples) {
// 		var n = samples.length;
// 		if (prior == "pareto") {
// 			return [jStat.max([parameters[0]].concat(samples)), parameters[1] + n];
// 		}
// 		if (prior == "normal") {
// 			var mu = parameters[0] / Math.pow(parameters[1], 2) + jStat.sum(samples);
// 			var sigma = 1 / Math.pow(parameters[1], 2) + n;
// 			return [mu / sigma, Math.sqrt(1 / sigma)];
// 		}
// 		if (prior == "gamma"){
// 			return [parameters[0] + n, 1 / (1 / parameters[1] + jStat.sum(samples))];
// 		}
// 	}

// 	// draw distribution
// 	function draw_distribution(datum, dur, x_scale, y_scale, class_name, clip_id, color) {
// 	  // path function
// 	  var line = d3.svg.line()
// 	    .x(function(d) { return x_scale(d[0]); })
// 	    .y(function(d) { return y_scale(d[1]); })
// 	    .interpolate("basis");
// 	  // bind data
// 	  var path = svg.selectAll("path." + class_name)
// 	  	.data([datum]);
// 	  // add path
// 	  path.enter().append("path")
// 	  	.attr("class", "distribution " + class_name)
//         .attr("clip-path", "url(" + clip_id + ")");
//       // plot path
// 	  path.transition()
// 	  	.duration(dur)
// 	    .attr("d", line)
// 	    .style("stroke", color);
// 	  // remove path
// 	  path.exit()
// 	  	.remove();
// 	}

// 	// sample from distribution
// 	function sample(distribution, paramters, n) {
// 		// check distribution is not ""
// 		if (dist == "") return;
// 		// take samples
// 		var data = [];
// 		for (var i = 0; i < n; i++) {
// 			data.push(jStat[dist].sample.apply(null, param));
// 		};
// 		// bind samples
// 		var circle = svg.selectAll("circle.sample")
// 		  .data(data);
// 		// add circles
// 		circle.enter().append("circle")
// 		  .attr("class", "sample")
// 		  .attr("clip-path", "url(#view_y2")
// 		  .attr("r", 5);
// 		// transition circles
// 		circle.attr("cx", function(d) { return x(d); })
// 	      .attr("cy", h1)
// 	      .transition()
// 	      .duration(dt)
// 	      .attr("cy", h3 - 5)
// 	      .attr("r", 3)
// 	      .remove();
// 	    // remove extra circles
// 	    circle.exit()
// 	      .remove();
// 	    // return samples
//     	return data;
// 	}


// 	// reset visualization
// 	function reset(classes) {
// 		// reset product
// 		product = false;
// 		$('.integrate').css("display", '');
// 		$(".bar").css("display", '');
// 		// remove path classes
// 		svg.selectAll(".marginal_likelihood").remove();
// 		//svg.selectAll(".posterior").remove();
// 	    // reset samples
// 	    samples = [];
// 	}

// 	// updates distributions
// 	function draw() {
// 		// sampling
// 		var sampling_data = density(dist, param, view);
// 		draw_distribution(sampling_data, dt, x, y1, "sampling", "#view_h1");
// 	    // prior
// 	    var prior_data = density(conjugate_prior[dist], [a,b], view);
// 	 	// samples
// 	    if (samples.length) {
// 			// marginal likelihood
// 			var parameters = posterior(conjugate_prior[dist], [a,b], samples);
// 			var likelihood_data = marginal_likelihood(dist, conjugate_prior[dist], param, [a,b], parameters, samples, view);
// 			// draw_distribution(likelihood_data, dt, x, y2, "marginal_likelihood", "#view_h2");
// 			// posterior
// 		 	var parameters = posterior(conjugate_prior[dist], [a,b], samples);
// 			var posterior_data = density(conjugate_prior[dist], parameters, view);
// 		 	//draw_distribution(posterior_data, 0, x, y2, "posterior", "#view_h3");
// 		 	// reset y2 scale
// 		}
// 		// draw paths
// 		if (product) {
// 			var max = posterior_data.reduce(function(a, b) {
// 			    return Math.max(a, b[1]);
// 			}, 0);
// 			y2.domain([0, max]);
// 			draw_distribution(posterior_data, 1000, x, y2, "prior", "#view_h2", "#fc4e77");
// 			draw_distribution(posterior_data, 1000, x, y2, "marginal_likelihood", "#view_h2", "#fc4e77");
// 		} else {
// 			var max = prior_data.reduce(function(a, b) {
// 			    return Math.max(a, b[1]);
// 			}, 0);
// 			y2.domain([0, max]);
// 		    draw_distribution(prior_data, 0, x, y2, "prior", "#view_h2");
// 		    draw_distribution(likelihood_data, dt, x, y2, "marginal_likelihood", "#view_h2");
// 		}
// 	}


// 	// distribution selection
// 	$("#dist_posterior a").on('click', function() {
// 		// reset all distributions
// 		reset();
// 		// get distribution and paramters
// 	    dist = $(this).attr('value');
// 	    param = initial_parameters[dist];
// 	    view = view_parameters[dist];
// 	    // show congugate prior
// 	    $('.prior_parameters').css('display','none');
// 	    $('#' + dist).toggle()
// 	    // update posterior slider
// 	   	$('#integrate').slider({
// 			formatter: function(value) {
// 				return unknown_parameters[dist] + " = " + value;
// 			}
// 		});
// 		// set distribution name
// 		$('#dist_name_posterior').val(dist != "" ? $(this).html() : "");
// 	    // draw sampling dist
// 	    x.domain(view);
// 	    draw();
// 	});

// 	// prior paramter (1) slide
// 	$(".param-1").on("slide", function(e) {
// 		a = e.value;
// 		$("#" + this.id + "-value").html(a);
// 		draw();
// 	});

// 	// prior paramter (2) slide
// 	$(".param-2").on("slide", function(e) {
// 		b = e.value;
// 		$("#" + this.id + "-value").html(b);
// 		draw();
// 	});

// 	// sample size slide
// 	$("#sample_size_posterior").on("slide", function(e) {
// 		//reset();
// 		n = e.value;
// 		$("#sample_size_posterior-value").html(n);
// 	});

// 	// sample button
// 	$('#sample_posterior').on('click', function() {
// 		//reset();
// 		samples = sample(dist, param, n);
// 		draw();
// 	});

// 	// // posterior slide
// 	// $("#integrate").on("slide", function(e) {
// 	// 	// get value
// 	// 	var p = e.value;
// 	// 	// Update clip view
// 	// 	svg.select("#view_h3 rect")
// 	// 	  .attr("width", x(p));
// 	// 	// draw posterior
// 	// 	svg.select(".posterior")
// 	// 	  .attr("clip-path", "url(#view_h3)");
// 	// 	// add drop lines
// 	// 	var parameters = posterior(conjugate_prior[dist], [a,b], samples);
// 	// 	drop(p, conjugate_prior[dist], parameters);

// 	// 	// var p = e.value;
// 	// 	// if (dist == "") return
// 	// 	// var parameters = param.slice()
// 	// 	// if (dist == "uniform") 	parameters[1] = p
// 	// 	// else 					parameters[0] = p
// 	// 	// var data = pdf_data(view[0], view[1], parameters);
// 	// 	// draw_pdf(data, 0);
// 	// 	// drop(parameters, p);
// 	// });

// 	$('#show_posterior').on('click', function() {
// 		// posterior
// 		product = true;
// 		draw()
// 		$(".bar").toggle();
// 		$(".integrate").toggle();
// 	});
// 	$('#show_prior_likelihood').on('click', function() {
// 		// posterior
// 		product = false;
// 		draw();
// 		$(".bar").toggle();
// 		$(".integrate").toggle();
// 	});
	
// 	// return visualization functions
// 	return {'setup': null, 'resize': null, 'reset': null, 'update': null};
// };
