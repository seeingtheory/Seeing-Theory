//Handles functionality of Statistical Inference

// load visualizations
$( window ).load(function() {
  estimation();
  confidence();
  bootstrapping();
});

//*******************************************************************************//
//Estimator
//*******************************************************************************//
function estimation() {
	var m = 0,
		n = 0,
		width = 500,
		height = 500;

	var chart = d3.select("#estSvg")
	       .append("canvas")
	       .attr("width", width)
	       .attr("height", height);

	var context = chart.node().getContext("2d");

	function drawCanvas() {
	  context.strokeStyle = "#DDD";
	  context.lineWidth = 3;
	  context.rect(0,0,width,height);
	  context.stroke();
	  context.beginPath();
	  context.fillStyle = "rgba(245,216,0,0.3)";
	  context.arc(width/2,height/2,width/2,0,2*Math.PI);
	  context.fill();
	  context.closePath();
	}

	drawCanvas();

	function drawCircle(){
	 var x = Math.random()*width;
	 var y = Math.random()*height;
	 var r = 2;
	 context.globalCompositeOperation='destination-over';
	 context.beginPath();
	 context.fillStyle = "rgba(255,139,34,1)";
	 context.arc(x,y,r,0,2*Math.PI);
	 context.fill();
	 context.closePath();
	 countPoint(x,y);
	}

	//Compute observed and expected
	function countPoint(x,y) {
	 n += 1;
	 var xCircle = width/2.0;
	 var yCircle = height/2.0;
	 var rCircle = width/2.0;
	 if (Math.pow(x-xCircle, 2)+Math.pow(y-yCircle, 2) <= Math.pow(rCircle, 2)){
	   m += 1;
	 };
	 var currentEstimate = 4.0*m/Math.max(1,n)
	 $("#m").html(m);
	 $("#n").html(n);
	 $("#pi").html(round(currentEstimate,4));
	}

	// 100 samples
	$('#dropHundred').click(function() {
	 var c = 0;
	 var timeout = setInterval(function() {
	   drawCircle();
	   c++;
	   if (c == 100) {
	     clearInterval(timeout);
	   }
	 }, 10);
	});
	
	// 1000 samples
	$('#dropThousand').click(function() {
	 var c = 0;
	 var timeout = setInterval(function() {
	   drawCircle();
	   c++;
	   if (c == 1000) {
	     clearInterval(timeout);
	   }
	 }, 1);
	});
}


//*******************************************************************************//
// confidence interval
//*******************************************************************************//

function confidence() {
  // define width, height, margin
  var margin = {top: 15, right: 5, bottom: 15, left: 5};
  var width = 800;
      height = 600;

  // constants
  var dt = 600,
      n = 5,
      num = 15,
      alpha = 0.10,
      mu = 0,
      y1 = height / 4,
      y2 = height / 5,
      counts = [0, 0],
      curr_dist_ci = null,
      interval_clt,
      curr_view_ci,
      curr_param_ci;

  // create svg
  var svg_ci = d3.select("#svg_ci").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // scales
  var x_scale_clt = d3.scale.linear().domain([-6, 6]).range([0, width]);
  var y_scale_clt = d3.scale.linear().domain([0, 1]).range([0, y1]);

  // draw horizontal bar
  function draw_bar(selection, dy, label) {
    // group
    var axis = selection.append("g").attr("class", "axis");
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
  svg_ci.call(draw_bar, y1, "sample");
  svg_ci.call(draw_bar, y1+y2, "estimate");


  // get pdf data
  function pdf_data_ci(start, end) {
    mu = jStat[curr_dist_ci].mean.apply(null, curr_param_ci);
    var datum = d3.range(start, end, 0.01).map(function(x) {
        var param = [x].concat(curr_param_ci);
        return [x, jStat[curr_dist_ci].pdf.apply(null, param)]; 
    })
    return datum;
  }

  // path and area elements
  var sampling_path = svg_ci.append("path").attr("class", "pdf"),
      sampling_area = svg_ci.append("path").attr("class", "pdf_area"),
      mu_group  = svg_ci.append("g").attr("opacity", 0);

  // add mu line and label
  mu_group.append("line")
    .attr("class", "mu")
    .attr("y1", 10)
    .attr("y2", height);
  mu_group.append("text")
    .html("&mu;")
    .attr("x", -4);

  // Update sampling distribution
  function draw_sampling(datum, dur) {
    // path function
    var line = d3.svg.line()
      .x(function(d) { return x_scale_clt(d[0])})
      .y(function(d) { return y1 - y_scale_clt(d[1])})
      .interpolate("basis");
    // area function
    var area = d3.svg.area()
      .x(function(d) { return x_scale_clt(d[0])})
      .y0(y1)
      .y1(function(d) { return y1 - y_scale_clt(d[1])})
      .interpolate("basis");
    // transition pdf path
    svg_ci.selectAll("path.pdf")
            .datum(datum)
            .transition()
            .duration(dur)
            .attr("d", line);
    // transition pdf path
    svg_ci.selectAll("path.pdf_area")
            .datum(datum)
            .transition()
            .duration(dur)
            .attr("d", area);
    // transition mu group
    mu_group.transition()
            .duration(dur)
            .attr("transform", "translate(" + x_scale_clt(mu) + ")")
            .attr("opacity", 1);
  }

  // Creates Circles and transitions
  function tick() {
    // make sure dist is not null
    if (curr_dist_ci == null) return;
    // take samples
    var data = [];
    for (var i = 0; i < n; i++) {
      data.push(jStat[curr_dist_ci].sample.apply(null, curr_param_ci));
    };
    // calculate statistics
    var mean = d3.mean(data),
        sd = d3.deviation(data),
        ci = jStat.tci(mean, alpha, sd, n);
    // add balls
    var group = svg_ci.append("g").attr("class", "ball-group"),
        balls = group.selectAll(".ball").data(data);
    // animate balls
    var i = 0, j = 0;
    balls.enter()
      .append("circle")
      .attr("class", "ball")
      .attr("cx", function(d) { return x_scale_clt(d); })
      .attr("cy", y1)
      .attr("r", 5)
      .style("fill", "#FF8B22")
      .transition()
      .duration(dt/2)
      .attr("cy", y1 + y2 - 5)
      .each(function() { ++i; })
      .each("end", function() {
        if (!--i) {
          group
            .append("line")
            .attr("class", "ci")
            .attr("x1", x_scale_clt(mean))
            .attr("x2", x_scale_clt(mean))
            .attr("y1", y1 + y2 - 5)
            .attr("y2", y1 + y2 - 5)
            .attr("stroke", function() {
              var stroke;
              if ((ci[0]<= mu) && (mu <= ci[1])) {
                counts[0] += 1;
                stroke = "#46C8B2";
              } else {
                counts[1] += 1;
                stroke = "#FF8686";
              };
              update_rect_ci();
              return stroke;
            })
            .transition()
            .duration(dt/2)
            .attr("x1", x_scale_clt(ci[0]))
            .attr("x2", x_scale_clt(ci[1]))
            .transition()
            .ease("linear")
            .duration(dt*num)
            .attr("y1", height)
            .attr("y2", height)
            .each("end", function() {
              d3.select(this).remove();
            });
          balls
            .transition()
            .duration(dt/2)
            .attr("cx", x_scale_clt(mean))
            .style("fill", function() {
              if ((ci[0]<= mu) && (mu <= ci[1]))  return "#46C8B2";
              else                                return "#FF8686";
            })
            .transition()
            .duration(dt*num)
            .ease("linear")
            .attr("cy", height)
            .each("end", function() {
              d3.select(this).remove();
            });
        };
      });
  }


  // update sample size
  $("#samplesize").on("input", function() {
    reset_ci();
    n = $(this).val();
    $("#samplesize-value").html(n);
  });

  // update alpha level
  $("#alpha").on("input", function() {
    reset_ci();
    alpha = 1 - $(this).val();
    $("#alpha-value").html(round(1 - alpha, 2));
  });

  // start buttons
  $('#startCI').on('click', function() {
    if (curr_dist_ci != null) {
      interval_clt = setInterval(function() { 
        tick();
      }, dt);
    $('.sample_btn').toggle();
    }
  });

  // stop buttons
  $('#stopCI').on('click', function() {
    clearInterval(interval_clt);
    d3.timer.flush();
    $('.sample_btn').toggle();
  });

  // reset sampling
  function reset_ci() {
    svg_ci.selectAll("g.ball-group").remove();
    counts = [0, 0];
    update_rect_ci();
  }

  var view_parameters = {'uniform':[-6,6], 
                          'normal':[-6,6], 
                          'studentt':[-6,6], 
                          'chisquare':[-1,11], 
                          'exponential':[-1,5], 
                          'centralF':[-1,5], 
                          '': []},
      initial_parameters = {'uniform':[-5,5], 
                            'normal':[0,1], 
                            'studentt':[5], 
                            'chisquare':[5], 
                            'exponential':[1], 
                            'centralF':[5,5], 
                            '': []};


  //Draw Distribution
  $('#dist_ci').on('change', function(){
      curr_dist_ci = $(this).find("option:selected").prop('value');
      curr_param_ci = initial_parameters[curr_dist_ci];
      curr_view_ci = view_parameters[curr_dist_ci];
      x_scale_clt.domain(curr_view_ci);
      var data = pdf_data_ci(curr_view_ci[0], curr_view_ci[1]);
      draw_sampling(data, 100);
      reset_ci();
  });


  // constants CI sampling svg
  var w_ci = 350,
      h_ci = 200,
      p_ci = 30;

  // tool Tip
  var tip_ci = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var n = counts[0] + counts[1]; 
      return d + "/" + n + " = " +round(d/n, 2); 
    });

  // create SVG and SVG elements
  var svg_ci_sample = d3.select("#ciDist")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + w_ci + " " + h_ci)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .call(tip_ci);

  // create container
  var container = svg_ci_sample.append("g").attr("transform", "translate(" + p_ci + "," + p_ci + ")");

  // scales
  var label = ["Contains \u03BC","Excludes \u03BC"],
      x_scale_ci = d3.scale.ordinal().domain(label).rangeRoundBands([0, w_ci - 2*p_ci], .5),
      y_scale_ci = d3.scale.linear().domain([0,1]).range([h_ci - 2*p_ci, 0]);

  // x axis
  var x_axis_ci = d3.svg.axis().scale(x_scale_ci).orient("bottom").ticks(0);
  svg_ci_sample.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(" + p_ci + "," + (h_ci - p_ci) + ")")
    .call(x_axis_ci);

  // y axis
  var y_axis_ci = d3.svg.axis().scale(y_scale_ci).orient("left").ticks(3);
  svg_ci_sample.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + p_ci + "," + p_ci + ")")
    .call(y_axis_ci);

  // update rectangles
  function update_rect_ci() {
    var n = Math.max(counts[0] + counts[1], 1);
    // bind rects
    rects = container.selectAll("rect").data(counts);
    // add rects
    rects.enter().append("rect")
        .attr("x",function(d,i) { return x_scale_ci(label[i]); })
        .attr("width", x_scale_ci.rangeBand())
        .attr("fill", function(d,i) { return i ? "#FF8686" : "#46C8B2"; })
        .attr("opacity", 0.75)
        .on('mouseover', function(d){ tip_ci.show(d,this); })
        .on('mouseout', tip_ci.hide);
    // update rects
    container.selectAll("rect").transition()
        .attr("y",function(d,i) {return y_scale_ci(d/n); })
        .attr("height",function(d,i) {return y_scale_ci(1 - d/n); });
  }
}

//*******************************************************************************//
// Bootstrapping
//*******************************************************************************//
function bootstrapping() {

	// 1: Set up dimensions of SVG
	var margin = {top: 60, right: 20, bottom: 60, left: 20},
		width = 700 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// 2: Create SVG
	var svg = d3.select("#bootstrapping").append("svg")
	    .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .attr("preserveAspectRatio", "xMidYMid meet")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// constants
	var dt = 400,
	    n = 10,
	    draws = 1,
	    dist = null,
	    param = [],
	    y1 = height / 3,
	    y2 = height / 2,
	    y3 = 2 * height / 3,
	    y4 = height,
	    bins = 50,
      	counts = [],
      	samples = [];


	// scales
	var x = d3.scale.linear()
		.domain([-6, 6])
		.range([0, width]);
	var y = d3.scale.linear()
		.domain([0, 1])
		.range([y1, 0]);
	var z = d3.scale.linear()
		.domain([0, 1])
		.range([y4, y3 + 10]);


	// clip path
	var clip_clt = svg.append("clipPath")
    .attr("id", "view")
    .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", y1);

	// draw horizontal bar
	function draw_bar(selection, dy, label) {
	  // group
	  var axis = selection.append("g")
	  	.attr("class", "axis");
	  // bar
	  axis.append("line")
	    .attr("x1", x(-6))
	    .attr("x2", x(6))
	    .attr("y1", dy)
	    .attr("y2", dy);
	  // label
	  axis.append("text")
	    .attr("x", x(-6))
	    .attr("y", dy)
	    .attr("dy", "1em")
	    .text(label);
	};
	// create three bars
	svg.call(draw_bar, y1, "distribution");
	svg.call(draw_bar, y2, "sample");
	svg.call(draw_bar, y3, "resample + average");
	svg.call(draw_bar, y4, "count");


  var bars = svg.append("g").attr("class", "histogram");
	function draw_histogram() {
    // create histogram
    var histogram = d3.layout.histogram().bins(x.ticks(bins)).frequency(false);
	  // get histrogram of counts
	  var data = histogram(counts);
	  // update scale
	  var ymax = d3.max(data.map(function(d) { return d.y; }));
	  z.domain([0, ymax*bins]);
	  // enter bars
	  var bar = bars.selectAll("g").data(data);
	  var barEnter = bar.enter().append("g").attr("class", "bar");
	  barEnter.append("rect");
	  barEnter.append("text")
	    .attr("y", y4 - 15)
	    .attr("text-anchor", "middle");
	  // update bars
	  bar.select("rect")
	    .attr("x", function(d) { return x(d.x) + 1; })
	    .attr("width", function(d) { return x(d.dx - Math.abs(x.domain()[0])) - 1; })
	  .transition().duration(250)
	    .attr("y", function(d) { return z(d.y*bins); })
	    .attr("height", function(d) { return y4 - z(d.y*bins); });
	  bar.select("text")
	    .attr("x", function(d) { return x(d.x + d.dx / 2); })
	    .text(function(d) { return d.y > 0 ? d3.format("%")(d.y) : ""; });
	  // exit bars
	  bar.exit().remove();
	};

	// get pdf data
	function pdf_data(start, end) {
	  mu = jStat[dist].mean.apply(null, param);
	  var datum = d3.range(start, end, 0.01).map(function(x) {
	      var params = [x].concat(param);
	      return [x, jStat[dist].pdf.apply(null, params)]; 
	  })
	  return datum;
	}

	// add mu line and label
	var mu_group = svg.append("g")
    .attr("opacity", 0);
	mu_group.append("line")
	  .attr("class", "mu")
	  .attr("y1", 10)
	  .attr("y2", height);
	mu_group.append("text")
	  .html("&mu;")
	  .attr("x", -4);

	// Update sampling distribution
	function draw_sampling(datum, dur) {

	  // path function
	  var line = d3.svg.line()
	    .x(function(d) { return x(d[0]); })
	    .y(function(d) { return y(d[1]); })
	    .interpolate("basis");

	  // area function
	  var area = d3.svg.area()
	    .x(function(d) { return x(d[0]); })
	    .y0(y1)
	    .y1(function(d) { return y(d[1]); })
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

	  // transition pdf area
	  var pdf_area = svg.selectAll("path.pdf_area")
	  	.data([datum]);
	  pdf_area.enter().append("path")
	  	.attr("class", "pdf_area")
      .attr("clip-path", "url(#view)");
	  pdf_area.transition()
	  	.duration(dur)
	    .attr("d", area);

	  // transition mu group
	  mu_group.transition()
	      .duration(dur)
	      .attr("transform", "translate(" + x(mu) + ")")
	      .attr("opacity", 1);
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

	// Creates Circles and transitions
	function resample() {
	  // make sure there are samples
	  if (!samples.length) return;
	  // take samples
	  var data = [];
	  for (var i = 0; i < n; i++) {
	    data.push(samples[Math.floor(n * Math.random())]);
	  };
	  // calculate statistics
	  var mean = d3.mean(data);
	  // add balls
	  var group = svg.append("g").attr("class", "ball-group"),
	      balls = group.selectAll(".resample").data(data);
	  // animate balls
	  var i = 0, j = 0;
	  balls.enter()
	    .append("circle")
      .transition()
      .delay(function(d, i) { return i * dt / samples.length; })
	    .attr("class", "resample")
	    .attr("cx", function(d) { return x(d); })
	    .attr("cy", y2)
	    .attr("r", 5)
	    .transition()
	    .duration(dt)
	    .attr("cy", y3 - 3)
	    .each(function() { ++i; })
	    .each("end", function() {
        if (!--i) {
          balls
            .transition()
            .duration(dt)
            .attr("cx", x(mean))
            .style("fill", "#F5D800")
            .transition()
            .duration(dt)
            .attr("cy", y4-3)
            .attr("r", 3)
            .each(function() { ++j; })
            .each("end", function() {
              if (!--j) {
                counts.push(mean);
                draw_histogram();
              }
              d3.select(this).remove();
            });
        };
      });
	}


	// update sample size
	$("#sample_size").on("input", function() {
		reset();
		n = $(this).val();
		$("#sample_size-value").html(n);
	});

	// reset sampling
	function reset() {
	    sample(0);
		svg.selectAll("g.ball-group").remove();
	    svg.selectAll("g.histogram g").remove();
	    samples = [];
	    counts = [];
	}

	// distribution parameters
	var view_parameters = {'uniform':[-6,6], 
	                        'normal':[-6,6], 
	                        'studentt':[-6,6], 
	                        'chisquare':[-1,11], 
	                        'exponential':[-1,5], 
	                        'centralF':[-1,5], 
	                        '': []};

	var initial_parameters = {'uniform':[-5,5], 
	                          'normal':[0,1], 
	                          'studentt':[5], 
	                          'chisquare':[5], 
	                          'exponential':[1], 
	                          'centralF':[5,5], 
	                          '': []};
	// handle distribution change
	$('#dist').on('change', function(){
	    dist = $(this).find("option:selected").prop('value');
	    param = initial_parameters[dist];
      view = view_parameters[dist];
      x.domain(view);
      var data = pdf_data(view[0], view[1]);
	    draw_sampling(data, 100);
	    reset();
	});

	// start buttons
	$('#sample').on('click', function() {
		reset();
		samples = sample(n);
	});
	// start buttons
	$('#resample').on('click', function() {
		resample();
	});
  	// start buttons
	$('#resample_100').on('click', function() {
		var t = dt / 100,
			count = 0,
			interval = setInterval(function() { 
			resample();
			  if (++count === 100){
			    clearInterval(interval);
			  }
		}, t);
	});
	
	return {'setup': null, 'resize': null, 'reset': null, 'update': null};
};
