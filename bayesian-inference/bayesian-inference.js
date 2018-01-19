//Handles functionality of Bayesian Inference

// load visualizations
$( window ).load(function() {
  bayes();
  likelihood();
  prior();
});


//*******************************************************************************//
// Bayes' Theorem
//*******************************************************************************//

// To do:
//  0) Pick better colors
//  1) Make sliders tall rectangles
//  2) Clean code, fix bugs, css table

function bayes() {

	// set up dimensions of SVG
	var margin = {top: 120, right: 20, bottom: 20, left: 20},
		width = 700 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// create SVG
	var svg = d3.select("#bayes").append("svg")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
	    .attr("preserveAspectRatio", "xMidYMid meet")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// scales
	var x = d3.scale.linear()
		.domain([0, 1])
		.range([0, width]);
	var y = d3.scale.linear()
		.domain([0, 1])
		.range([0, height]);
	var z = d3.scale.linear()
		.domain([0, 1])
	    .range([x(0.25), x(0.75)]);

	// constants
	var w = 0.25,
		h0 = 0.15,
		h1 = 0.25,
		h2 = 0.3,
		col = 20,
		r = (w * width) / (2 * col),
		n = 500,
		m = 0,
		p = 0.25,
		p_d = 0.75,
		p_h = 0.25;

	// draw horizontal bar
	function draw_bar(selection, x1, x2, y1, y2, label) {
	  // group
	  var axis = selection.append("g")
	  	.attr("class", "bar");
	  // bar
	  axis.append("line")
	    .attr("x1", x(x1))
	    .attr("x2", x(x2))
	    .attr("y1", y(y1))
	    .attr("y2", y(y2));
	  // label
	  axis.append("text")
	    .attr("x", x((x1 + x2) / 2))
	    .attr("y", y((y1 + y2) / 2))
	    .attr("dy", "1em")
	    .text(label);
	};
	// create three bars
	svg.call(draw_bar, 0.5, 0.5, 0, 0, "Population");
	svg.call(draw_bar, 0.25, 0.5, h1, h0, "");
	svg.call(draw_bar, 0.5, 0.75, h0, h1, "");
	svg.call(draw_bar, 0.25, 0.25, h1, h2, "");
	svg.call(draw_bar, 0.75, 0.75, h1, h2, "");
	svg.call(draw_bar, 0.5, 0.5, (h1 + h0) / 2, (h1 + h0) / 2, "Test");
	svg.call(draw_bar, (0.5 - w) / 2, (0.5 + w) / 2, 1, 1, "Negative");
	svg.call(draw_bar, (1.5 - w) / 2, (1.5 + w) / 2, 1, 1, "Positive");

	// slider axis
	var slider = d3.svg.axis()
	    .scale(z)
	    .orient("bottom")
	    .ticks(5);
	// slider bar
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + y(h2) + ")")
	  .call(slider);

	// draw conditional sliders
	function draw_slider(data) {
		var w = 10,
			rects = svg.selectAll("rect")
			.data(data);

		rects.enter().append("rect")
			.attr('y', y(h2) - w / 2)
		    .attr('width', w / 2)
		    .attr("class", function(d, i) { return (!i ? "healthy" : "disease"); })
		    .attr('height', w);

		rects.attr('x', function(d){ return z(d) - w / 4; });;
	};

	draw_slider([p_h, p_d]);

	// visualize patients
	function drop(patients, dt) {

	    // bind patients to circles
		var circle = svg.selectAll("circle.patient")
		  .data(patients);

		// update circles
		circle.transition().duration(dt)
	      .attr("cx", function(d) { 
	      	return x(0.5 * d.positive_test + (0.5 - w) / 2) + r + 2*r * (d.order % col);
	      })
	      .attr("cy", function(d) { 
	      	return y(1) - r - 2*r * Math.floor(d.order / col) - 1; 
	      });

		// add circles
		circle.enter().append("circle")
		  .attr("r", r - 1)
		  .attr("cx", x(0.5))
	      .attr("cy", -height/6)
	      .attr("class", function(d) {
		  	c1 = d.has_disease ? " disease" : " healthy"
		  	c2 = d.positive_test ? " positive" : " negative"
		  	return "patient" + c1 + c2;
		  })
		  .transition()
		  .delay(function(d, i) { return i * dt; })
	      .attr("cy", y(h0) - r)
	      	.transition().duration(dt)
	      	  .attr("cx", function(d) {
	      	  	return x(0.5 + (2 * d.positive_test - 1) * 0.25)
	      	  })
	      	  .attr("cy", y(h1) - r)
	      	  .transition()
	      	  .attr("cy", y(h2))
	      	  .transition().duration(dt)
	      	  	.attr("cx", function(d) { 
			      return x(0.5 * d.positive_test + (0.5 - w) / 2) + r + 2*r * (d.order % col); 
			    })
	      	  	.attr("cy", function(d) { 
		      	  return y(1) - r - 2*r * Math.floor(d.order / col) - 1; 
		      	});

	    // remove circles
	    circle.exit()
	      .remove();
	}

	// generates patient array
	function generate_patients(num, disease, p_d, p_h) {
	        var patients = new Array(num);
	        for (i = 0; i < patients.length; i++) {
	                var has_disease = Math.random() < disease,
	                	positive_test;
	                if (has_disease) {
	                        positive_test = Math.random() < p_d;
	                } else {
	                        positive_test = Math.random() < p_h;
	                }
	                patients[i] = {
	                		order: i,
	                        index: i,
	                        has_disease: has_disease,
	                        positive_test: positive_test,
	                }
	        }
	        return patients;
	}

	// Sort first n patients and add
	function add(sort, t){
		var positive = [],
			negative = [];
		for (var i = 0; i < m; i++) {
			var patient = patients[i];
			if (patient.positive_test) {
				add_patient(patient, positive, sort);
			} else {
				add_patient(patient, negative, sort);
			}
		}
		var data = [];
		for (var i = 0; i < positive.length; i++) {
			var index = positive[i].index;
			patients[index].order = i;
		}
		for (var i = 0; i < negative.length; i++) {
			var index = negative[i].index;
			patients[index].order = i;
		}
		drop(patients.slice(0, m), t)
	}

	// sort patient array
	function add_patient(new_patient, patient_array, sort) {
        if (new_patient.has_disease & sort) {
        	patient_array.unshift(new_patient);
        } else {
        	patient_array.push(new_patient);
        }
	}

	// Generate Population
	function generate_population(n, phi) {

		var nodes = d3.range(n).map(function() { return {has_disease: Math.random() < phi}; }),
		    root = nodes[0];


		root.radius = 0;
		root.fixed = true;

		var force = d3.layout.force()
		    .gravity(0.80)
		    .nodes(nodes)
		    .size([width, - height / 3]);

		force.start();


		circles = svg.selectAll("circle.population")
		    .data(nodes.slice(1));
		circles.enter().append("circle")
		    .attr("r", r)
		    .attr("class", "population");
		circles.style("fill", function(d, i) { return d.has_disease ? "red" : "#00d0a1"; });

		force.on("tick", function(e) {
		  var q = d3.geom.quadtree(nodes),
		      i = 0,
		      n = nodes.length;

		  while (++i < n) q.visit(collide(nodes[i]));

		  svg.selectAll("circle.population")
		      .attr("cx", function(d) { return d.x; })
		      .attr("cy", function(d) { return d.y; });
		});


		function collide(node) {
		  var r = node.radius + 16,
		      nx1 = node.x - r,
		      nx2 = node.x + r,
		      ny1 = node.y - r,
		      ny2 = node.y + r;
		  return function(quad, x1, y1, x2, y2) {
		    if (quad.point && (quad.point !== node)) {
		      var x = node.x - quad.point.x,
		          y = node.y - quad.point.y,
		          l = Math.sqrt(x * x + y * y),
		          r = node.radius + quad.point.radius;
		      if (l < r) {
		        l = (l - r) / l * .5;
		        node.x -= x *= l;
		        node.y -= y *= l;
		        quad.point.x += x;
		        quad.point.y += y;
		      }
		    }
		    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		  };
		}

		return force;
	}



	// prior bar plot
	function priorPlot() {
		// parameters
		var labels = ['P(Healthy)', 'P(Disease)'],
			probs = [0.75, 0.25];

		// set up dimensions of SVG
		var margin = {top: 10, right: 10, bottom: 20, left: 10},
		  width = 300 - margin.left - margin.right,
		  height = 150 - margin.top - margin.bottom;

		// create SVG
		var svg = d3.select("#bayes_prior").append("svg")
		    .attr("width", "100%")
		    .attr("height", "100%")
		    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
		    .attr("preserveAspectRatio", "xMidYMid meet")
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// scales
		var x = d3.scale.ordinal()
			.domain([0,1])
			.rangeRoundBands([0, width], .5);
		var y = d3.scale.linear()
		    .domain([0,1])
		    .range([height, 0]);

		// axes
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .tickFormat(function (d) { return labels[d]});

		// graph
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		// drag function
		var drag = d3.behavior.drag()
			.origin(function() { 
				return {x: 0, y: d3.select(this).attr("y")};
			})
			.on('drag', function(d,i) {
				var val = Math.max(0, Math.min(y.invert(d3.event.y),1));
				tip.show(val, this)
				probs[i] = val
				probs[1 - i % 2] = 1 - val
				update(probs, 0)
				reset()
				p = probs[1];
				patients = generate_patients(n, p, p_d, p_h)
				table()
			})
			.on("dragend", function(d,i){
				force = generate_population(100, p)
			})

		// tool tip
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d,i) { return round(d,2); });

		// draw bars
		function update(data, time) {
			// JOIN new data with old elements.
			var rects = svg.selectAll("rect")
				.data(data);

			// ENTER new elements present in new data.
			rects.enter().append("rect")
				.attr('x', function(d,i){ return x(i); })
			    .attr('width', x.rangeBand())
			    .attr("class", function(d, i) { return (!i ? "healthy" : "disease"); })
			    .on("mouseover", function(d) { tip.show(d, this); })
				.on("mouseout", tip.hide)
				.on('mouseup', tip.hide)
				.call(drag);

			// UPDATE old elements present in new data.
			rects.transition().duration(time)
				.attr('y', function(d,i){ return y(d); })
				.attr('height', function(d,i){ return y(1-d); });

			// EXIT old elements not present in new data.
			rects.exit()
				.remove();

			// Pull axis up
			svg.select(".axis").moveToFront()

		}

		// setup
		update(probs, 0);
		svg.call(tip);
	}

	// likelihood bar plot
	function likelihoodPlot() {
		// parmeters
		var labels = ['P(-|H)', 'P(+|H)', 'P(-|D)', 'P(+|D)'],
			probs = [0.75, 0.25, 0.25, 0.75];

		// set up dimensions of SVG
		var margin = {top: 10, right: 10, bottom: 20, left: 10},
		  width = 300 - margin.left - margin.right,
		  height = 150 - margin.top - margin.bottom;

		// create SVG
		var svg = d3.select("#bayes_likelihood").append("svg")
		    .attr("width", "100%")
		    .attr("height", "100%")
		    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
		    .attr("preserveAspectRatio", "xMidYMid meet")
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		// scales
		var x = d3.scale.ordinal()
			.domain([0,1,2,3])
			.rangeRoundBands([0, width], .5);
		var y = d3.scale.linear()
		    .domain([0,1])
		    .range([height, 0]);

		// axes
		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")
		    .tickFormat(function (d) { return labels[d]});

		// graph
		svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

		// drag function
		var drag = d3.behavior.drag()
			.origin(function() { 
				return { x: 0, y: d3.select(this).attr("y") };
			})
			.on('drag', function(d, i) {
				var val = Math.max(0, Math.min(y.invert(d3.event.y),1));
				tip.show(val, this);
				probs[i] = val;
				probs[2 * Math.floor(i / 2) + 1 - (i % 2)] = 1 - val;
				update(probs, 0);
				reset();
				p_h = probs[1];
				p_d = probs[3];
				draw_slider([p_h, p_d]);
				patients = generate_patients(n, p, p_d, p_h)
				table();
			})

		// tool tip
		var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d,i) { return round(d, 2); });

		// draw bars
		function update(data, time) {
			// JOIN new data with old elements.
			var rects = svg.selectAll("rect")
				.data(data);

			// ENTER new elements present in new data.
			rects.enter().append("rect")
				.attr('x', function(d,i){ return x(i); })
			    .attr('width', x.rangeBand())
			    .attr("class", function(d, i) { return (i < 2 ? "healthy" : "disease"); })
			    .on("mouseover", function(d) { tip.show(d, this); })
				.on("mouseout", tip.hide)
				.on('mouseup', tip.hide)
				.call(drag);

			// UPDATE old elements present in new data.
			rects.transition().duration(time)
				.attr('y', function(d,i){ return y(d); })
				.attr('height', function(d,i){ return y(1-d); });

			// EXIT old elements not present in new data.
			rects.exit()
				.remove();

			// Pull axis back
			svg.select(".axis").moveToFront()

		}

		// setup
		update(probs, 0);
		svg.call(tip);
	}

	// update marginal and posterior table
	function table() {
		// compute marginal
		pos = (1 - p) * p_h + (p) * p_d;
		neg = 1 - pos;
		$("#neg").html(round(neg, 2));
		$("#pos").html(round(pos, 2));
		// compute posterior
		$("#h_n").html(round((1 - p) * (1 - p_h) / neg, 2));
		$("#h_p").html(round((1 - p) * p_h / pos, 2));
		$("#d_n").html(round(p * (1 - p_d) / neg, 2));
		$("#d_p").html(round(p * p_d / pos, 2));
	}

	// highlight subset of patients with opacity and stroke
	function highlight(opacity, stroke) {
		// reset all patients
		svg.selectAll("circle.patient")
			.style("fill-opacity", "2")
			.style("stroke-width", "0");
		// opacity
		svg.selectAll("circle.patient." + opacity)
			.style("fill-opacity", "0.2");
		// stroke
		svg.selectAll("circle.patient." + stroke)
			.style("stroke-width", "2");
	}

	// reset sampling
	function reset() {
		m = 0
		drop([]);
	}


	// bind button functionality
	$('#test_one').on("click", function(){
		m = Math.min(m + 1, n)
		force.start()
		add(false, 400)
	});
	$('#test_rest').on("click", function(){
		m = n
		force.start()
		add(false, 10000 / n)
	});
	$('#reset').on("click", reset)

	$('#sort').on("click", function(){
		add(true, 2000)
	});
	$('#unsort').on("click", function(){
		add(false, 2000)
	});

	// add event listeners to marginal table
	$('#marginal').on("mouseover", function(event) {
		var cell = event.target.id;
		if (cell == "neg")		highlight("positive", "none");
		else if (cell == "pos")	highlight("negative", "none");
		else 					highlight("none", "none");
	})
	$('#marginal').on("mouseleave", function(event) {
		highlight("none", "none");
	})

	// add event listeners to posterior table
	$('#posterior').on("mouseover", function(event) {
		var cell = event.target.id;
		if (cell == "h_n") 		highlight("positive", "negative.healthy");
		else if (cell == "h_p") highlight("negative", "positive.healthy");
		else if (cell == "d_n") highlight("positive", "negative.disease");
		else if (cell == "d_p") highlight("negative", "positive.disease");
		else 					highlight("none", "none");
	})
	$('#posterior').on("mouseleave", function(event) {
		highlight("none", "none");
	})


	// Setup Bayes Visualization
	// generate population and patients
	var patients = generate_patients(n, p, p_d, p_h),
		force = generate_population(100, p);
	// draw bar plots
	priorPlot();
	likelihoodPlot();
	// compute tables
	table();
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
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
	    .attr("preserveAspectRatio", "xMidYMid meet")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




	// Slider
	function create_slider(slide) {
		var x = d3.scale.linear()
		    .domain([0, 1])
		    .range([0, width])
		    .clamp(true);

		var drag = d3.behavior.drag()
			.on('drag', function(d, i) {
				var val = x.invert(d3.event.x);
				handle.attr("cx", x(val));
				slide(val)
			});

		var slider = svg.append("g")
		    .attr("class", "range")
		    .attr("transform", "translate(" + 0 + "," + (height + margin.bottom / 2) + ")");

		slider.append("line")
		    .attr("class", "track")
		    .attr("x1", x.range()[0])
		    .attr("x2", x.range()[1])
		  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		    .attr("class", "track-inset")
		  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
		    .attr("class", "track-overlay")
		    .call(drag);

		slider.insert("g", ".track-overlay")
		    .attr("class", "ticks")
		    .attr("transform", "translate(0," + 18 + ")")
		  .selectAll("text")
		  .data(x.ticks(10))
		  .enter().append("text")
		    .attr("x", x)
		    .attr("text-anchor", "middle")
		    .text(function(d) { return d; });

		var handle = slider.insert("circle", ".track-overlay")
		    .attr("class", "handle")
		    .attr("r", 9);
	}
	// slide function
	function slide(val) {
		var p = view[0] + val * (view[1] - view[0]);
		if (dist == "") return
		var parameters = param.slice()
		if (dist == "uniform" || dist == "binomialDiscrete") 	parameters[1] = p;
		else 													parameters[0] = p;
		var data = density(dist, parameters, view);
		draw_distribution(data, 0, x, y2, "density", "#view_y2");
		drop(parameters, p);
	}
	create_slider(slide);





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
	svg.call(draw_bar, h2, "density p(x | \u03B8)");
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
		$("#parameter").val(view[0]);
	    samples = sample(dist, param, 0);
	}

	// set slider view
	function setview(range) {
		// Change slider min, max and step
		$("#parameter").attr({
			'max': range[1],
			'min': range[0],
			'step': (range[1] - range[0]) / 100
		});
		// Apply setValue to redraw slider
		$("#parameter").val(range[0]);
		// Refresh slider
		//$("#parameter").slider('refresh');
		// set x domain
		x.domain(range);
	}

	// handle distribution change
	$("#dist").on('change', function() {
	    dist = $(this).val();
	    param = initial_parameters[dist];
	    var data;
	    if (dist == "") {
	      reset();
	      dist = null;
	      data = [];
	    } else {
	      view = view_parameters[dist];
	      setview(view);
	      data = density(dist, param, view);
	    }
	    draw_distribution(data, 0, x, y1, "sampling", "#view_y1");
	    reset();
	});

	// update sample size
	$("#sample_size").on("input", function() {
		n = $(this).val();
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
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
	    .attr("preserveAspectRatio", "xMidYMid meet")
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
		beta = 1
		,
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
		  .attr("y2", y(2 * y.domain()[1]));//y.range()[1]);

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
			img = (num < p) ? "url(../img/head.png)" : "url(../img/tail.png)";
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
	$("#p").on("input", function() {
	  p = parseFloat($(this).val());
	  d3.select("#p-value").text(round(p, 2));
	  reset();
	});

	// update alpha
	$("#alpha").on("input", function() {
	  alpha = parseFloat($(this).val());
	  d3.select("#alpha-value").text(round(alpha, 2));
	  reset();
	});

	// update beta
	$("#beta").on("input", function() {
	  beta = parseFloat($("#beta").val());
	  d3.select("#beta-value").text(round(beta, 2));
	  reset();
	});

	// setup
	update(0);
}
