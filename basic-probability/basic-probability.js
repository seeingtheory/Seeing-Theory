
//Handles functionality of Probability
$(window).load(function () {
    chance();
    expectation();
    variance();
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

//Cumulative Sum function for array
function cumsum(array){
	var resultArray = [];
	array.reduce(function(a,b,i) { return resultArray[i] = a+b.p; },0);
	return resultArray;
}


//*******************************************************************************//
//Chance Events
//*******************************************************************************//
function chance() {
	//Constants
	var probTheo = [0.5,0.5];
	var countCoin = [0,0];
	var coinData = [{data:[{value:countCoin[0],side:'head'},{value:countCoin[1],side:'tail'}],state:'Observed outcomes'},
					{data:[{value:probTheo[0],side:'head'},{value:probTheo[1],side:'tail'}],state:'True probabilities'}];

	//Create SVG
	var svgCoin = d3.select("#barCoin").append("svg");

	//Create Container
	var containerCoin = svgCoin.append('g');

	//Create Scales
	var yScaleCoin = d3.scale.linear().domain([0,1]);
	var x0ScaleCoin = d3.scale.ordinal().domain(['Observed outcomes','True probabilities']);
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
	     								updateCoin(0);
	     								})

	//Create SVG Elements
	var states = containerCoin.selectAll("g.state").data(coinData).enter().append("g").attr("class", "state");

	var rects = states.selectAll("rect").data(function(d) { return d.data; }).enter().append("rect");

	var sides = states.selectAll("image").data(function(d) { return d.data; }).enter().append("image").attr("class", "coin");

	var axisCoin = svgCoin.append("g").attr("class", "x axis");

	var xAxisCoin = d3.svg.axis().scale(x0ScaleCoin).orient("bottom").ticks(0);


	//Create tool tips for observed and expected
	var tipCoinObs = d3.tip().attr('id', 'tipCoinObs').attr('class', 'd3-tip').offset([-10, 0]);
	var tipCoinTheo = d3.tip().attr('id','tipCoinTheo').attr('class', 'd3-tip').offset([-10, 0]);

	//Update rectangles and text
	function updateCoin(t) {
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
		  
		rects.transition().duration(t)
		  .attr("width", x1ScaleCoin.rangeBand())
		  .attr("x", function(d) { return x1ScaleCoin(d.side); })
		  .attr("y", function(d) { return yScaleCoin(d.value); })
		  .attr("height", function(d) { return yScaleCoin(1-d.value); })
		  .attr("class", function(d) { return d.side; });

		sides
		  .attr("xlink:href", function(d,i) { return "./img/"+(d.side)+".png"; })
		  .attr("x", function(d) { return x1ScaleCoin(d.side) + x1ScaleCoin.rangeBand() / 6; })
		  .attr("y", function(d) { return yScaleCoin(0) + 20; })
		  .attr("width", x1ScaleCoin.rangeBand() * 2 / 3)
		  .attr("height", x1ScaleCoin.rangeBand() * 2 / 3);

		containerCoin.selectAll('g.Observed rect').each(function(){
			d3.select(this).on('mouseover', tipCoinObs.show).on('mouseout', tipCoinObs.hide);
		})
		containerCoin.selectAll('g.True rect').each(function(){
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
			coin.css("background-image", "url(./img/head.png");
			countCoin[0] = countCoin[0] + 1;
		} else {
			coin.css("background-image", "url(./img/tail.png");
			countCoin[1] = countCoin[1] + 1;
		}
		updateCoin(100);
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
	    var padCoin = 100;

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
		updateCoin(0);
	}
	drawCoin()
	$(window).on("resize", drawCoin);
}

//*******************************************************************************//
//Expectation
//*******************************************************************************//
function expectation() {
	//Constants
	var probDie = [{p:1/6},{p:1/6},{p:1/6},{p:1/6},{p:1/6},{p:1/6}];
	var countDie = [0,0,0,0,0,1];
	var expectedData = [average(countDie)];

	//Create SVG and SVG elements
	var svgDie = d3.select("#barDie").append("svg");

	//Create Container
	var containerDie = svgDie.append("g").attr('class','True');

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
		      .attr("xlink:href", function(d,i) { return "./img/dice_"+(i+1)+".png"; })
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
			die.css("background-image", "url(./img/dice_1.png");
			countDie[0] = countDie[0] + 1;
		} else if (num<cumProb[1]) {
			die.css("background-image", "url(./img/dice_2.png");
			countDie[1] = countDie[1] + 1;
		} else if (num<cumProb[2]) {
			die.css("background-image", "url(./img/dice_3.png");
			countDie[2] = countDie[2] + 1;
		} else if (num<cumProb[3]) {
			die.css("background-image", "url(./img/dice_4.png");
			countDie[3] = countDie[3] + 1;
		} else if (num<cumProb[4]) {
			die.css("background-image", "url(./img/dice_5.png");
			countDie[4] = countDie[4] + 1;
		} else {
			die.css("background-image", "url(./img/dice_6.png");
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

	focus.append("circle").attr("r", 5).attr('class','expectedCircle').attr('id','expectedCircle');

	focus.append("circle").attr("r", 5).attr('class','averageCircle');


	expectedPlot.on("mouseover", mousemove).on("mouseout", mousemove).on("mousemove", mousemove);

	function mousemove() {
		var x = round(xScaleExpected.invert(d3.mouse(this)[0]),0);
		var y = yScaleExpected.invert(d3.mouse(this)[1]);
		if (x>0 && x<expectedData.length+1 && y>=1 && y<=6) {
			focus.style("display", null)
		    var y = expectedData[x-1][1];
		    focus.select('.expectedCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(expectationCalc(probDie)));
		    focus.select('.averageCircle').attr("cx", xScaleExpected(x)).attr('cy',yScaleExpected(y));
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
	    var height = 200;
	    var padDie = width/20;

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
	drawDie();
	$(window).on("resize", drawDie);
}

//*******************************************************************************//
//Variance
//*******************************************************************************//

function variance() {
	// 1: Set up dimensions of SVG
	var margin = {top: 40, right: 60, bottom: 40, left: 20},
		width = 650 - margin.left - margin.right,
		height = 650 - margin.top - margin.bottom;

	// 2: Create SVG
	var svg = d3.select("#varSvg").append("svg")
	    .attr("width", "100%")
	    .attr("height", "100%")
	    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
	    .attr("preserveAspectRatio", "xMidYMid meet")
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// 3: Scales
	var n = 10;
	var x = d3.scale.linear()
		.domain([0, n - 1])
	    .range([0, width]);
	var y = d3.scale.linear()
		.domain([1, n])
	    .range([height, 0]);


	// 4: Axes
	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(n);

	// 5: Graph
	svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(0,0)")
	  .call(yAxis);

	// 6: Axes Labels          
	svg.append("text")
	  .attr("text-anchor", "middle")
	  .attr("transform", "translate(" + margin.left / -2 + "," + height / 2 + ")rotate(-90)")
	  .text("Value");

	// Add number labels
	svg.append("text")
	  .attr("class", "label")
	  .attr("text-anchor", "middle")
	  .attr("transform", "translate(" + (3 * width / 4) + "," + (height / 4) + ")");
	svg.append("text")
	  .attr("class", "label")
	  .attr("text-anchor", "middle")
	  .attr("transform", "translate(" + (3 * width / 4) + "," + (3 * height / 4) + ")");

	// Add square labels
	svg.append("text")
	  .attr("text-anchor", "middle")
	  .attr("transform", "translate(" + (width + margin.right / 2) + "," + (height / 4) + ")")
	  .text("Average");
	svg.append("text")
	  .attr("text-anchor", "middle")
	  .attr("transform", "translate(" + (width + margin.right / 2) + "," + (3 * height / 4) + ")")
	  .text("Variance");    


	//Returns expectation and standard deviation of random variable given pmf
	function parameters(pmf) {
		var mu = pmf.reduce(function(a, b, i){return a+b.p*(i+1);},0),
			std = Math.sqrt(pmf.reduce(function(a, b, i){return a+b.p*Math.pow(i+1 - mu,2);},0));
		return [mu,std];
	}

	var time = 1000;
	var prob = [{p:1/10},{p:1/10},{p:1/10},{p:1/10},{p:1/10},
				{p:1/10},{p:1/10},{p:1/10},{p:1/10},{p:1/10}];
	var deck = [1,1,1,1,1,1,1,1,1,1];
	var count = [];

	//7: Join, Update, Enter, Exit
	function update(delay) {

		var n = count.length,
			p = parameters(prob),
			mu = p[0],
			std = p[1],
			sse = count.reduce(function(a, b){return a + Math.pow(b - mu, 2);},0);

		// variance square
		var variance = svg.selectAll("rect.variance")
		  .data([std]);
		variance.enter().append("rect")
		  .attr("class", "variance")
		  .style("fill-opacity", 0.5)
		  .style("fill", "#64bdff")
		  .style("stroke", "#64bdff")
		  .style("stroke-width", 3)
		variance.transition()
		  .attr("x", function(d) { return (3 * width / 4) - x(d / 2); })
		  .attr("y", function(d) { return (3 * height / 4) - x(d / 2); })
		  .attr("width", function(d) { return x(d); })
		  .attr("height", function(d) { return x(d); })

		// average square
		var average = svg.selectAll("rect.average")
		  .data([(!n ? 0 : Math.sqrt(sse / n))]);
		average.enter().append("rect")
		  .attr("class", "average")
		  .style("fill-opacity", 0.5)
		  .style("fill", "#00d0a1")
		  .style("stroke", "#00d0a1")
		  .style("stroke-width", 3)
		average.transition()
		  .delay(delay)
		  .attr("x", function(d) { return (3 * width / 4) - x(d / 2); })
		  .attr("y", function(d) { return (1 * height / 4) - x(d / 2); })
		  .attr("width", function(d) { return x(d); })
		  .attr("height", function(d) { return x(d); })

		// value labels
		svg.selectAll("text.label")
		  .data([round(sse/n,2), round(Math.pow(std,2),2)])
		  .text(function(d) { return d; })
		  .moveToFront();

		// Mean dot
		var mean = svg.selectAll("circle.expectedCircle")
		  .data([mu]);
		mean.enter().append("circle")
		  .attr("r", 5)
		  .attr("class", "expectedCircle");
		mean.transition()
		  .attr("cx", x(0))
		  .attr("cy", y(mu));

	}

	function sample(data, delay) {

		var n = count.length,
			p = parameters(prob),
			mu = p[0],
			std = p[1],
			sse = count.reduce(function(a, b){return a + Math.pow(b - mu, 2);},0);

		// Add sample
		svg.append("circle")
		  .data(data)
		  .attr("cx", x(0))
		  .attr("cy", function(d) { return y(d); })
		  .attr("r", 5)
		  .attr("class", "averageCircle")
		  .transition()
		  .duration(delay)
		  .remove();

		// Add sample square error
		svg.append("rect")
		  .data(data)
		  .attr("x", x(0))
		  .attr("y", function(d) { return y(Math.max(mu, d)); })
		  .attr("width", function(d) { return x(Math.abs(mu - d)); })
		  .attr("height", function(d) { return x(Math.abs(mu - d)); })
		  .style("fill-opacity", 0.25)
		  .style("fill", "#00d0a1")
		  .style("stroke", "#00d0a1")
		  .style("stroke-width", 1)
		  .moveToBack()
		  .transition()
		  	.delay(delay)
		    .attr("x", function(d) { return (3 * width / 4) - x(Math.sqrt(sse / n) / 2); })
		    .attr("y", function(d) { return (1 * height / 4) - x(Math.sqrt(sse / n) / 2); })
		    .attr("width", function(d) { return x(Math.sqrt(sse / n)); })
		  	.attr("height", function(d) { return x(Math.sqrt(sse / n)); })
		    .remove();
	}

	function draw(card, delay){
		var num = Math.random(),
			cumProb = cumsum(prob),
			index = cumProb.findIndex(function(v) { return num < v; });
		card.css("background-image", "url(./img/card_".concat(index + 1).concat(".png)"));
		count.push(index + 1);
		sample([index + 1], delay);
		update(delay);
	}


	$('#drawOne').click(function() {
		var card = $("#card");
	    card.animatecss('blur-out', 500, function() {
	    	draw(card, 1000);
	        card.removeClass('blur-out');
	    });
	});

	$('#drawHundred').click(function() {
		var card = $("#card");
		var count = 0;
		var interval = setInterval(function() {
			card.animatecss('blur-out', 15, function() {
		    	draw(card, 0);
		        card.removeClass('blur-out');
		    });
		    if (++count === 100){
	        clearInterval(interval);
	       	}   
		}, 15);
	});

	$('.deck').change(function() {
		var card = this.value;
		deck[card - 1] = !this.checked;
		count = [];
		uniform();
		update(0);
	});

	function uniform() {
		var n = Math.max(1, deck.reduce(function(a, b) { return a + b; }, 0));
		deck.map(function(d,i){ prob[i].p = d/n; });
	}


	update(0);
}