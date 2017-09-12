//Handles functionality of Statistical Inference

// load visualizations
$( window ).load(function() {
  $('#myModal').modal('show');
  prior();
  likelihood();
});

// window resize
$(window).on("resize", function () {

});

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

	// constants
	var dt = 400,
		n = 1,
	    dist = null,
	    param = [],
	    y1 = height / 3,
	    y2 = 2 * height / 3,
	    y3 = height,
      	samples = [];


	// scales
	var x = d3.scale.linear()
		.range([0, width]);
	var y = d3.scale.linear()
		.domain([0, 1])
		.range([y1, 0]);
	var z = d3.scale.linear()
		.range([y3, y2 + 10]);


	// clip path
	svg.append("clipPath")
    .attr("id", "view")
    .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height);

    // clip path
	svg.append("clipPath")
      .attr("id", "view-likelihood")
      .append("rect")
        .attr("x", 0)
        .attr("y", y2)
        .attr("width", 0)
        .attr("height", y1);

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
	svg.call(draw_bar, y1, "distribution");
	svg.call(draw_bar, y2, "sample");
	svg.call(draw_bar, y3, "likelihood");


	// get pdf data
	function pdf_data(start, end, parameters) {
	  var datum = d3.range(start, end, 0.01).map(function(x) {
	      var params = [x].concat(parameters);
	      return [x, jStat[dist].pdf.apply(null, params)]; 
	  })
	  return datum;
	}

	// get pdf data
	function likelihood(start, end) {
		var datum = d3.range(start, end, 0.01).map(function(p) {
			var prob = jStat(samples, function(x) {
				var params = [x].concat(param)
				params[1] = p;
				return Math.max(jStat[dist].pdf.apply(null, params),0);
			});
			return [p, jStat.product(prob[0])]; 
		});
		datum.push([end + 1, 0])
		return [[start - 1, 0]].concat(datum);
	}

	// Update sampling distribution
	function draw_sampling(datum, dur) {

	  // path function
	  var line = d3.svg.line()
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return y(d[1]); })
	    .interpolate("basis");

	  // transition pdf path
	  var pdf_line = svg.selectAll("path.sampling")
	  	.data([datum]);
	  pdf_line.enter().append("path")
	  	.attr("class", "sampling")
      .attr("clip-path", "url(#view)");
	  pdf_line.transition()
	  	.duration(dur)
	    .attr("d", line);

	}

	// Update sampling distribution
	function draw_pdf(datum, dur) {

	  // path function
	  var line = d3.svg.line()
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return y(d[1]) + y1; })
	    .interpolate("basis");

	  // transition pdf path
	  var pdf_line = svg.selectAll("path.pdf")
	  	.data([datum]);
	  pdf_line.enter().append("path")
	  	.attr("class", "pdf")
      .attr("clip-path", "url(#view)");
	  pdf_line.transition()
	  	.duration(dur)
	    .attr("d", line);

	}

	// Update sampling distribution
	function draw_likelihood(datum, dur) {

		// reset z scale
		var max = datum.reduce(function(a, b) {
		    return Math.max(a, b[1]);
		}, 0);
		z.domain([0, max]);

	  // path function
	  var line = d3.svg.line()
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return z(d[1]); })
	    .interpolate("basis");

	  // transition pdf path
	  var pdf_line = svg.selectAll("path.likelihood")
	  	.data([datum]);
	  pdf_line.enter().append("path")
	  	.attr("class", "likelihood")
	  	.attr("clip-path", "url(#view)")
	  	.attr("clip-path", "url(#view-likelihood)");
	  pdf_line.transition()
	  	.duration(dur)
	    .attr("d", line);

	}

	// add drop down to circles
	function drop(parameters) {

		// Add drop lines
		var lines = svg.selectAll("line.sample-line")
		  .data(samples);
		lines.enter().append("line")
		  .attr("class", "sample-line");
		lines.attr("x1", function(d) { return x(d); })
	      .attr("x2", function(d) { return x(d); })
	      .attr("y1", function(d) { 
	      	return y(jStat[dist].pdf.apply(null, [d].concat(parameters))) + y1; 
	      })
	      .attr("y2", y2);
	    lines.exit()
	      .remove();

	    // Move Circles
	    var circles = svg.selectAll("circle.sample");
		circles.attr("cy", function(d) {
			return y(jStat[dist].pdf.apply(null, [d].concat(parameters))) + y1; 
		})
		.moveToFront();

		// Update clip view
		svg.select("#view-likelihood rect")
		  .attr("width", x(parameters[0]));

		// Update likelihood
		svg.select(".likelihood")
		  .attr("clip-path", "url(#view-likelihood)");


		// Add drop lines
		var line = svg.selectAll("line.likelihood-line")
		  .data([parameters[0]]);
		line.enter().append("line")
		  .attr("class", "likelihood-line");
		line.attr("x1", function(d) { return x(d); })
	      .attr("x2", function(d) { return x(d); })
	      .attr("y1", function(d) { 
	      	var prob = jStat(samples, function(x) {
				var params = [x].concat(parameters)
				return Math.max(jStat[dist].pdf.apply(null, params),0);
			});
	      	return z(jStat.product(prob[0])); 
	      })
	      .attr("y2", y3);
	    lines.exit()
	      .remove();

	    // Add drop circle
		var circle = svg.selectAll("circle.likelihood")
		  .data([parameters[0]]);
		circle.enter().append("circle")
		  .attr("class", "likelihood");
		circle.attr("r", 3)
	      .attr("cx", function(d) { return x(d); })
	      .attr("cy", function(d) { 
	      	var prob = jStat(samples, function(x) {
				var params = [x].concat(parameters)
				return Math.max(jStat[dist].pdf.apply(null, params),0);
			});
	      	return z(jStat.product(prob[0])); 
	      });
	    circle.exit()
	      .remove();
	}


	function sample(n) {
		// Check dist is not null
		if (dist == null) return;
		// Take samples
		var data = [];
		for (var i = 0; i < n; i++) {
			data.push(jStat[dist].sample.apply(null, param));
		};
		// Add samples
		var circle = svg.selectAll("circle.sample")
		  .data(data);
		circle.enter().append("circle")
		  .attr("class", "sample")
		  .attr("r", 5);
		circle.attr("cx", function(d) { return x(d); })
	      .attr("cy", y1)
	      .transition()
	      .duration(dt)
	      .attr("cy", y2 - 5)
	    circle.exit()
	      .remove();
	    // return samples
    	return data;
	}


	// update sample size
	$("#sample_size").on("slide", function(e) {
		reset();
		n = e.value;
		$("#sample_size-value").html(n);
	});

	// reset sampling
	function reset() {
		svg.select(".likelihood").remove();
	    sample(0);
	    samples = [];
	}

	// distribution parameters
	var view_parameters = {'uniform':[-6,6], 'normal':[-6,6], 'exponential':[-1,6], '': []},
		initial_parameters = {'uniform':[-4,4], 'normal':[0,1], 'exponential':[1], '': []};

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
	      x.domain(view);
	      data = pdf_data(view[0], view[1], param);
	    }
	    draw_sampling(data, 100);
	    reset();
	});

	// start buttons
	$('#sample').on('click', function() {
		reset();
		samples = sample(n);
		var data = likelihood(view[0], view[1]);
		draw_likelihood(data, 100);
	});

	// update parameter
	$("#parameter").on("slide", function(e) {
		var p = e.value;
		$("#parameter-value").html(p);
		if (dist == "") return
		var parameters = param.slice()
		parameters[0] = p
		var data = pdf_data(view[0], view[1], parameters);
		draw_pdf(data, 0);
		drop(parameters);
	});

	// start buttons
	$('#generate').on('click', function() {
		if (!samples.length) return
		var data = likelihood(view[0], view[1]);
		draw_likelihood(data, 100);
	});

	
	return {'setup': null, 'resize': null, 'reset': null, 'update': null};
};


