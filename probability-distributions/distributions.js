//Handles functionality of Distributions
$(window).load(function () {
  random_variable();
  discrete_continuous();
  clt();
});


//*******************************************************************************//
//Random Variable
//*******************************************************************************//
function random_variable() {
  //Adapted from: https://bl.ocks.org/mbostock/5249328
  //              http://bl.ocks.org/mbostock/7833311

  var widthRV = 500,
      heightRV = 400
      radiusRV = 20,
      borderRV = 1,
      possible_colors = ['#FF9B3C', '#00D0A2', '#64BCFF', '#FF4A3C', '#FFFF00', 
		                 '#7272FF', '#55D733', '#1263D2', '#FF0080', '#A1FF00',
		                 '#FF1300', '#03899C', '#FFC500', '#2419B2', '#4169E1']
      colors = possible_colors,
      color_map = {0:"white"};

  var hexbin = d3.hexbin()
      .size([widthRV, heightRV])
      .radius(radiusRV);

  var svgRV = d3.select("#svgRV").append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("viewBox", "0 0 " + widthRV + " " + heightRV)
                    .attr("preserveAspectRatio", "xMidYMid meet");


  svgRV.append("path")
      .attr("class", "mesh")
      .attr("d", hexbin.mesh());

  var hexagon = svgRV.append("g")
      .attr("class", "hexagon")
    .selectAll("path")
      .data(hexbin(hexbin.centers()))
    .enter().append("path")
      .attr("d", hexbin.hexagon(radiusRV - borderRV/2))
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("id", function(d) { d.fixed = 0; d.value = 0; d.fill = 0; return 'bin-' + d.i + '-' + d.j; })
      .on("mousedown", mousedown)
      .on("mousemove", mousemove)
      .on("mouseup", mouseup);

  var mousing = 0;

  function mousedown(d) {
    mousing = d.fill ? -1 : +1;
    mousemove.apply(this, arguments);
  }

  function mousemove(d) {
    if (mousing & (d.fixed == 0)) {
      d.fill = mousing > 0;
      d3.select(this).style("fill", d.fill ? "#c7c7c7" : "white");
    }
  }

  function mouseup() {
    mousemove.apply(this, arguments);
    mousing = 0;
  }

  function addColor(color, value) {
    $('#rvMap').append("<tr class='prob_map'>\
      <td><img class='hexagon' src='./img/hexagon.svg' width='20px' style='background-color:" + color + "'/></td>\
      <td>"+ value +"</td>\
      </tr>");
  }

  function fixColor(color, value) {
    hexagon.each(function(d){
      if (d.fill) {
        d.fill = 0;
        d.value = value;
        d.fixed = 1;
        d3.select(this)
          .style("fill", color)
          .style('stroke', color)
          .style("stroke-width", borderRV);
      }
    });
  }

  //Handle value submit
  $("#rvNewMap").submit(function(e) {
    e.preventDefault();
    if (colors.length) {
      value = parseFloat($("#mapValue").val());
      var color;
      if (color_map[value] == undefined) {
        index = Math.floor(Math.random()*colors.length)
        color = colors.splice(index, 1)[0];
        color_map[value] = color;
        addColor(color, value);
      } else {
        color = color_map[value];
      }
      fixColor(color, value);
    }
    reset_samples();
  });

  //Handles start and stop buttons
  var sample;
  $('.sampleBtns').on('click', function(){
    var button = d3.select(this).attr('id');
    clearInterval(sample);
  	sample = setInterval(function() {
  	        var randomX = Math.random()*widthRV,
  	            randomY = Math.random()*heightRV,
  	            pos = [randomX,randomY]
  	            bin = hexbin([pos]),
  	            hex = d3.select('#bin-' + bin[0].i + '-' + bin[0].j),
  	            color = hex.style('fill'),
  	            value = hex.data()[0].value;
  	        addPoint(pos, color, value);
  	      }, 100);
  })

  function reset_samples() {
  	Values = {};
    total = 0;
    addRect('white', 0);
    clearInterval(sample);
  }

  // Reset button
  $('#resetRV').on('click', function(){
    reset_samples();
    $(".prob_map").remove();
    hexagon.each(function(d){
        d.fill = 0;
        d.value = 0;
        d.fixed = 0;
        d3.select(this)
          .style("fill", "white")
          .style("stroke", "white")
          .style("stroke-width", borderRV);
    });
    colors = possible_colors;
  });


  var Values = {}
      total = 0;
  //Add sample point
  function addPoint(pos, color, value) {
    if (Values[value] == undefined) {
      Values[value] = 1;
      addRect(color, value);
    } else {
      Values[value] += 1;
      updateRect();
    };
    total += 1;
    svgRV.append('circle')
        .attr('cx', pos[0])
        .attr('cy', pos[1])
        .attr('r', 5)
        .style('fill', 'black')
        .attr('opacity', '1')
        .transition()
        .style('fill', color)
        .duration(1000)
        .each('end', function(d){ d3.select(this).remove(); });
  }


  //Tool Tip
  var tipRVD = d3.tip().attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function(d,i) { return round(Values[d] / total, 2); });

  //Constants RV Dist
  var widthRVD = 350,
      heightRVD = 200,
      padRVD = 30;

  //Create SVG and SVG elements
  var svgRVD = d3.select("#rvDist")
                    .append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("viewBox", "0 0 " + widthRVD + " " + heightRVD)
                    .attr("preserveAspectRatio", "xMidYMid meet")
                    .call(tipRVD);

  //Create Container
  var containerRVD = svgRVD.append("g").attr("transform", "translate(" + padRVD + "," + padRVD + ")");

  ////xScale & yScale
  var xScaleRVD = d3.scale.ordinal().rangeRoundBands([0, widthRVD - 2*padRVD], .5);
  var yScaleRVD = d3.scale.linear().domain([0,1]).range([heightRVD - 2*padRVD, 0]);

  //xAxis
  var xAxisRVD = d3.svg.axis().scale(xScaleRVD).orient("bottom").ticks(0);
  var axisRVD = svgRVD.append("g")
                      .attr("class", "x axis")
                      .attr("transform", "translate(" + padRVD + "," + (heightRVD-padRVD) + ")")
                      .call(xAxisRVD);
  //yAxis
  var yAxisRVD = d3.svg.axis().scale(yScaleRVD).orient("left").ticks(3);
  var axisYRVD = svgRVD.append("g")
                      .attr("class", "y axis")
                      .attr("transform", "translate(" + padRVD + "," + padRVD + ")")
                      .call(yAxisRVD);

  //Add new bar and update axis
  function addRect(color, value) {
    var key = Object.keys(Values);
    var range = key.sort(function sortNumber(a, b) {
        return a - b;
    });

    xScaleRVD.domain(range)
    xAxisRVD.ticks(range.length);
    axisRVD.call(xAxisRVD);

    var RVRects = containerRVD.selectAll("rect").data(key, function(d) { return d; });

    RVRects.enter().append("rect")
      .attr("id",function(d) {return 'bar'+d;})
      .attr('fill', color)
      .attr('opacity', 0.6)
      .on('mouseover', function(d){tipRVD.show(d,this)})
      .on('mouseout', tipRVD.hide);

    RVRects.exit().remove();

    updateRect();
  }


  //Update Coin Bar Chart
  function updateRect() {

    containerRVD.selectAll("rect").transition()
        .attr("x",function(d,i) {return xScaleRVD(d);})
        .attr("y",function(d,i) {return yScaleRVD(Values[d]/Math.max(total, 1));})
        .attr("height",function(d,i) {return yScaleRVD(1 - Values[d]/Math.max(total, 1));})
        .attr("width",xScaleRVD.rangeBand());
  }
}

//*******************************************************************************//
//Discrete and Continuous
//*******************************************************************************//
function discrete_continuous() {
  //Constants
  var xMax = [-40,40];
  var yMax = [0,5];
  var currentView = [-5,5];

  var parameters = {'bernoulli':['Probability'], 
                    'binomialDiscrete':['Number','Probability'], 
                    'negbin':['Number','Probability'], 
  				          'geometric':['Probability'], 
                    'poisson':['Lambda'],
                    'uniform':['Min','Max'], 
                    'normal':['Mean','Std'], 
                    'studentt':['Dof'], 
                    'chisquare':['Dof'], 
                    'exponential':['Lambda'], 
                    'centralF': ['Dof1','Dof2'], 
                    'gamma': ['Shape','Scale'], 
                    'beta': ['Alpha','Beta']};

  var initialParameters = {'bernoulli':[0.5], 
                           'binomialDiscrete':[5,0.5], 
                           'negbin':[5,0.5], 
                           'geometric':[0.5], 
                           'poisson':[5],
  						             'uniform':[-5,5], 
                           'normal':[0,1], 
                           'studentt':[5], 
                           'chisquare':[5], 
                           'exponential':[1], 
                           'centralF':[5,5], 
                           'gamma': [1,1], 
                           'beta': [1,1]};

  var distributions = ['bernoulli',
                       'binomialDiscrete',
                       'negbin',
                       'geometric',
                       'poisson',
                       'uniform',
                       'normal',
                       'studentt',
                       'chisquare',
                       'exponential',
                       'centralF',
                       'gamma', 
                       'beta'];
                       
  var initialView = {'bernoulli':[-1,5], 
                     'binomialDiscrete':[-1,5], 
                     'negbin':[-1,5], 
                     'geometric':[-1,5], 
                     'poisson':[-1,5],
                     'uniform':[-6,6], 
                     'normal':[-5,5], 
                     'studentt':[-5,5], 
                     'chisquare':[-1,8], 
                     'exponential':[-1,5], 
                     'centralF':[-1,5],
                      "":[-5,5], 
                      'gamma': [-1,5], 
                      'beta': [-0.5,1.5]};

  var currentDist="";
  var currentPercent = 0;


  // Create SVG and elements
  // var svgDist = d3.select("#graphDist").append("svg");
    // 1: Set up dimensions of SVG
  var margin = {top: 60, right: 20, bottom: 100, left: 20},
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // 2: Create SVG
  var svgDist = d3.select("#graphDist").append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
      .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xDist = svgDist.append("g").attr("class", "x axis");
  var yDist = svgDist.append("g").attr("class", "y axis");
  var clip = svgDist.append("clipPath").attr("id", "view").append("rect");
  var pdfPath = svgDist.append("path").attr("id", "pdf").attr("clip-path", "url(#view)");
  var pdfArea = svgDist.append("path").attr("id", "pdfArea").attr("clip-path", "url(#view)").moveToBack();
  var cdfPath = svgDist.append("path").attr("id", "cdf").attr("clip-path", "url(#view)");
  var shift = svgDist.append("rect").attr("fill", "transparent").attr("id","shift");
  var control = svgDist.append("g");

  //Create scale functions
  var xScaleDist = d3.scale.linear().domain([-5, 5]);

  var yScaleDist = d3.scale.linear().domain([0, 1]);

  //Define X axis
  var xAxisDist = d3.svg.axis()
  				  .scale(xScaleDist)
  				  .orient("bottom")
  				  .ticks(5);

  //Define Y axis
  var yAxisDist = d3.svg.axis()
  				  .scale(yScaleDist)
  				  .orient("left")
  				  .ticks(5);


  //Handle zoom and scale
  var zoom = d3.behavior.zoom()
      .scaleExtent([0.25, 4])
      .on("zoom", zoomed);


  //Zoom function
  function zoomed() {
  	if (xScaleDist.domain()[0] < xMax[0]) {
  	    var x = zoom.translate()[0] - xScaleDist(xMax[0]) + xScaleDist.range()[0];
  	    zoom.translate([x, 0]);
  	}
  	if (xScaleDist.domain()[1] > xMax[1]) {
  	    var x = zoom.translate()[0] - xScaleDist(xMax[1]) + xScaleDist.range()[1];
  	    zoom.translate([x, 0]);
  	}
  	if (yScaleDist.domain()[0] != yMax[0]) {
  	    var y = zoom.translate()[1] - yScaleDist(yMax[0]) + yScaleDist.range()[0];
  	    zoom.translate([zoom.translate()[0], y]);
  	}
  	if (yScaleDist.domain()[1] > yMax[1]) {
  	    var y = zoom.translate()[1] - yScaleDist(yMax[1]) + yScaleDist.range()[1];
  	    zoom.translate([zoom.translate()[0], y]);
  	}
  	//Update X axis
  	xDist.call(xAxisDist);
  	//Update Y axis
  	yDist.call(yAxisDist);
  	//Update current view area
  	currentView = xScaleDist.domain();

  	redrawPath(currentDist);
  }

  //Add control buttons for zoom and pan
  function move() {
    svgDist.call(zoom.event); // https://github.com/mbostock/d3/issues/2387

    // Record the coordinates (in data space) of the center (in screen space).
    var center0 = zoom.center(), translate0 = zoom.translate(), dir = +this.getAttribute("data-move");
    var translate = translate0[0]+center0[0]*dir;
    // Translate from center.
    zoom.translate([translate, 0]);

    svgDist.transition().duration(1000).call(zoom.event);
  }

  function scale() {
    svgDist.call(zoom.event); // https://github.com/mbostock/d3/issues/2387

    // Record the coordinates (in data space) of the center (in screen space).
    var center0 = zoom.center(), translate0 = zoom.translate(), coordinates0 = coordinates(center0);
    scale = zoom.scale() * Math.pow(2, +this.getAttribute("data-zoom"));
    zoom.scale(Math.max(0.25, Math.min(scale, 4)));

    // Translate back to the center.
    var center1 = point(coordinates0);
    zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);

    svgDist.transition().duration(1000).call(zoom.event);
  }

  function coordinates(point) {
    var scale = zoom.scale(), translate = zoom.translate();
    return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
  }

  function point(coordinates) {
    var scale = zoom.scale(), translate = zoom.translate();
    return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
  }

  control.selectAll('image.move')
          .data(['left','right'])
          .enter()
          .append('image')
          .attr("xlink:href", function(d,i) { return "./img/"+d+".png"; })
          .attr("x", function(d,i) {return i*50;})
          .attr("y", 10)
          .attr("width", 25)
          .attr("height", 25)
          .attr("class", "move")
          .attr("data-move",function(d,i) {return 1 + i*-2;})
          .on("click", move);

  control.selectAll('image.scale')
          .data(['plus','minus'])
          .enter()
          .append('image')
          .attr("xlink:href", function(d,i) { return "./img/"+d+".png"; })
          .attr("x", 25)
          .attr("y", function(d,i) {return i*25;})
          .attr("width", 25)
          .attr("height", 25)
          .attr("class", "scale")
          .attr("data-zoom",function(d,i) {return 1 + i*-2;})
          .on("click", scale);

  // Draw PDF/CDF Path
  function redrawPath(dist) {
    if(dist != "") {
    	var line = d3.svg.line()
    	  .x(function(d) { return xScaleDist(d[0])})
    	  .y(function(d) { return yScaleDist(d[1])})
    	  .interpolate("linear");
    	var area = d3.svg.area()
    	  .x(function(d) { return xScaleDist(d[0])})
    	  .y0(yScaleDist(0))
    	  .y1(function(d) { return yScaleDist(d[1])})
    	  .interpolate("linear");
    	var parameter = parameters[dist];
    	var params = parameter.map(function(x){return parseFloat(document.getElementById(dist+x).value)});
    	params.unshift(0);
    	pdfPath
    	  .datum(d3.range(Math.floor(currentView[0]),Math.ceil(currentView[1])+0.01,0.01).map(function(x) { 
    	  	params[0] = x;
    	  	return [x, Math.min(jStat[dist].pdf.apply(null, params),yMax[1])]; }))
    	  .attr("d", line)
    	  .style("stroke-width", "5px");
    	pdfArea
    	  .datum(d3.range(currentView[0],currentView[0]+0.01+(currentView[1]-currentView[0])*currentPercent,0.01).map(function(x) { 
    	  	params[0] = x;
    	  	return [x, Math.min(jStat[dist].pdf.apply(null, params),yMax[1])]; }))
    	  .attr("d", area)
        .style("opacity", "0.5");
    	cdfPath
    	  .datum(d3.range(currentView[0],currentView[0]+0.01+(currentView[1]-currentView[0])*currentPercent,0.01).map(function(x) { 
    	  	params[0] = x;
    	  	return [x, jStat[dist].cdf.apply(null, params)]; }))
    	  .attr("d", line)
        .style("stroke-width", "5px");
    } else {
      pdfPath.style("stroke-width", "0px");
      pdfArea.style("opacity", "0");
      cdfPath.style("stroke-width", "0px");
    }
  }

  //Update Range Input
  $(".inputDist").on("input", function(e) {
  	updateRangeInput($(this).val(), this.id);
  	redrawPath(this.parentNode.id);
  	});
  function updateRangeInput(n, id) {
    d3.select("#"+id+"-value").text(round(n,2));
  };

  // //Update Percent Input
  // $("#percentDist").on("input", function(e) {
  // 	currentPercent = $(this).val();
  // 	redrawPath(currentDist);
  // 	});
  // slide function
  function slide(val) {
    currentPercent = val;
    redrawPath(currentDist);
  }

  //Handles discrete/continuous radio buttons
  $("input[name='distributions']").on("change", function () {
      $('.definition').toggle();
      $('.distribution').css('display','none');
      $('.distributions').val(function () {
        return $(this).find('option').filter(function () {
            return $(this).prop('defaultSelected');
        }).val();
      });
      currentDist = "";
      $('#descriptionTable').css('display','none');
      $('#resetDist').css('display','none').click();
      $('.giant-slider').css('display','none');
  });

  //Draw Distribution
  $('.distributions').on('change', function(){
      var dist = $(this).find("option:selected").prop('value');
      $('.distribution').css('display','none');
      $('.'+dist).toggle();
      currentDist = dist;
      $('#descriptionTable').css('display','table');
      $('#resetDist').css('display','inline-block').click();
      $('.giant-slider').css('display','block');
  });


  //Reset function
  $('#resetDist').on('click', function() {
  	distributions.map(function(x){
  		var paramNames = parameters[x];
  		var paramValues = initialParameters[x];
  		for (var i = paramNames.length - 1; i >= 0; i--) {
  			updateRangeInput(paramValues[i], x+paramNames[i]);
  			$('#'+x+paramNames[i]).val(paramValues[i]);
  		};
  	});
    currentView = initialView[currentDist];
    xScaleDist.domain(currentView);
    yScaleDist.domain([0, 1]);
    zoom.x(xScaleDist).y(yScaleDist);
    xDist.call(xAxisDist);
    yDist.call(yAxisDist);
    currentPercent = 0;
    $("#percentDist").val(0);
    reset_slider();
    redrawPath(currentDist);
  });

  //Update SVG based on width of container
	var wpad = 10;
  var hpad = 40;

  var reset_slider = create_slider(slide, svgDist, width - 2 * wpad, height, wpad);


	yScaleDist.range([height-hpad, hpad]);
	xScaleDist.range([wpad, width-wpad]);
	zoom.x(xScaleDist).y(yScaleDist).center([width / 2, height / 2]);

  control.attr("transform", "translate(" + (width-120) + "," + hpad + ")")

	xDist.attr("transform", "translate(0," + (height - hpad) + ")").call(xAxisDist);
	yDist.attr("transform", "translate(" + wpad + ",0)").call(yAxisDist);
	shift.attr("x", wpad).attr("y", hpad).attr("width", width-2*wpad).attr("height", height-2*hpad).call(zoom);
	clip.attr("x", wpad).attr("y", hpad-2).attr("width", width-2*wpad).attr("height", height-2*hpad+4);

	redrawPath(currentDist);

}
//*******************************************************************************//
//Central Limit Theorem
//*******************************************************************************//

function clt() {
  // define width, height, margin
  var margin = {top: 15, right: 5, bottom: 15, left: 5};
  var width = 800;//parseInt(d3.select("#graph").style("width")) - margin.left - margin.right,
      height = 500;
  // create svg
  var svg_clt = d3.select("#graph").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // constants
  var dt = 100,
      n = 1,
      draws = 1,
      alpha = 1,
      beta = 1,
      y1 = height / 3,
      y2 = height / 4,
      bins = 20,
      counts = [],
      interval_clt;


  // scales
  var x_scale_clt = d3.scale.linear().domain([0, 1]).range([0, width]);
  var y_scale_clt = d3.scale.linear().domain([0, 3]).range([0, height - (2*y1)]);
  var z_scale_clt = d3.scale.linear().domain([0, 3]).range([0, y1]);


  // clip path
  var clip_clt = svg_clt.append("clipPath")
                  .attr("id", "view_clt")
                  .append("rect")
                  .attr("x", 0)
                  .attr("y", height - (2*y1 - y2))
                  .attr("width", width)
                  .attr("height", (2*y1 - y2));

  // draw horizontal bar
  function draw_bar(selection, dy, label) {
    // group
    var axis = selection.append("g").attr("class", "axis");
    // bar
    axis.append("line")
      .attr("x1", x_scale_clt(0))
      .attr("x2", x_scale_clt(1))
      .attr("y1", dy)
      .attr("y2", dy);
    // label
    axis.append("text")
      .attr("x", x_scale_clt(0))
      .attr("y", dy)
      .attr("dy", "1em")
      .text(label);
  };
  // create three bars
  svg_clt.call(draw_bar, y1, "draw");
  svg_clt.call(draw_bar, y1+y2, "average");
  svg_clt.call(draw_bar, 3*y1, "count");


  // path and area elements
  var sampling_path = svg_clt.append("path").attr("id", "pdf"),
      sampling_area = svg_clt.append("path").attr("id", "pdfArea"),
      theoretical_path = svg_clt.append("path")
                                .attr("id", "cdf")
                                .attr("opacity", 0)
                                .attr("clip-path", "url(#view_clt)")
                                .moveToBack();

  // Update sampling distributions
  function draw_sampling() {
    // path function
  	var line = d3.svg.line()
  	  .x(function(d) { return x_scale_clt(d[0])})
  	  .y(function(d) { return y1 - z_scale_clt(d[1])})
  	  .interpolate("basis");
    // area function
  	var area = d3.svg.area()
  	  .x(function(d) { return x_scale_clt(d[0])})
  	  .y0(y1)
  	  .y1(function(d) { return y1 - z_scale_clt(d[1])})
  	  .interpolate("basis");
    // pdf data
    var datum = d3.range(0, 1.05, 0.05).map(function(x) { 
      return [x, Math.min(jStat.beta.pdf(x, alpha, beta),10)]; 
    })
    // update sampling distribution
  	sampling_path.datum(datum).attr("d", line);
  	sampling_area.datum(datum).attr("d", area);
    // draw threoretical
    draw_theoretical(datum);
  }

  // draw theoretical distribution
  function draw_theoretical(datum) {
    // path function
    var line = d3.svg.line()
      .x(function(d) { return x_scale_clt(d[0])})
      .y(function(d) { return 3*y1 - y_scale_clt(d[1])})
      .interpolate("basis");
    // update theoretical distribution
    if (n == 1) {
      theoretical_path.datum(datum).attr("d", line);
      //y_scale_clt.domain([0,3]);
    } else {
      var mean = jStat.beta.mean(alpha, beta);
      var variance = jStat.beta.variance(alpha, beta)/n;
      var x_mode = jStat.normal.mode(mean, Math.sqrt(variance));
      y_scale_clt.domain([0, jStat.normal.pdf(x_mode, mean, Math.pow(variance,0.5))]);
      datum = d3.range(0, 1.05, 0.01).map(function(x) { return [x, jStat.normal.pdf(x, mean, Math.pow(variance,0.5))]; });
      theoretical_path.datum(datum).attr("d", line);
    }
  }

  // create histogram
  var histogram = d3.layout.histogram().bins(x_scale_clt.ticks(bins)).frequency(false);
  var bars = svg_clt.append("g").attr("class", "histogram");

  function draw_histogram() {
    // get histrogram of counts
    var data = histogram(counts);
    // update scale
    var ymax = d3.max(data.map(function(d) { return d.y; }));
    y_scale_clt.domain([0, ymax*bins]);
    // enter bars
    var bar = bars.selectAll("g").data(data);
    var barEnter = bar.enter().append("g").attr("class", "bar");
    barEnter.append("rect");
    barEnter.append("text")
      .attr("y", 3*y1 - 15)
      .attr("text-anchor", "middle");
    // update bars
    bar.select("rect")
      .attr("x", function(d) { return x_scale_clt(d.x) + 1; })
      .attr("width", x_scale_clt(data[0].dx) - 1)
    .transition().duration(250)
      .attr("y", function(d) { return 3*y1 - y_scale_clt(d.y*bins); })
      .attr("height", function(d) { return y_scale_clt(d.y*bins); });
    bar.select("text")
      .attr("x", function(d) { return x_scale_clt(d.x + 1/(2*bins)); })
      .text(function(d) { return d.y > 0 ? d3.format("%")(d.y) : ""; });
    // exit bars
    bar.exit().remove();
  };

  // Creates Circles and transitions
  function tick() {
    // take samples
    var data = [];
    for (var i = 0; i < n; i++) {
      data.push(jStat.beta.sample(alpha,beta));
    };
    var mean = d3.mean(data);
    // add balls
    var group = svg_clt.append("g").attr("class", "ball-group");
    var balls = group.selectAll(".ball").data(data);
    // animate balls
    var i = 0, j = 0;
    balls.enter()
      .append("circle")
      .attr("class", "ball")
      .attr("cx", function(d) { return x_scale_clt(d); })
      .attr("cy", y1)
      .attr("r", 5)
      .transition()
      .duration(dt)
      .attr("cy", y1 + y2 - 5)
      .each(function() { ++i; })
      .each("end", function() {
        if (!--i) {
          balls
            .transition()
            .duration(400)
            .attr("cx", x_scale_clt(mean))
            .style("fill", "#FF8B22")
            .transition()
            .duration(400)
            .attr("cy", 3*y1-3)
            .attr("r", 3)
            .each(function() { ++j; })
            .each("end", function() {
              if (!--j) {
                counts.push(mean);
                draw_histogram();
                draw_sampling();
              }
              d3.select(this).remove();
            });
        };
      });
  }

  // initiate sampling
  function start_sampling() {
    dt = 350/Math.pow(1.04, draws);
    var count = 0;
    interval_clt = setInterval(function() { 
      tick();
        if (++count === draws){
          clearInterval(interval_clt);
        }
    }, dt);
  }


  // reset and clear CLT
  function reset_clt() {
    clearInterval(interval_clt);
    counts = [];
    d3.timer.flush();
    svg_clt.selectAll("circle").remove();
    svg_clt.selectAll(".bar").remove();
    y_scale_clt.domain([0,3]);
    draw_sampling();
  }

  // update alpha
  $("#alpha_clt").on("input", function(e) {
    alpha = parseFloat($(this).val());
    d3.select("#alpha_clt-value").text(round(alpha,2));
    reset_clt();
  });

  // update beta
  $("#beta_clt").on("input", function(e) {
    beta = parseFloat($(this).val());
    d3.select("#beta_clt-value").text(round(beta,2));
    reset_clt();
  });

  // update sample size
  d3.select("#sample").on("input", function() {
    n = +this.value;
    d3.select("#sample-value").text(n);
    reset_clt();
  	});

  // update number of draws
  d3.select("#draws").on("input", function() {
    draws = +this.value;
    d3.select("#draws-value").text(draws);
  });

  // theoretical on/off
  $("#theoretical").change(function() {
     if($(this).is(":checked")) {
        theoretical_path.attr("opacity", 1);
     } else {
        theoretical_path.attr("opacity", 0);
     }
     draw_sampling();
  });

  // drop balls
  $("#form_clt").click(function() {
    clearInterval(interval_clt);
    start_sampling();
  });
  
  draw_sampling();
}
