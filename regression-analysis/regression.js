//Handles functionality of Regression

$( window ).load(function() {
  ols();
  correlation();
  anova();
});

// extracts column from JSON
function extractColumn(arr, column) {
  function reduction(previousValue, currentValue) {
    previousValue.push(currentValue[column]);
    return previousValue;
  }
  return arr.reduce(reduction, []);
}

//*******************************************************************************//
//Linear Regression
//*******************************************************************************//
function ols() {
  // constants
  var data_ols = [],
      keys_ols = [],
      x_index,
      y_index,
      dur = 100;

  // create SVG element
  var svg_ols = d3.select("#svg_ols").append("svg").attr("display", "inline-block");

  // create scale functions
  var x_scale_ols = d3.scale.linear().domain([0, 20]),
      y_scale_ols = d3.scale.linear().domain([0, 15]);

  // define axis
  var x_axis_ols = d3.svg.axis().scale(x_scale_ols).orient("bottom").ticks(5),
      y_axis_ols = d3.svg.axis().scale(y_scale_ols).orient("left").ticks(5);

  // create axis
  var x_axis_group_ols = svg_ols.append("g").attr("class", "x axis"),
      y_axis_group_ols = svg_ols.append("g").attr("class", "y axis");

  // create clip path
  var clip_ols = svg_ols.append("clipPath").attr("id", "viewOLS").append("rect");

  //Add Plot Titles
  var xaxisTextOLS = svg_ols.append("text").attr("text-anchor", "middle"),                
      yaxisTextOLS = svg_ols.append("text").attr("text-anchor", "middle");
                      
  //Create tool tip
  var tipOLS = d3.tip().attr('class', 'd3-tip').offset([-10, 0]);
  $(window).on('mouseup', tipOLS.hide);

  //Create container for graph elements(data points and lines)
  var containerOLS = svg_ols.append("g").attr("clip-path", "url(#viewOLS)").call(tipOLS);

  // drag functions
  var dragOLS = d3.behavior.drag() 
      .origin(function(d) { return {x: d3.select(this).attr("cx"), y: d3.select(this).attr("cy")}; }) 
      .on('drag', function(d) {
          var r = parseFloat(d3.select(this).attr("r")),
              x = Math.max(x_scale_ols.range()[0] + r, Math.min(x_scale_ols.range()[1] - r, d3.event.x)),
              y = Math.max(y_scale_ols.range()[1] + r, Math.min(y_scale_ols.range()[0] - r, d3.event.y));
          d3.select(this).attr('cx', x).attr('cy', y);
          d[keys_ols[x_index]] = x_scale_ols.invert(x);
          d[keys_ols[y_index]] = y_scale_ols.invert(y);
          tipOLS.show(d,this);
          statisticsCalcOLS(0); })

  // Add data points to plot
  function addDataPointsOLS (){
    // update text
    xaxisTextOLS.text(keys_ols[x_index]);
    yaxisTextOLS.text(keys_ols[y_index]);

    // update tooltip
    tipOLS.html(function(d,i) { 
      return '<strong>' + keys_ols[x_index] + ': </strong>' + round(d[keys_ols[x_index]], 2) + '<br>' +
             '<strong>' + keys_ols[y_index] + ': </strong>' + round(d[keys_ols[y_index]], 2);});

    // select all circles
    var circles = containerOLS.selectAll("circle.data").data(data_ols);
    // enter new circles
    circles.enter()
      .append("circle")
      .attr("r", 5)
      .attr("class","data")
      .call(dragOLS)
      .on('mousedown', function(d){tipOLS.show(d,this)})
      .on('mouseover', function(d){tipOLS.show(d,this)})
      .on('mouseout', tipOLS.hide);

    // add regression line
    containerOLS.selectAll("line.ols")
      .data([1])
      .enter()
      .append("line")
      .attr("class", "ols")
      .moveToBack();

    // select all rectangles
    var rects = containerOLS.selectAll("rect.sse").data(data_ols);
    // enter new circles
    rects.enter()
      .append("rect")
      .attr("r", 5)
      .attr("class","sse")
      .moveToBack();
  }

  // calculates ols coeficients given dataset
  function ols_coef_calc(xdata, ydata) {
    var n = xdata.length,
        xmean = d3.mean(xdata),
        ymean = d3.mean(ydata),
        sxx = 0,
        sxy = 0;
    for (var i = 0; i < n; i++) {
      sxx += Math.pow((xdata[i] - xmean), 2);
      sxy += (xdata[i] - xmean) * (ydata[i] - ymean);
    }
    var b1 = sxy / sxx,
        b0 = ymean - b1 * xmean;

    var sse = 0;
    for (var i = 0; i < n; i++) {
      sse += Math.pow((xdata[i] * b1 + b0 - ydata[i]), 2);
    }
    var b0_std = sse*Math.pow(xmean,2)/sxx + sse/n,
        b1_std = sse/sxx;

    return [n, xmean, ymean, b0, b1, sse, b0_std, b1_std];
  }

  // Updates regression table and transition elements
  function statisticsCalcOLS(dur) {
    if (data_ols.length == 0) return;
    // get data
    var xdata = extractColumn(data_ols, keys_ols[x_index]),
        ydata = extractColumn(data_ols, keys_ols[y_index]),
        result = ols_coef_calc(xdata, ydata)
        b0 = result[3],
        b1 = result[4]
        x0 = x_scale_ols.range()[0],
        x1 = x_scale_ols.range()[1];

    // update table
    $('#sampleSizeValue').html(result[0]);
    $('#xMeanValue').html(round(result[1], 2));
    $('#yMeanValue').html(round(result[2], 2));
    $('#beta0Value').html(round(result[3], 2));
    $('#beta1Value').html(round(result[4], 2));
    $('#sseValue').html(round(result[5], 2));
    $('#beta0STD').html(round(result[6], 2));
    $('#beta1STD').html(round(result[7], 2));

    // transition circles
    containerOLS.selectAll("circle.data")
      .transition()
      .duration(dur)
      .attr("cx", function(d){return x_scale_ols(d[keys_ols[x_index]])})
      .attr("cy", function(d){return y_scale_ols(d[keys_ols[y_index]])});

    // transition line
    containerOLS.selectAll("line.ols")
       .transition()
       .duration(dur)
       .attr("x1", x0)
       .attr("y1", y_scale_ols(b0 +b1*x_scale_ols.invert(x0)))
       .attr("x2", x1)
       .attr("y2", y_scale_ols(b0 +b1*x_scale_ols.invert(x1)));

    // transition rectangles
    containerOLS.selectAll("rect.sse")
      .transition()
      .duration(dur)
      .attr("x", function(d){return x_scale_ols(d[keys_ols[x_index]])})
      .attr("y", function(d){return y_scale_ols(Math.max(d[keys_ols[y_index]], b0+b1*d[keys_ols[x_index]])); })
      .attr("width", function(d){return Math.abs(y_scale_ols(d[keys_ols[y_index]]) - y_scale_ols(b0+b1*d[keys_ols[x_index]])); })
      .attr("height", function(d){return Math.abs(y_scale_ols(d[keys_ols[y_index]]) - y_scale_ols(b0+b1*d[keys_ols[x_index]])); });

  }

  //Draw Populations
  $('#datasetsOls').change(function(e){
      d3.csv('data/anscombe.csv', function(data){
        data_ols = data;
        keys_ols = d3.keys(data_ols[0])
        x_index = +$('input[name = "ols"]:checked').val();
        y_index = x_index + 4;
        addDataPointsOLS();
        statisticsCalcOLS(dur);
      });
  });


  var tableExplanation = ["#sampleSize","#xMean","#yMean","#beta0","#beta1","#sse"];
  //Handles regression table highlighting and clicking
  $("#table_ols").delegate('td','click mouseover mouseleave', function(e) {
    var col = $(this).index(),
        curr = $("#table_ols colgroup").eq($(this).index());

    if (col) {
      if(e.type == 'mouseover' && !curr.hasClass("click")) {
        curr.addClass("hover");
      } else if (e.type == 'click') {
        $(".explanation").css("display","none");
        if(curr.hasClass("click")) {
          $("#defaultRegresion").css("display","block");
          curr.removeClass("click");
        } else { 
          $("colgroup").removeClass("click hover");
          curr.addClass("click");
          $(tableExplanation[col - 1]).fadeToggle();
        }
      } else {
        curr.removeClass("hover");
      }
    };
  });


  //Draws SVG and resizes based upon window size (render)
  function drawOls() {
    // constants
    var parent = d3.select('#svg_ols'),
        w = parent.node().clientWidth,
        h = 500,
        padding = 50;

    //Update Scale Range
    x_scale_ols.range([padding, (w - padding)]);
    y_scale_ols.range([(h - padding), padding]);

    //Update svg size
    svg_ols.attr("width", w).attr("height", h);

    //Update Axis
    x_axis_group_ols.attr("transform", "translate(0," + (h - padding) + ")").call(x_axis_ols);
    y_axis_group_ols.attr("transform", "translate(" + padding + ",0)").call(y_axis_ols);

    //Update Clip Path
    clip_ols.attr("x", padding).attr("y", padding).attr("width", w-2*padding).attr("height", h-2*padding);

    //Update Axis Labels
    xaxisTextOLS.attr("transform", "translate("+ (w/2) +","+(h-padding/4)+")");
    yaxisTextOLS.attr("transform", "translate("+ (padding/4) +","+(h/2)+")rotate(-90)");

    //Update regression table
    statisticsCalcOLS(0);
  }
  drawOls();
  $(window).on("resize", drawOls);
}

//*******************************************************************************//
//Correlation
//*******************************************************************************//

function correlation() {
  //Constants
  var lineWidth = 2;
  var data_corr = [];
  var keys_corr = [];
  var x_key = 0;
  var y_key = 0;
  var sf_corr = 0.25;

  //Create scale functions
  var xScaleCorr = d3.scale.linear();
  var yScaleCorr = d3.scale.linear();
  var pScaleCorr = d3.scale.linear().domain([-1,0,1]).range(['#FF8686','#FFFFFF','#8FDEFF']);
  //Bar Chart
  var xScaleBarCorr = d3.scale.linear().domain([-1, 1]);

  //Define X axis
  var xAxisCorr = d3.svg.axis().scale(xScaleCorr).orient("bottom").ticks(0);
  //Bar Chart
  var xAxisBarCorr = d3.svg.axis().scale(xScaleBarCorr).orient("bottom").ticks(5);
  //Define Y axis
  var yAxisCorr = d3.svg.axis().scale(yScaleCorr).orient("left").ticks(0);

  //Create SVG element
  var svgCorr = d3.select("#svgCorr").append("svg").attr("display", "inline-block");
  //Bar Chart
  // var svgBarCorr = d3.select("#svgCorr").append("svg").attr("display", "inline-block");

  //Create X axis
  var xAxisGroupCorr = svgCorr.append("g").attr("class", "x axis");
  //Bar Chart
  var xAxisGroupBarCorr = svgCorr.append("g").attr("class", "x axis");

  //Create Y axis
  var yAxisGroupCorr = svgCorr.append("g").attr("class", "y axis");

  //Create Clip Path
  var clipCorr = svgCorr.append("clipPath").attr("id", "viewCorr").append("rect");

  //Add Plot Titles
  var xaxisTextCorr = svgCorr.append("text").attr("text-anchor", "middle");                
  var yaxisTextCorr = svgCorr.append("text").attr("text-anchor", "middle");
                      
  //Create tool tip
  var tipCorr = d3.tip().attr('class', 'd3-tip').offset([-10, 0]);
  $(window).on('mouseup', tipCorr.hide);

  //Create container for graph elements(data points and lines)
  var containerCorr = svgCorr.append("g").attr("clip-path", "url(#viewCorr)").call(tipCorr);

  //Drag functions
  var dragCorr = d3.behavior.drag() 
      .origin(function(d) { 
          return {x: d3.select(this).attr("cx"), y: d3.select(this).attr("cy")}; }) 
      .on('drag', function(d) {
          var r = parseFloat(d3.select(this).attr("r")),
              x = Math.max(xScaleCorr.range()[0] + r, Math.min(xScaleCorr.range()[1] - r, d3.event.x)),
              y = Math.max(yScaleCorr.range()[1] + r, Math.min(yScaleCorr.range()[0] - r, d3.event.y));
          d3.select(this).attr('cx', x).attr('cy', y);
          d[keys_corr[x_key]] = xScaleCorr.invert(x);
          d[keys_corr[y_key]] = yScaleCorr.invert(y);
          tipCorr.show(d,this);
          corr_table_calc();})

  // Add data points to plot
  function add_data_corr() {

    // update axis labels
    xaxisTextCorr.text(keys_corr[x_key]);
    yaxisTextCorr.text(keys_corr[y_key]);

    // update tool tip html
    tipCorr.html(function(d,i) { 
      return '<strong>' + keys_corr[x_key] + ': </strong>' + round(d[keys_corr[x_key]],2) + '<br>' +
             '<strong>' + keys_corr[y_key] + ': </strong>' + round(d[keys_corr[y_key]],2); });

    // update x axis
    var x_min = d3.min(data_corr, function(d) { return +d[keys_corr[x_key]] }),
        x_max = d3.max(data_corr, function(d) { return +d[keys_corr[x_key]] }),
        x_offset = (x_max - x_min) * sf_corr;
    xScaleCorr.domain([x_min - x_offset, x_max + x_offset]);
    xAxisCorr.ticks(5);
    xAxisGroupCorr.transition().call(xAxisCorr);

    // update y axis
    var y_min = d3.min(data_corr, function(d) { return +d[keys_corr[y_key]] }),
        y_max = d3.max(data_corr, function(d) { return +d[keys_corr[y_key]] }),
        y_offset = (y_max - y_min) * sf_corr;
    yScaleCorr.domain([y_min - y_offset, y_max + y_offset]);
    yAxisCorr.ticks(5);
    yAxisGroupCorr.transition().call(yAxisCorr);

    // select all circles
    var data = containerCorr.selectAll("circle.data")
      .data(data_corr, function(d) { return +d.Index; });

    // exit old circles
    data.exit().remove();

    // enter new circles
    var data_enter = data.enter()
      .append("circle")
      .attr("r", 5)
      .attr("class","data")
      .call(dragCorr)
      .on('mousedown', function(d) { tipCorr.show(d,this); })
      .on('mouseover', function(d) { tipCorr.show(d,this); })
      .on('mouseout', tipCorr.hide);

    // transition circles
    data_enter.transition()
      .attr("cx", function(d) { return xScaleCorr(d[keys_corr[x_key]]); })
      .attr("cy", function(d) { return yScaleCorr(d[keys_corr[y_key]]); });
    data.transition()
      .attr("cx", function(d) { return xScaleCorr(d[keys_corr[x_key]]); })
      .attr("cy", function(d) { return yScaleCorr(d[keys_corr[y_key]]); });

    // update correlation table
    corr_table_calc();
  }


  function reset_corr() {

    // remove all circles
    svgCorr.selectAll("circle").remove();

    // clear axis ticks
    xAxisCorr.ticks(0);
    xAxisGroupCorr.transition().call(xAxisCorr);
    yAxisCorr.ticks(0);
    yAxisGroupCorr.transition().call(yAxisCorr);

    // clear axis labels
    xaxisTextCorr.text("");
    yaxisTextCorr.text("");

    // clear correlation table
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        $("#table_corr tr").eq(i + 1).children().eq(j + 1)
            .html("")
            .css("background","#FFFFFF")
            .removeClass("click_corr");
      };
    };

    // clear regression lines
    regressionLineCorrX.attr("stroke", "transparent");
    regressionLineCorrY.attr("stroke", "transparent");
    cosineCorr.attr("fill", "transparent");
    barCorr.attr("stroke", "transparent");
  }


  //Append a defs (for definition) element to your SVG
  var defs = svgCorr.append("defs");
  //Append a linearGradient element to the defs and give it a unique id
  var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");
  //Horizontal gradient
  linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
  //Append multiple color stops by using D3's data/enter step
  linearGradient.selectAll("stop") 
      .data( pScaleCorr.range() )                  
      .enter().append("stop")
      .attr("offset", function(d,i) { return i/(pScaleCorr.range().length-1); })
      .attr("stop-color", function(d) { return d; });
  //Add rectangle legend
  var legend = svgCorr.append("rect")
      .style("fill", "url(#linear-gradient)")
      .attr("stroke-width",lineWidth)
      .attr('stroke','black')
      .moveToBack();



  // calculates correlation coeficients given dataset
  function corr_coef_calc(xdata, ydata) {
    var n = xdata.length,
        xmean = d3.mean(xdata),
        ymean = d3.mean(ydata),
        syy = 0,
        sxx = 0,
        sxy = 0;
    for (var i = 0; i < n; i++) {
      syy += Math.pow((ydata[i] - ymean), 2);
      sxx += Math.pow((xdata[i] - xmean), 2);
      sxy += (xdata[i] - xmean) * (ydata[i] - ymean);
    }
    var b1x = syy / sxy,
        b0x = ymean - b1x * xmean,
        b1y = sxy / sxx,
        b0y = ymean - b1y * xmean,
        p = sxy / (Math.sqrt(sxx) * Math.sqrt(syy));

    var sse = 0;
    for (var i = 0; i < n; i++) {
      sse += Math.pow((xdata[i] * b1y + b0y - ydata[i]), 2);
    }
    var tscore = b1y * Math.sqrt(sxx) * (n - 2) / sse,
        pvalue = jStat.ttest(tscore, n, 2),
        sig = pvalue < 0.05;

    return [p, b0x, b1x, xmean, b0y, b1y, ymean];
  }

  // regression line, arc, bar elements
  var regressionLineCorrX = containerCorr.append("line"),
      regressionLineCorrY = containerCorr.append("line"),
      cosineCorr = containerCorr.append("path"),
      barCorr = svgCorr.append('line');

  // updates correlation matrix, regression lines and correlation arc
  function corr_table_calc() {
    var variables;
    for (var i = 0; i < keys_corr.length - 1; i++) {
      for (var j = 0; j < keys_corr.length - 1; j++) {
        // get data
        var xdata = extractColumn(data_corr, keys_corr[i]),
            ydata = extractColumn(data_corr, keys_corr[j]),
            result = corr_coef_calc(xdata, ydata);
        // return current correlation
        if ((x_key == i) && (y_key == j)) variables = result;
        // update html and background color
        $("#table_corr tr").eq(i + 1).children().eq(j + 1)
            .html(round(result[0], 2))
            .css("font-size", "10px")
            .css("background", pScaleCorr(result[0]));
      };
    };
    if (variables == null) return;
    var p = variables[0], 
        b0x = variables[1], 
        b1x = variables[2], 
        xmean = variables[3], 
        b0y = variables[4], 
        b1y = variables[5], 
        ymean = variables[6];

    //Draw the line
    var x1 = xScaleCorr.range()[0],
        x2 = xScaleCorr.range()[1];

    regressionLineCorrX
       .attr("x1", x1)
       .attr("y1", yScaleCorr(b0x + b1x * xScaleCorr.invert(x1)))
       .attr("x2", x2)
       .attr("y2", yScaleCorr(b0x + b1x * xScaleCorr.invert(x2)))
       .attr("stroke-width", 2 * lineWidth)
       .attr("stroke", "black")
       .moveToBack();

    regressionLineCorrY
       .attr("x1", x1)
       .attr("y1", yScaleCorr(b0y +b1y*xScaleCorr.invert(x1)))
       .attr("x2", x2)
       .attr("y2", yScaleCorr(b0y +b1y*xScaleCorr.invert(x2)))
       .attr("stroke-width", 2 * lineWidth)
       .attr("stroke", "black")
       .moveToBack();


    var y_range = yScaleCorr.range()[1] - yScaleCorr.range()[0],
        y_domain = yScaleCorr.domain()[1] - yScaleCorr.domain()[0],
        y_ratio = y_range / y_domain;

    var x_range = xScaleCorr.range()[1] - xScaleCorr.range()[0],
        x_domain = xScaleCorr.domain()[1] - xScaleCorr.domain()[0],
        x_ratio = x_range / x_domain;

    var start_angle = Math.acos(-b1x * y_ratio / Math.hypot(x_ratio, b1x * y_ratio)),
        end_angle = Math.acos(-b1y * y_ratio / Math.hypot(x_ratio, b1y * y_ratio)),
        arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(100)
            .startAngle(start_angle)
            .endAngle(end_angle);

    cosineCorr.attr("d", arc)
              .attr('transform','translate('+xScaleCorr(xmean)+','+yScaleCorr(ymean)+')')
              .attr('fill',pScaleCorr(p))
              .moveToBack();

    barCorr.attr("x1", xScaleBarCorr(p))
           .attr("x2", xScaleBarCorr(p))
           .attr("stroke-width", lineWidth)
           .attr("stroke", "black");
  }



  // change species
  $('#data_corr').change(function(e){
      var species = []
      $('input[name = "correlation"]:checked').each(function() { return species.push($(this).val()); });
      d3.csv('data/iris.csv', function(data){
        data_corr = data.filter(function(d) { return species.indexOf(d['Species']) != -1; });
        keys_corr = d3.keys(data_corr[0])
        if (data_corr.length) add_data_corr();
        else                  reset_corr();
      });
  });

  // correlation table highlighting
  $("#table_corr").delegate('td','click mouseover mouseleave', function(e) {

    // get column, row, cell
    var col = $(this).index(),
        row = $(this).parent().index(),
        cell = $("#table_corr tr").eq(row).children().eq(col);

    // add hover and click classes
    if (col && row) {
      if((e.type == 'mouseover') && !cell.hasClass("click_corr")) {
        cell.addClass("hover_corr");
      } else if (e.type == 'click') {
        $("td").removeClass("click_corr hover_corr");
        cell.addClass("click_corr");
        x_key = col - 1;
        y_key = row - 1;
        add_data_corr();
      } else {
        cell.removeClass("hover_corr");
      }
    };
  });


  //Draws SVG and resizes based upon window size
  function drawCorr() {

    // constants
    var parent = d3.select('#svgCorr'),
        w = parent.node().clientWidth,
        h = 500,
        hBar = 70,
        padding = 50;

    //Update Scale Range
    xScaleCorr.range([padding, (w - padding)]);
    xScaleBarCorr.range([padding, (w - padding)]);
    yScaleCorr.range([(h - padding), padding]);

    //Update svg size
    svgCorr.attr("width", w).attr("height", h);
    // svgBarCorr.attr("width", w).attr("height", hBar);

    //Update Axis
    xAxisGroupCorr.attr("transform", "translate(0," + (h - padding) + ")").call(xAxisCorr);
    xAxisGroupBarCorr.attr("transform", "translate(0," + (hBar - padding) + ")").call(xAxisBarCorr);
    yAxisGroupCorr.attr("transform", "translate(" + padding + ",0)").call(yAxisCorr);

    //Update Bar Chart
    legend.attr("x", padding).attr("y", lineWidth).attr("width", w-2*padding).attr("height", hBar-padding-lineWidth);
    barCorr.attr("y1", lineWidth).attr("y2", hBar-padding);

    //Update Clip Path
    clipCorr.attr("x", padding).attr("y", padding).attr("width", w-2*padding).attr("height", h-2*padding);

    //Update Axis Labels
    xaxisTextCorr.attr("transform", "translate("+ (w/2) +","+(h-padding/4)+")");
    yaxisTextCorr.attr("transform", "translate("+ (padding/4) +","+(h/2)+")rotate(-90)");

    //Update data points and line
    add_data_corr();
  }
  drawCorr();
  $(window).on("resize", drawCorr);
}

//*******************************************************************************//
//ANOVA
//*******************************************************************************//
function anova() {
  // Constants
  var data_anova = [],
      sf_anova = 0.05,
      color_anova = ['#FF8B22', '#FF5757', '#D90677', '#009CDE', '#FFFF00', 
                     '#7272FF', '#55D733', '#1263D2', '#FF0080', '#A1FF00',
                     '#FF1300', '#03899C', '#FFC500', '#2419B2', '#4169E1'];

  // Create SVG element
  var svg_anova = d3.select("#svg_anova").append("svg").attr("display", "inline-block");

  // Create scale functions
  var x_scale_anova = d3.scale.ordinal().domain([]),
      y_scale_anova = d3.scale.linear().domain([]);

  // Define axis
  var x_axis_anova = d3.svg.axis().scale(x_scale_anova).orient("bottom"),
      y_axis_anova = d3.svg.axis().scale(y_scale_anova).orient("left");

  // Create axis
  var x_axis_group_anova = svg_anova.append("g").attr("class", "x axis"),
      y_axis_group_anova = svg_anova.append("g").attr("class", "y axis");

  // Add axis titles
  var x_axis_title_anova = svg_anova.append("text").attr("text-anchor", "middle"),                
      y_axis_title_anova = svg_anova.append("text").attr("text-anchor", "middle");

  // Create tool tip
  var tip_anova = d3.tip().attr('class', 'd3-tip').offset([-10, 0]);

  // Drag function
  var drag_anova = d3.behavior.drag() 
      .origin(function(d) { 
          return {x: d3.select(this).attr("cx"), y: d3.select(this).attr("cy")}; }) 
      .on('drag', function(d) {
          var r = parseFloat(d3.select(this).attr("r")),
              y = Math.max(y_scale_anova.range()[1] + r, 
                  Math.min(y_scale_anova.range()[0] - r, d3.event.y));
          d.v = y_scale_anova.invert(y);
          tip_anova.show(d,this);
          calc_statistic_anova(); })

  // Add data points to plot
  function add_data_anova(data) {
    // extract data
    data_anova = data.reduce(function(a, b) {
      for (var key in b) {
        a.push({'t':key, 'v': +b[key]});
      }
      return a;
    }, []);
    // update groups
    var keys = d3.keys(data[0])
    // update x axis
    x_scale_anova.domain(keys)
    x_axis_anova.ticks(keys.length);
    x_axis_group_anova.call(x_axis_anova);
    // update y axis
    var min = d3.min(data, function(d) { return d3.min(d3.values(d), function(d) {return +d; });} );
    var max = d3.max(data, function(d) { return d3.max(d3.values(d), function(d) {return +d; });} );
    var offset = (max - min)*sf_anova;
    y_scale_anova.domain([min - offset, max + offset]);
    y_axis_anova.ticks(5);
    y_axis_group_anova.call(y_axis_anova);
    // update titles
    x_axis_title_anova.text();
    y_axis_title_anova.text();
    // update tool tip
    tip_anova.html(function(d,i) {
      return '<strong>Treatment: </strong>' + d.t + '<br>' +
             '<strong>Value: </strong>' + round(d.v,2); });
    // compute color map
    var color = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      color[key] = color_anova[i];
    }
    // add mean line
    svg_anova.selectAll("line.mean").remove();
    svg_anova.selectAll("line.mean")
      .data(keys)
      .enter()
      .append("line")
      .attr("stroke-width", 2)
      .attr("stroke", function(d) { return color[d]; })
      .attr("class", "mean");
    // add new cirlces
    svg_anova.selectAll("circle").remove();
    svg_anova.selectAll("circle")
      .data(data_anova)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color[d.t]; })
      .style("cursor","pointer")
      .call(drag_anova)
      .on('mousedown', function(d){tip_anova.show(d,this)})
      .on('mouseover', function(d){tip_anova.show(d,this)})
      .on('mouseout', tip_anova.hide);

    $('#svg_anova').parent().on('mouseup', tip_anova.hide);
    // calculate statistics
    calc_statistic_anova();
  }


  // Compute statistics
  function calc_statistic_anova() {
    // check there is data
    if (!data_anova.length) {
      return;
    };
    // update circle positions
    svg_anova.selectAll("circle")
            .attr("cx", function(d) { return x_scale_anova(d.t) + x_scale_anova.rangeBand()/2; })
            .attr("cy", function(d) { return y_scale_anova(d.v); });
    // degrees of freedom
    var df_t = -1,
        df_e = 0,
        treatments = {}
        data = [];
    for (var i = 0; i < data_anova.length; i++) {
      if (treatments[data_anova[i].t]) {
        df_e += 1;
        treatments[data_anova[i].t].push(data_anova[i].v);
      } else {
        df_t += 1;
        treatments[data_anova[i].t] = [data_anova[i].v];
      }
      data.push(data_anova[i].v);
    };
    // square error
    var ss = square_error(data),
        ss_e = 0;
    for (var i in treatments) {
      ss_e += square_error(treatments[i]);
    };
    var ss_t = ss - ss_e;
    var ms_t = ss_t/df_t;
    var ms_e = ss_e/df_e;
    var f = ms_t/ms_e;
    var p = jStat.ftest(f, df_t, df_e);

    // update table
    $('#treatment_sse_anova').html(round(ss_t, 2));
    $('#treatment_df_anova').html(df_t);
    $('#treatment_ms_anova').html(round(ms_t, 2));
    $('#treatment_f_anova').html(round(f, 2));
    $('#treatment_p_anova').html(round(p, 2));
    $('#error_sse_anova').html(round(ss_e, 2));
    $('#error_df_anova').html(df_e);
    $('#error_ms_anova').html(round(ms_e, 2));
    $('#total_sse_anova').html(round(ss, 2));
    $('#total_df_anova').html(df_t + df_e);

    // update mean lines
    svg_anova.selectAll("line.mean")
            .attr("x1", function(d) { return x_scale_anova(d); })
            .attr("x2", function(d) { return x_scale_anova(d) + x_scale_anova.rangeBand(); })
            .attr("y1", function(d) { return y_scale_anova(average(treatments[d])); })
            .attr("y2", function(d) { return y_scale_anova(average(treatments[d])); });

  }

  function average(data) {
    sum = data.reduce(function(a, b){ return a + b; }, 0);
    return sum/data.length;
  }

  function square_error(data) {
    mean = average(data);
    error = data.reduce(function(a, b){ return a + Math.pow((b - mean),2); }, 0);
    return error;
  }


  // handle links
  $("#distribution").on('change', function(){
    curr_dist = $(this).find("option:selected").html();
    var path = $(this).find("option:selected").prop('value');
    var dataset = 'data/anova/'+ path;
    d3.csv(dataset, function(data){
      add_data_anova(data);
    });
  });


  // Handles anova table highlighting and clicking
  var explanation_anova = ["#square_error_anova","#degree_freedom_anova","#mean_error_anova",
                           "#f_statistic_anova","#p_value_anova"];
  $("#table_anova").delegate('td','click mouseover mouseleave', function(e) {
    var currColumn = $(this).index() ? $("#table_anova colgroup").eq($(this).index()) : 0;
    if (currColumn) {
      if(e.type == 'mouseover' && !currColumn.hasClass("click") ) {
        currColumn.addClass("hover");
      } else if (e.type == 'click') {
        $(".explanation_anova").css("display","none");
        if(currColumn.hasClass("click")) {
          $("#default_anova").css("display","block");
          currColumn.removeClass("click");
        } else { 
          $("colgroup").removeClass("click");
          currColumn.removeClass("hover");
          currColumn.addClass("click");
          $(explanation_anova[$(this).index()-1]).fadeToggle();
        }
      } else {
        currColumn.removeClass("hover");
      }
    };
  });

  //Draws SVG and resizes based upon window size
  function draw_anova() {
    var parent = d3.select('#svg_anova'),
        w = parent.node().clientWidth,
        h = 400,
        p = 40;

    //Update Scale Range
    x_scale_anova.rangeRoundBands([p, (w - p)], 0.6);
    y_scale_anova.range([(h - p), p]);

    //Update svg size
    svg_anova.attr("width", w).attr("height", h).call(tip_anova);

    //Update Axis
    x_axis_group_anova.attr("transform", "translate(0," + (h - p) + ")").call(x_axis_anova);
    y_axis_group_anova.attr("transform", "translate(" + p + ",0)").call(y_axis_anova);

    //Update Axis Labels
    x_axis_title_anova.attr("transform", "translate("+ (w/2) +","+(h-p/4)+")");
    y_axis_title_anova.attr("transform", "translate("+ (p/4) +","+(h/2)+")rotate(-90)");

    // update statistics
    calc_statistic_anova();
  }
  draw_anova();
  $(window).on("resize", draw_anova);
}
