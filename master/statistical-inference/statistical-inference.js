//Handles functionality of Statistical Inference

// load visualizations
$( window ).load(function() {
  $('#myModal').modal('show');
});

// window resize
$(window).on("resize", function () {

});

//*******************************************************************************//
//confidence intervals
//*******************************************************************************//
// define width, height, margin
var margin = {top: 15, right: 5, bottom: 15, left: 5};
var width = 800;
    height = 600;

// constants
var dt = 600,
    n = 5,
    num = 15,
    alpha = 0.50,
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
svg_ci.call(draw_bar, y1, "draw");
svg_ci.call(draw_bar, y1+y2, "interval");


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
    .style("fill", "#64bdff")
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
              stroke = "#00d0a1";
            } else {
              counts[1] += 1;
              stroke = "#FF1300";
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
            if ((ci[0]<= mu) && (mu <= ci[1]))  return "#00d0a1";
            else                                return "#FF1300";
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
$("#samplesize").on("slide", function(e) {
  reset_ci();
  n = e.value;
  $("#samplesize-value").html(n);
});

// update alpha level
$("#alpha").on("slide", function(e) {
  reset_ci();
  alpha = 1 - e.value;
  $("#alpha-value").html(round(e.value, 2));
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

// handle links
$("#dist_ci a").on('click', function(){
    curr_dist_ci = $(this).attr('value');
    curr_param_ci = initial_parameters[curr_dist_ci];
    var data;
    if (curr_dist_ci == "") {
      reset_pval();
      $('#dist_name_ci').val("");
      curr_dist_ci = null;
      data = [];
    } else {
      $('#dist_name_ci').val($(this).html());
      curr_view_ci = view_parameters[curr_dist_ci];
      x_scale_clt.domain(curr_view_ci);
      data = pdf_data_ci(curr_view_ci[0], curr_view_ci[1]);
    }
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
      .attr("fill", function(d,i) { return i ? "#FF1300" : "#00d0a1"; })
      .attr("opacity", 0.75)
      .on('mouseover', function(d){ tip_ci.show(d,this); })
      .on('mouseout', tip_ci.hide);
  // update rects
  container.selectAll("rect").transition()
      .attr("y",function(d,i) {return y_scale_ci(d/n); })
      .attr("height",function(d,i) {return y_scale_ci(1 - d/n); });
}

//*******************************************************************************//
//p-values
//*******************************************************************************//
// define width, height, margin
var m_pval = {top: 20, right: 10, bottom: 20, left: 10},
    w_pval = 700,
    h_pval = 500;
// create svg
var svg_pval = d3.select("#svg_pval").append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 " + (w_pval + m_pval.left + m_pval.right) + " " + (h_pval + m_pval.top + m_pval.bottom))
  .attr("preserveAspectRatio", "xMidYMid meet")
  .append("g")
  .attr("transform", "translate(" + m_pval.left + "," + m_pval.top + ")");

// constants
var curr_view = [-6,6],
    curr_param = [0,0,1],
    tail = 1,
    curr_dist = null,
    obs_pval = null;

// create scale functions
var x_scale_pval = d3.scale.linear().domain(curr_view).range([0, w_pval]),
    y_scale_pval = d3.scale.linear().domain([0,1]).range([h_pval, 0]);

// define axis
var x_axis_pval = d3.svg.axis().scale(x_scale_pval).orient("bottom").ticks(5),
    y_axis_pval = d3.svg.axis().scale(y_scale_pval).orient("left").ticks(5);

// create axis
var x_axis_group_pval = svg_pval.append("g").attr("class", "x axis"),
    y_axis_group_pval = svg_pval.append("g").attr("class", "y axis");

// render axis
x_axis_group_pval.attr("transform", "translate(0," + (h_pval) + ")").call(x_axis_pval);
//y_axis_group_pval.attr("transform", "translate(0,0)").call(y_axis_pval);

// clip path
svg_pval.append("clipPath")
        .attr("id", "view")
        .append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("height",h_pval)
        .attr("width",w_pval);

// get pdf data
function pdf_data(start, end) {
  var datum = d3.range(start, end, 0.01).map(function(x) {
      var param = [x].concat(curr_param);
      return [x, jStat[curr_dist].pdf.apply(null, param)]; 
    })
    return datum;
}

// add pdf path
svg_pval.append("path").attr("class", "pval_area").attr("clip-path", "url(#view)");
svg_pval.append("path").attr("class", "pdf").attr("clip-path", "url(#view)")

function draw_pdf(datum, dur) {
  // line function
  var line = d3.svg.line()
      .x(function(d) { return x_scale_pval(d[0])})
      .y(function(d) { return y_scale_pval(d[1])})
      .interpolate("linear");
  // transition pdf path
  svg_pval.selectAll("path.pdf")
          .datum(datum)
          .transition()
          .duration(dur)
          .attr("d", line);
  // trigger obs
  draw_obs(obs_pval, dur);
}

function draw_obs(obs, dur) {
  if (obs == null) return;
  // get data
  var datum = pdf_data(curr_view[0], curr_view[1]);
  // area function
  var area = d3.svg.area()
      .x(function(d) { return x_scale_pval(d[0])})
      .y0(y_scale_pval(0))
      .y1(function(d) { return y_scale_pval(d[1])})
      .defined(function(d) { 
        if (tail == 1)  return !(d[0] < obs);
        else            return !((-1 * obs < d[0]) && (d[0] < obs)); 
      })
      .interpolate("linear");
  // transition pdf area
  svg_pval.selectAll("path.pval_area")
          .datum(datum)
          .transition()
          .duration(dur)
          .attr("d", area);
  // update text
  var param = [obs].concat(curr_param);
  var p = 1 - jStat[curr_dist].cdf.apply(null, param);
  if (tail == 2) {
    param[0] = -1 * obs;
    p = p + jStat[curr_dist].cdf.apply(null, param);
  }
  $("#p_value").html(round(p,4));
}

// handle radio buttons
$("#observation").change(function(e) {
  obs_pval = +$(this).val(),
  draw_obs(obs_pval, 0);
})

var dists = ['uniform', 'normal', 'studentt', 'chisquare', 'exponential', 'centralF', 'gamma', 'beta', ''],
    initial_parameters = {'uniform':[-5,5], 
                          'normal':[0,1], 
                          'studentt':[5], 
                          'chisquare':[5], 
                          'exponential':[1], 
                          'centralF':[5,5], 
                          'gamma': [1,1], 
                          'beta': [1,1],
                          '': []};

// handle links
$("#distribution a").on('click', function(){
    $("#error_pval").hide();
    curr_dist = $(this).attr('value');
    curr_param = initial_parameters[curr_dist];
    if (curr_dist == "") {
      reset_pval();
      $('#dist_name').val(curr_dist);
    } else {
      $('#dist_name').val(curr_dist + " (" + curr_param + ")");
      var data = pdf_data(curr_view[0], curr_view[1]);
      draw_pdf(data, 100);
    }
});

// handle manual input of text
$('#dist_name').change(function() {
  $(this).blur();
  var text = $('#dist_name').val(),
      regex = /(\w+) \(([-+]?[0-9]*\.?[0-9]+),*([-+]?[0-9]*\.?[0-9]+)*\)/i,
      found = text.match(regex);
  if ((found != null) && (dists.indexOf(found[1]) != -1)) {
    $("#error_pval").hide();
    curr_dist = found[1];
    curr_param = [+found[2], +found[3]];
    var data = pdf_data(curr_view[0], curr_view[1]);
    draw_pdf(data, 100);
  } else {
    reset_pval();
    $("#error_pval").show();
  }
});

// Handle radio buttons
$('#tail_pval').change(function(e){
    // update tail
    tail = +$('input[name = "tail"]:checked').val();
    // trigger obs
    draw_obs(obs_pval, 0);
});

// reset distribution
function reset_pval() {
  draw_pdf([], 0);
  draw_obs(null, 0);
}

//*******************************************************************************//
//hypothesis testing
//*******************************************************************************//

// define width, height, margin
var m_ht = {top: 20, right: 5, bottom: 20, left: 5};
var w_ht = 800;
    h_ht = 500;

// constants
var delta_ht = 1000,
    y_ht = h_ht / 3,
    view_ht = [-7,7],
    z_crit_ht = 0,
    param_h0 = [0,1],
    param_h1 = [0,1],
    curr_param_ht = 0,
    counts_ht = [0,0],
    color_ht = "#64bdff",
    interval_ht;

// tool Tip
var tip_ht = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    var n = Math.max(1, counts_ht[0] + counts_ht[1]); 
    return d + "/" + n + " = " +round(d/n, 2); 
  });

// create svg
var svg_ht = d3.select("#svg_ht").append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 " + (w_ht + m_ht.left + m_ht.right) + " " + (h_ht + m_ht.top + m_ht.bottom))
  .attr("preserveAspectRatio", "xMidYMid meet")
  .call(tip_ht)
  .append("g")
  .attr("transform", "translate(" + m_ht.left + "," + m_ht.top + ")");

// scales
var x_scale_ht = d3.scale.linear().domain(view_ht).range([0, w_ht]),
    y_scale_ht = d3.scale.linear().domain([0, 1]).range([0, y_ht]),
    label_ht = ["accept null", "reject null"],
    z_scale_ht = d3.scale.ordinal().domain(label_ht).rangeRoundBands([0, w_ht], .75);

// draw horizontal bar
function draw_bar_ht(selection, dy, label) {
  // group
  var axis = selection.append("g").attr("class", "axis");
  // bar
  axis.append("line")
    .attr("x1", 0)
    .attr("x2", w_ht)
    .attr("y1", dy)
    .attr("y2", dy);
  // label
  axis.append("text")
    .attr("x", 0)
    .attr("y", dy)
    .attr("dy", "1em")
    .text(label);
};
// create two bars
svg_ht.call(draw_bar_ht, y_ht, "hypotheses");
svg_ht.call(draw_bar_ht, y_ht*5/3, "rejection region");

// count axis
var z_axis_ht = d3.svg.axis().scale(z_scale_ht)
  .orient("bottom")
  .outerTickSize(0);
svg_ht.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + 0 + "," + y_ht*3 + ")")
  .call(z_axis_ht);


// get pdf data
function pdf_data_ht(view, parameters) {
  var start = view[0],
      end = view[1],
      datum = d3.range(start, end, 0.01).map(function(x) {
        var param = [x].concat(parameters);
        return [x, jStat.normal.pdf.apply(null, param)]; 
      })
  return datum;
}

// top clip path
svg_ht.append("clipPath")
  .attr("id", "top_ht")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", w_ht)
  .attr("height", y_ht);

// path and area elements
var paths_ht = svg_ht.append("g").attr("clip-path", "url(#top_ht)");
paths_ht.append("path").attr("class", "h1 pdf");
paths_ht.append("path").attr("class", "h0 pdf");

// Update null hypothesis
function draw_dist_ht(datum_h0, datum_h1, dur) {
  // path function
  var line = d3.svg.line()
    .x(function(d) { return x_scale_ht(d[0])})
    .y(function(d) { return y_ht - y_scale_ht(d[1])})
    .interpolate("basis");
  // transition pdf path
  svg_ht.selectAll("path.h0.pdf")
          .datum(datum_h0)
          .transition()
          .duration(dur)
          .attr("d", line);
  // transition pdf path
  svg_ht.selectAll("path.h1.pdf")
          .datum(datum_h1)
          .transition()
          .duration(dur)
          .attr("d", line);
}


// drag rejection region function
var drag_rr = d3.behavior.drag()
  .on('drag', function(d,i) {
    z_crit_ht = Math.max(view_ht[0], Math.min(view_ht[1], x_scale_ht.invert(d3.event.x)));
    reset_ht();
    draw_rr_ht();
  }) 

// top clip path
svg_ht.append("clipPath")
  .attr("id", "mid_ht")
  .append("rect")
  .attr("x", 0)
  .attr("y", y_ht)
  .attr("width", w_ht)
  .attr("height", y_ht*5/3);

// add rejection region
var rregion = svg_ht.append("g").attr("clip-path", "url(#mid_ht)");
rregion.append("rect").attr('class', "rr_rect");
rregion.append("line").attr('class', "rr_line").call(drag_rr);
  
// Update null hypothesis
function draw_rr_ht() {
  // transition rect
  rregion.selectAll("rect")
    .attr('x', x_scale_ht(z_crit_ht))
    .attr('y', y_ht)
    .attr('width', x_scale_ht(view_ht[1] - z_crit_ht))
    .attr('height', y_ht*2/3);
  // transition line
  rregion.selectAll("line")
    .attr('x1', x_scale_ht(z_crit_ht))
    .attr('y1', y_ht)
    .attr('x2', x_scale_ht(z_crit_ht))
    .attr('y2', y_ht*5/3);
}


// Creates Circles and transitions
function tick_ht() {
  var parameters = curr_param_ht ? param_h1 : param_h0;
  // take sample
  var data = [jStat.normal.sample.apply(null, parameters)];
  // add ball
  var group = svg_ht.append("g").attr("class", "ball-group"),
      balls = group.selectAll(".ball").data(data);
  // animate balls
  var i = 0, j = 0;
  balls.enter()
    .append("circle")
    .attr("class", "ball")
    .attr("cx", function(d) { return x_scale_ht(d); })
    .attr("cy", y_ht)
    .attr("r", 5)
    .style("fill", color_ht)
    .transition()
    .duration(delta_ht/3)
    .attr("cy", y_ht*5/3 - 5)
    .each(function() { ++i; })
    .each("end", function() {
      if (!--i) {
        balls
          .transition()
          .duration(delta_ht/3)
          .style("fill", function(d) {
            if (d > z_crit_ht)  return "#FF1300";
            else                return "#00d0a1";
          })
          .transition()
          .duration(delta_ht/3)
          .ease("linear")
          .attrTween('transform', function(d) {
            var index = (d > z_crit_ht) ? 1 : 0,
                x0 = x_scale_ht(d),
                x1 = z_scale_ht(label_ht[index]) + z_scale_ht.rangeBand()/2;
            return function(t) { return 'translate(' + (t * (x1 - x0)) + ',' + (t * t * (y_ht)) + ')'; };
          })
          .attr("r", 3)
          .each("end", function(d) {
            d3.select(this).remove();
            if (d > z_crit_ht)  counts_ht[1] += 1;
            else                counts_ht[0] += 1;
            update_rect_ht();
          });
      };
    });
}

var count_bar = svg_ht.append("g");

// update rectangles
function update_rect_ht() {
  var n = Math.max(counts_ht[0] + counts_ht[1], 1);
  // bind rects
  rects = count_bar.selectAll("rect").data(counts_ht);
  // add rects
  rects.enter().append("rect")
      .attr("x",function(d,i) { return z_scale_ht(label_ht[i]); })
      .attr("width", z_scale_ht.rangeBand())
      .attr("fill", function(d,i) { return i ? "#FF1300" : "#00d0a1"; })
      .attr("opacity", 0.75)
      .on('mouseover', function(d){ tip_ht.show(d,this); })
      .on('mouseout', tip_ht.hide);
  // update rects
  count_bar.selectAll("rect").transition()
      .attr("y",function(d,i) {return y_ht*2 + y_scale_ht(1 - d/n); })
      .attr("height",function(d,i) {return y_scale_ht(d/n); })
      .attr("fill", function(d,i) { return i ? "#FF1300" : "#00d0a1"; });
}

// resets count bars
function reset_ht() {
  svg_ht.selectAll("*").interrupt();
  svg_ht.selectAll("g.ball-group").remove();
  counts_ht = [0, 0];
  update_rect_ht();
}

// draw starting distributions
var dh0 = pdf_data_ht(view_ht, param_h0),
    dh1 = pdf_data_ht(view_ht, param_h1);
draw_dist_ht(dh0, dh1, 100);
draw_rr_ht();

// update effect size
$("#effect_size").on("slide", function(e) {
  reset_ht();
  param_h1[0] = e.value;
  var dh0 = pdf_data_ht(view_ht, param_h0),
      dh1 = pdf_data_ht(view_ht, param_h1);
  draw_dist_ht(dh0, dh1, 0);
  $("#effect_size-value").html(round(e.value, 2));
});

// Handle radio buttons
$('#tail_ht').change(function(e){
  reset_ht();
  tail = +$('#tail_ht input[name = "tail"]:checked').val();
});


//Handles table highlighting and clicking
$("#table_ht").delegate('td','click mouseover mouseleave', function(e) {
  var col = $(this).index(),
      curr = $("#table_ht colgroup").eq($(this).index());

  if (col) {
    if(e.type == 'mouseover' && !(curr.hasClass("click_h0") || curr.hasClass("click_h1"))) {
      curr.addClass("hover");
    } else if (e.type == 'click') {
        $("colgroup").removeClass("click_h0 click_h1 hover");
        if (col - 1) {
          svg_ht.selectAll("path.h1").each(function(){ d3.select(this).moveToFront(); });
          curr_param_ht = 1;
          curr.addClass("click_h1");
          color_ht = "#ff9b3c";
        } else {
          svg_ht.selectAll("path.h0").each(function(){ d3.select(this).moveToFront(); });
          curr_param_ht = 0;
          curr.addClass("click_h0");
          color_ht = "#64bdff";
        };
        reset_ht();
    } else {
      curr.removeClass("hover");
    }
  };
});

// start buttons
$('#start_ht').on('click', function() {
  tick_ht();
  interval_ht = setInterval(tick_ht, delta_ht);
  $('.sample_ht').toggle();
});

// stop buttons
$('#stop_ht').on('click', function() {
  clearInterval(interval_ht);
  d3.timer.flush();
  $('.sample_ht').toggle();
});

// To do for Hypothesis Testing:
// 1) Add count bars...
// 2) handle tail radio buttons...
// 3) work on table highlighting functionality...
// 4) writting and clean code and css...
