//Handles functionality of Probability
$(window).load(function () {
    drawCoin();
    drawDie();
    // drawPi();
});

//Handles Window Resize
$(window).on("resize", function () {
    drawCoin();
    drawDie();
    // drawPi();
});

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


//*******************************************************************************//
//Likelihood
//*******************************************************************************//
//Constants
var probTheo = [0.5,0.5];
var countCoin = [0,0];
var coinData = [{data:[{value:countCoin[0],side:'head'},{value:countCoin[1],side:'tail'}],state:'Observed'},
				{data:[{value:probTheo[0],side:'head'},{value:probTheo[1],side:'tail'}],state:'Theoretical'}];

//Create SVG
var svgCoin = d3.select("#barCoin").append("svg");

//Create Container
var containerCoin = svgCoin.append('g');

//Create Scales
var yScaleCoin = d3.scale.linear().domain([0,1]);
var x0ScaleCoin = d3.scale.ordinal().domain(['Observed','Theoretical']);
var x1ScaleCoin = d3.scale.ordinal().domain(['head','tail']);

//Drag function for coin bar chart
var dragCoin = d3.behavior.drag()
         .origin(function() { 	var rect = d3.select(this);
                  				return {x: rect.attr("x"), y: rect.attr("y")};})  
         .on('drag', function(d) {	var y = Math.min(1,Math.max(0,yScaleCoin.invert(d3.event.y)));
     								if(d3.select(this).attr("class")=="head") probTheo = [y,1-y];
     								else probTheo = [1-y,y];
     								d.value=y;
     								tipCoinTheo.show(d,this);
     								countCoin = [0,0];
     								updateCoin();
     								})

//Create SVG Elements
var states = containerCoin.selectAll("g.state").data(coinData).enter().append("g").attr("class", "state");

var rects = states.selectAll("rect").data(function(d) { return d.data; }).enter().append("rect");

var sides = states.selectAll("image").data(function(d) { return d.data; }).enter().append("image");

var axisCoin = svgCoin.append("g").attr("class", "x axis");

var xAxisCoin = d3.svg.axis().scale(x0ScaleCoin).orient("bottom").ticks(0);


//Create tool tips for observed and expected
var tipCoinObs = d3.tip().attr('id', 'tipCoinObs').attr('class', 'd3-tip').offset([-10, 0]);
var tipCoinTheo = d3.tip().attr('id','tipCoinTheo').attr('class', 'd3-tip').offset([-10, 0]);

//Update rectangles and text
function updateCoin() {
	var total = Math.max(1,countCoin[0]+countCoin[1]);
	var probObs = [countCoin[0]/total,countCoin[1]/total];
	coinData[0].data[0].value = probObs[0];
	coinData[0].data[1].value = probObs[1];
	coinData[1].data[0].value = probTheo[0];
	coinData[1].data[1].value = probTheo[1];

	tipCoinObs.html(function(d) { return round(d.value,2)+' = '+round(d.value*total,0)+'/'+total;});
	tipCoinTheo.html(function(d,i) { return round(d.value,2);});

	states
	  .attr("transform", function(d) { return "translate(" + x0ScaleCoin(d.state) + "," + 0 + ")"; })
	  .attr("class", function(d) { return d.state; });
	  
	rects
	  .attr("width", x1ScaleCoin.rangeBand())
	  .attr("x", function(d) { return x1ScaleCoin(d.side); })
	  .attr("y", function(d) { return yScaleCoin(d.value); })
	  .attr("height", function(d) { return yScaleCoin(1-d.value); })
	  .attr("class", function(d) { return d.side; });

	sides
	  .attr("xlink:href", function(d,i) { return "../img/"+(d.side)+".png"; })
	  .attr("x", function(d) { return x1ScaleCoin(d.side); })
	  .attr("y", function(d) { return yScaleCoin(0)+2; })
	  .attr("width", x1ScaleCoin.rangeBand())
	  .attr("height", x1ScaleCoin.rangeBand());

	containerCoin.selectAll('g.Observed rect').each(function(){
		d3.select(this).on('mouseover', tipCoinObs.show).on('mouseout', tipCoinObs.hide);
	})
	containerCoin.selectAll('g.Theoretical rect').each(function(){
		d3.select(this).on('mousedown', function(d){tipCoinTheo.show(d,this)})
				 	  .on('mouseover', function(d){tipCoinTheo.show(d,this)})
					  .on('mouseout', tipCoinTheo.hide)
					  .call(dragCoin);
	})
	$('#barCoin').parent().on('mouseup', tipCoinTheo.hide);

}

//Determines outcome of coin flip and updates data
function flip(coin){
	var num = Math.random();
	if(num<probTheo[0]) {
		coin.css("background-image", "url(../img/head.png");
		countCoin[0] = countCoin[0] + 1;
	} else {
		coin.css("background-image", "url(../img/tail.png");
		countCoin[1] = countCoin[1] + 1;
	}
	updateCoin();
}

//Flip once
$('#flipOne').click(function() {
	var coin = $("#coin");
    coin.animatecss('blur-out', 500, function() {
    	coin.css("font-size", "50px");
    	flip(coin);
        coin.removeClass('blur-out');
    });
});

//Flip one-hundred times
$('#flipHundred').click(function() {
	var coin = $("#coin");
	var count = 0;
	var interval = setInterval(function() {
		coin.animatecss('blur-out', 15, function() {
	    	coin.css("font-size", "50px");
	    	flip(coin);
	        coin.removeClass('blur-out');
	    });
	   	if (++count === 100){
        	clearInterval(interval);
       	}    
	}, 15);
});


//Update SVG based on width of container
function drawCoin(){
    var width = d3.select('#barCoin').node().clientWidth;
    var height = 550;
    var padCoin = 80;

    //Update SVG
    svgCoin.attr("width", width).attr("height", height).call(tipCoinObs).call(tipCoinTheo);

    //Update Scales
    yScaleCoin.range([height-2*padCoin,0]);
	x0ScaleCoin.rangeRoundBands([0, width], .1);
	x1ScaleCoin.rangeRoundBands([0, x0ScaleCoin.rangeBand()], .4);

	//Update Container
	containerCoin.attr("transform", "translate(" + 0 + "," + (padCoin) + ")")

	//Update Axis
	axisCoin.attr("transform", "translate(" + 0 + "," + (height-padCoin+1) + ")").call(xAxisCoin);

	//Update Rectangles
	updateCoin();
}

//*******************************************************************************//
//Expectation
//*******************************************************************************//
//Constants
var probDie = [{p:1/6},{p:1/6},{p:1/6},{p:1/6},{p:1/6},{p:1/6}];
var countDie = [0,0,0,0,0,1];
var expectedData = [average(countDie)];

//Create SVG and SVG elements
var svgDie = d3.select("#barDie").append("svg");

//Create Container
var containerDie = svgDie.append("g").attr('class','Theoretical');

//yScale
var yScaleDie = d3.scale.linear().domain([0,1]);

//xScale
var xScaleDie = d3.scale.ordinal().domain([1,2,3,4,5,6]);

//xAxis
var xAxisDie = d3.svg.axis().scale(xScaleDie).orient("bottom").ticks(0);
var axisDie = svgDie.append("g").attr("class", "x axis");

//Drag function for coin bar chart
var dragDie = d3.behavior.drag()
         .origin(function(d,i) { return {x: 0, y: yScaleDie(d.p)};})  
         .on('drag', function(d,i) {
         						var y = Math.min(1,Math.max(0,yScaleDie.invert(d3.event.y)));
     							var oldV = probDie[i].p;
     							var change = y-oldV;
     							probDie.map(function(x,index){
											if(index==i) x.p=y;
											else {
												if(oldV==1) x.p= -change/5;
												else x.p= x.p-change*x.p/(1-oldV);
											}});
     							updateDie();
     							tipDie.show(d,this);
     							countDie = [0,0,0,0,0,0];
     							expectedData = [];
     							maxXExpected = 200;
     							expectation(expectedData,expectationCalc(probDie));
     						})

//Create Rects
var expectedRects = containerDie.selectAll("rect").data(probDie).enter().append("rect");

//Create Labels
var dieFaces = svgDie.select("g.axis").selectAll("g.tick").data(probDie).enter().append("image");

//Tool Tip
var tipDie = d3.tip().attr('id', 'tipDie').attr('class', 'd3-tip').offset([-10, 0]);

//Update Coin Bar Chart
function updateDie() {

  	tipDie.html(function(d,i) { return round(d.p,2);});


	expectedRects
			.attr("x",function(d,i) {return xScaleDie(i+1);})
			.attr("y",function(d,i) {return yScaleDie(d.p);})
			.attr("height",function(d,i) {return yScaleDie(1-d.p);})
			.attr("width",xScaleDie.rangeBand())
			.attr("id",function(d,i) {return i;})
			.on('mousedown', function(d){tipDie.show(d,this)})
			.on('mouseover', function(d){tipDie.show(d,this)})
			.on('mouseout', tipDie.hide)
			.call(dragDie);

	$('#barDie').parent().on('mouseup', tipDie.hide);

	svgDie.select(".axis").selectAll(".tick").remove();
	dieFaces
	      .attr("xlink:href", function(d,i) { return "../img/dice_"+(i+1)+".png"; })
	      .attr("x", function(d,i) {return xScaleDie(i+1)-1/4*xScaleDie.rangeBand();})
	      .attr("y", 0)
	      .attr("width", 3/2*xScaleDie.rangeBand())
	      .attr("height", 3/2*xScaleDie.rangeBand());
}

//Handles Die Roll
function roll(die){
	var num = Math.random();
	var cumProb = cumsum(probDie);
	if (num<cumProb[0]) {
		die.css("background-image", "url(../img/dice_1.png");
		countDie[0] = countDie[0] + 1;
	} else if (num<cumProb[1]) {
		die.css("background-image", "url(../img/dice_2.png");
		countDie[1] = countDie[1] + 1;
	} else if (num<cumProb[2]) {
		die.css("background-image", "url(../img/dice_3.png");
		countDie[2] = countDie[2] + 1;
	} else if (num<cumProb[3]) {
		die.css("background-image", "url(../img/dice_4.png");
		countDie[3] = countDie[3] + 1;
	} else if (num<cumProb[4]) {
		die.css("background-image", "url(../img/dice_5.png");
		countDie[4] = countDie[4] + 1;
	} else {
		die.css("background-image", "url(../img/dice_6.png");
		countDie[5] = countDie[5] + 1;
	}
	updateDie();
	expectedData.push(average(countDie));
	expectation(expectedData,expectationCalc(probDie));
}

$('#rollOne').click(function() {
	var die = $("#die");
    die.animatecss('blur-out', 500, function() {
    	die.css("font-size", "30px");
    	roll(die);
        die.removeClass('blur-out');
    });
});

$('#rollHundred').click(function() {
	var die = $("#die");
	var count = 0;
	var interval = setInterval(function() {
		die.animatecss('blur-out', 15, function() {
	    	die.css("font-size", "30px");
	    	roll(die);
	        die.removeClass('blur-out');
	    });
	    if (++count === 100){
        clearInterval(interval);
       	}   
	}, 15);
});

//Cumulative Sum function for array
function cumsum(array){
	var resultArray = [];
	array.reduce(function(a,b,i) { return resultArray[i] = a+b.p; },0);
	return resultArray;
}
//Returns total samples and average at that point
function average(data) {
	var total = data.reduce(function(a, b){return a+b;},0);
	var sum = data.reduce(function(a, b, i){return a+b*(i+1);},0);
	return [total,sum/total]; 
}
//Returns expectation of die based on probability
function expectationCalc(data) {
	return data.reduce(function(a, b, i){return a+b.p*(i+1);},0);
}
//Returns probability from count data
function countToProb(data) {
	var total = Math.max(1,data.reduce(function(a, b){return a+b;},0));
	return data.map(function(x){return x/total;});
}

//Expectation SVG and elements
var maxXExpected = 200;
var expectedPlot = d3.select("#plotDie").append("svg");
var xaxisDie = expectedPlot.append("g").attr("class", "x axis");
var xaxisTextDie = expectedPlot.append("text").attr("text-anchor", "middle").text("Number of Rolls");
var yaxisDie =expectedPlot.append("g").attr("class", "y axis");
var yaxisTextDie = expectedPlot.append("text").attr("text-anchor", "middle").text("Value");
var pathExpected = expectedPlot.append("path").attr("id", "expected");
var pathActual = expectedPlot.append("path").attr("id", "actual");
    
//X scale 
var xScaleExpected = d3.scale.linear().domain([1, maxXExpected]);

//Y Scale
var yScaleExpected = d3.scale.linear().domain([1, 6]);

//Define X axis
var xAxisExpected = d3.svg.axis().scale(xScaleExpected).orient("bottom").ticks(3);
//Define Y axis
var yAxisExpected = d3.svg.axis().scale(yScaleExpected).orient("left").ticks(6);


//Update error plot
function expectation(data, prob){
	var line = d3.svg.line()
	  .x(function(d) { return xScaleExpected(d[0])})
	  .y(function(d) { return yScaleExpected(d[1])})
	  .interpolate("linear");
	if(data.length>maxXExpected*0.9){
		maxXExpected = maxXExpected*1.5;
	}
	xScaleExpected.domain([1,maxXExpected]);
	expectedPlot.select(".x.axis")
			.transition()
			.call(xAxisExpected.ticks(3));
	pathExpected
	  .datum(data)
	  .attr("d", line);
	pathActual
	  .datum([[1,prob],[maxXExpected,prob]])
	  .style("stroke-dasharray", ("5, 5"))
	  .attr("d", line);
}

//Tool tip on expectation chart...
var tipDieFocus = d3.tip().attr('id', 'tipDieFocus').attr('class', 'd3-tip').offset([0, 10]).direction('e');

var focus = expectedPlot.append("g").style("display", "none");

focus.append("rect").attr("y", 0).style('fill','white').style('opacity','0.75');

focus.append("line").attr('id','focusLine').style("stroke-dasharray", ("2, 2"));

focus.append("circle").attr("r", 5).attr('id','expectedCircle');

focus.append("circle").attr("r", 5).attr('id','averageCircle');


expectedPlot.on("mouseover", mousemove).on("mouseout", mousemove).on("mousemove", mousemove);

function mousemove() {
	var x = round(xScaleExpected.invert(d3.mouse(this)[0]),0);
	var y = yScaleExpected.invert(d3.mouse(this)[1]);
	if (x>0 && x<expectedData.length+1 && y>=1 && y<=6) {
		focus.style("display", null)
	    var y = expectedData[x-1][1];
	    focus.select('#expectedCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(expectationCalc(probDie)));
	    focus.select('#averageCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(y));
	    focus.select('rect').attr("x", xScaleExpected(x)).attr("height",yScaleExpected(1)-1).attr("width", xScaleExpected(maxXExpected - x));
	    focus.select('line').attr("x1", xScaleExpected(x)).attr("y1", yScaleExpected(6)).attr("x2", xScaleExpected(x)).attr("y2", yScaleExpected(1));
	    xaxisDie.call(xAxisExpected.tickValues([x]));
		tipDieFocus.html(function(d) { return 'Average: <span id="avgFocus">'+round(y,2)+'</span><br>'+
												'Expectation: <span id="expFocus">'+round(expectationCalc(probDie),2)+'</span>';});
	    tipDieFocus.show(document.getElementById("expectedCircle"));
	} else {
		focus.style("display", "none");
		tipDieFocus.hide();
		xaxisDie.call(xAxisExpected.tickValues(null));
	}
}

//Update SVG based on width of container
function drawDie(){
	//Constants Bar Die
    var width = d3.select('#barDie').node().clientWidth;
    var height = 150;
    var padDie = 20;

    //Update SVG
    svgDie.attr("width", width).attr("height", height).call(tipDie);

    //Update Scales
	yScaleDie.range([height-2*padDie, 0]);
	xScaleDie.rangeRoundBands([0, width - 2*padDie], .5);

	//Update Container and Axis
	axisDie.attr("transform", "translate(" + padDie + "," + (height-2*padDie+1) + ")").call(xAxisDie);
	containerDie.attr("transform", "translate(" + padDie + ","+0+")");

	//Update Rects
	updateDie();

	//Constants Expectation Die
    var w = d3.select('#plotDie').node().clientWidth;
    var h = 550;
    var padExp = 35;

    //Update SVG
	expectedPlot.attr("width", w).attr("height", h).style("cursor",	"crosshair").call(tipDieFocus);

	//Update Scales
	xScaleExpected.range([padExp, (w - padExp)]);
	yScaleExpected.range([(h - padExp), padExp]);

	//Update Axis
	xaxisDie.attr("transform", "translate(0," + (h - padExp) + ")").call(xAxisExpected);
	yaxisDie.attr("transform", "translate(" + padExp + ",0)").call(yAxisExpected);

	//Update Labels
	xaxisTextDie.attr("transform", "translate("+ (w/2) +","+(h)+")")
	yaxisTextDie.attr("transform", "translate("+ (padExp/4) +","+(h/2)+")rotate(-90)")

	//Update Paths
	expectation(expectedData,expectationCalc(probDie));
}


//*******************************************************************************//
//Estimator
//*******************************************************************************//
var m = 0;
var n = 0;
var width = 500;
var height = 500;

var chart = d3.select("#estSvg")
				.append("canvas")
				.attr("width", width)
				.attr("height", height);

var context = chart.node().getContext("2d");

function drawCanvas() {
  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.rect(0,0,width,height);
  context.stroke();
  context.beginPath();
  context.fillStyle = "rgba(100,189,255,0.6)";
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
	context.fillStyle = "rgba(0,208,161,1)";
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
	$('#varValue').html(Math.pow((currentEstimate-Math.PI),2).toExponential(2));
	$('#mseValue').html(Math.pow((currentEstimate-Math.PI),2).toExponential(2));
}



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

$('#properties').on('change', function(e){
    var checked = document.querySelector('input[name = "estProp"]:checked')
    var prop = checked.value
    d3.selectAll('.estProperties').each(function() {
			this.style.display = 'none';
	});
	d3.selectAll('.error').each(function() {
			this.style.strokeWidth = 0;
	});
	$('#'+prop + '.estProperties').toggle();
	$('#'+prop + '.error').css('stroke-width','2px');
})

