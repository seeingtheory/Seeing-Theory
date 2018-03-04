//Handles functionality of Compound Probability
$(window).load(function () {
  conditional();
  counting();
  set();
});

//*******************************************************************************//
//Set Theory
//*******************************************************************************//
function set() {
  //Constants
  var selectedSet = "";
  var currentSet = [];
  var setData =  [{name: 'A', cx: 0.5 - 0.1*Math.sqrt(3), cy: 0.4, r: 0.25},
                  {name: 'B', cx: 0.5 + 0.1*Math.sqrt(3), cy: 0.4, r: 0.25},
                  {name: 'C', cx: 0.5, cy: 0.7, r: 0.25},
                  {name: 'U', cx: 0.5, cy: 0.5, r: 0.5}];


  //Create SVG
  var svgSet = d3.select("#svgSet").append("svg");

  //Create Container
  var containerSet = svgSet.append('g');
  var legend = svgSet.append('g');
    
  //Create Scales
  var xScaleSet = d3.scale.linear().domain([0, 1]);
  var yScaleSet = d3.scale.linear().domain([0, 1]);
  var rScaleSet = d3.scale.linear().domain([0, 0.5]);

  //Drag functions (Currently Both Disabled until I can figure out how to make them work with highlight function)
  var dragCircles = d3.behavior.drag()
           .origin(function() { return {x: d3.select(this).attr("cx"), y: d3.select(this).attr("cy")};})
           .on('dragstart', function(){d3.select(this.parentNode).moveToFront();}) 
           .on('drag', function(d,i) {
              var r = setData[i].r
              var x = xScaleSet.invert(d3.event.x);
              var y = yScaleSet.invert(d3.event.y);
              var center = withinBounds(x,y,r);
              setData[i].cx = center[0];
              setData[i].cy = center [1];
              updateCircles();
              intersection();}) 
  var dragRadius = d3.behavior.drag()
          .on('dragstart', function(){d3.select(this.parentNode).moveToFront();}) 
          .on('drag', function(d,i) {
                    var x1 = xScaleSet.invert(d3.event.x);
                    var y1 = yScaleSet.invert(d3.event.y);
                    var x2 = setData[i].cx;
                    var y2 = setData[i].cy;
                    var r = Math.min(0.5,distancePoints(x1,y1,x2,y2));
                    var center = withinBounds(x2,y2,r);
                    setData[i].cx = center[0];
                    setData[i].cy = center [1];
                    setData[i].r = r;
                    updateCircles();
                    intersection();})

  //Create sections for highlight
  containerSet.append("rect").attr("clip-path", "url(#U)").attr("class", "section").attr("id", "set8");

  containerSet.append("rect").attr("clip-path", "url(#A)").attr("class", "section").attr("id", "set1");

  containerSet.append("rect").attr("clip-path", "url(#B)").attr("class", "section").attr("id", "set2");

  containerSet.append("rect").attr("clip-path", "url(#C)").attr("class", "section").attr("id", "set3");

  containerSet.append("g").attr("clip-path", "url(#A)")
              .append("rect").attr("clip-path", "url(#C)").attr("class", "section").attr("id", "set4");

  containerSet.append("g").attr("clip-path", "url(#A)")
              .append("rect").attr("clip-path", "url(#B)").attr("class", "section").attr("id", "set5");

  containerSet.append("g").attr("clip-path", "url(#B)")
              .append("rect").attr("clip-path", "url(#C)").attr("class", "section").attr("id", "set6");

  containerSet.append("g").attr("clip-path", "url(#A)")
              .append("g").attr("clip-path", "url(#B)")
              .append("rect").attr("clip-path", "url(#C)").attr("class", "section").attr("id", "set7");


  //SVG elements
  var eventsSet = containerSet.selectAll('g.event').data(setData).enter().append('g').attr('class', 'event');

  var circlesSet = eventsSet.append('circle').attr('class', function(d){ return (d.name + ' circle') }).call(dragCircles);

  var radiusSet = eventsSet.append('circle').attr('class', function(d){ return (d.name + ' radius') }).call(dragRadius);

  var clipSet = eventsSet.append("clipPath").attr("id", function(d){ return (d.name) }).append("circle");

  var legendSet = legend.selectAll("g.legend").data(setData).enter().append("g").attr("class", "legend");

  var legendRect = legendSet.append("rect").attr('class',function(d,i){ return (i!=3 ? d.name : "set") + ' legendBox'; });

  var legendText = legendSet.append("text").attr("text-anchor", "start");


  function updateCircles() {
    circlesSet
      .attr('cx', function(d){ return xScaleSet(d.cx) })
      .attr('cy', function(d){ return yScaleSet(d.cy) })
      .attr('r', function(d){ return rScaleSet(d.r) });

    radiusSet
      .attr('cx', function(d){ return xScaleSet(d.cx) })
      .attr('cy', function(d){ return yScaleSet(d.cy) })
      .attr('r', function(d){ return rScaleSet(d.r) });

    clipSet
      .attr('cx', function(d){ return xScaleSet(d.cx) })
      .attr('cy', function(d){ return yScaleSet(d.cy) })
      .attr('r', function(d){ return rScaleSet(d.r) });

    legendSet.attr("transform", function(d, i) { return "translate(0," + (2 + i * 22) + ")"; });

    legendRect.attr("x", 3).attr("width", 17).attr("height", 17);

    legendText.attr("x", 27).attr("y", 9).attr("dy", ".35em").text(function(d,i) { return i!=3 ? d.name : selectedSet; });
  }

  //Calculate the distance between two points
  function distancePoints(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  }
  //Determines center of circle so it is within universe bounds
  function withinBounds(x,y,r) {
    var xCenter,yCenter;
    var distCenter = distancePoints(x,y,0.5,0.5);
    if (distCenter+r<=0.5){
      xCenter = x;
      yCenter = y;
    } else {
      var ratio = (0.5-r)/distCenter;
      xCenter = ratio*(x-0.5)+0.5;
      yCenter = ratio*(y-0.5)+0.5;
    };
    return [xCenter,yCenter];
  };

  //Draws SVG and updates based on width of page
  function drawSet() {
    var w = d3.select('#svgSet').node().clientWidth;
    var h = 550;
    var padding = 15;
    var size = Math.min(w*0.8,h);

    //Update svg size
    svgSet.attr("width", w).attr("height", h);

    //Update Scale Range
    xScaleSet.range([padding/2,size-padding/2]);
    yScaleSet.range([padding/2,size-padding/2]);
    rScaleSet.range([0,size/2-padding/2]);

    //Update Container
    containerSet.attr("transform", "translate(" + 0.1*w + "," + (h-size)/2 + ")");
    legend.attr("transform", "translate(" + 0 + "," + (h-size)/2 + ")");

    //Update Rectangles
    d3.selectAll('.section').each(function(x){
      d3.select(this).attr('width',size).attr('height',size);
    })

    //Update Circles
    updateCircles();
    intersection();
  }

  //Fills the corresponding sections of current set
  function intersection(){
    for (var i = 1; i <= 8; i++) {
      var fill;
      if (currentSet.indexOf(i) != -1)  fill = '#FFFF00';
      else                              fill = '#FFFFFF';
      d3.select('#set'+i).style('fill',fill);                             
    };
  }

  //Add Splice functionality to Strings
  function strSplice(s) {
      return function splice() {
          var a = s.split('');
          Array.prototype.splice.apply(a, arguments);
          return a.join('');
      };
  }

  //Handle button press for set builder
  d3.selectAll(".setItem").on("click", function(d,i){
    var set = $("#set");
    set.html(set.html()+this.innerHTML);
  });

  //Delete function
  $('#delete').on('click', function() {
    var set = $("#set");
    set.html(strSplice(set.html())(set.html().length-1, 1, ''));
  });


  //Reset function
  $('#reset').on('click', function() {
    currentSet = [];
    selectedSet = "";
    $("#set").html('');
    updateCircles();
    intersection();
  });

  //Handle Submit Button
  $('#submit').on('click', function() {
    var set = $("#set").html();
    try {
      currentSet = parse(set);
      selectedSet = set;
      $("#set").html('');
      $('#invalidSet').html('');
    } catch (e) {
      $("#set").html('');
      $('#invalidSet').html("Invalid set notation: " + e.message);
    }
    updateCircles();
    intersection();
  })

  //union of two arrays
  function union(set1,set2){
    var total = set1.concat(set2);
    var union = total.filter(function (item, pos) {return total.indexOf(item) == pos});
    return union;
  }

  //intersect of two arrays
  function intersect(set1,set2){
    var total = set1.concat(set2);
    var intersect = total.filter(function (item, pos) {return total.indexOf(item) != pos});
    return intersect;
  }

  //complement of one array
  function complement(set1){
    var universe = [1,2,3,4,5,6,7,8]
    var complement = universe.filter(function (item, pos) {return set1.indexOf(item) == -1});
    return complement;
  }

  //Define Error Message
  function setError(found, expected, index) {
     this.message = 'Found ' + found + ', but expected ' + expected;
     this.value = found!=undefined ? found : '&emsp;';
     this.index = index;
  }

  //Classes for Set Parser

  class Event { 
    constructor(operator) {
      this.operator = operator;
      this.array = [];
    }
    
    evaluate() {
      return this.operator.evaluate(this.array);
    }
  }

  class AEvent extends Event {
    constructor(operator) {
      super(operator);
      this.array = [1,4,5,7]
    }
  }
  class BEvent extends Event {
    constructor(operator) {
      super(operator);
      this.array = [2,5,6,7]
    }
  }
  class CEvent extends Event {
    constructor(operator) {
      super(operator);
      this.array = [3,4,6,7]
    }
  }
  class OEvent extends Event {
    constructor(operator) {
      super(operator);
      this.array = []
    }
  }
  class UEvent extends Event {
    constructor(operator) {
      super(operator);
      this.array = [1,2,3,4,5,6,7,8]
    }
  }

  class beginEvent extends Event {
    constructor(EventHelper, operator) {
      super(operator)
      this.EventHelper = EventHelper;
    }
    evaluate() {
      return this.operator.evaluate(this.EventHelper.evaluate());
    }
  }


  class EventHelper { 
    constructor(Event) {
      this.Event = Event;
    }
    
    evaluate() {
      return this.Event.evaluate();
    }
  }


  class Operator { 
    constructor() {}
    
    evaluate(array) {}
  }

  class Identity extends Operator {
    evaluate(array) { return array }
  }

  class Union extends Operator {
    constructor(Event){
      super();
      this.Event = Event;
    }
    evaluate(array) { 
      return union(array,this.Event.evaluate()) 
    }
  }

  class Intersect extends Operator {
    constructor(Event){
      super();
      this.Event = Event;
    }
    evaluate(array) { 
      return intersect(array,this.Event.evaluate()) 
    }
  }

  class Complement extends Operator {
    constructor(operator){
      super();
      this.operator = operator;
    }
    evaluate(array) { 
      return this.operator.evaluate(complement(array)) 
    }
  }

  //Parse Functions
  var index;

  function parse (set) {
    index = -1;
    var iter = set[Symbol.iterator]();
    var parseTree = parseEvent(iter);
    return parseTree.evaluate();
  }

  function parseEvent(iter) {
    var nextValue = iter.next().value;
    index++;
    if (nextValue=='A')           return new AEvent(parseOperator(iter));
    else if (nextValue=='B')      return new BEvent(parseOperator(iter));
    else if (nextValue=='C')      return new CEvent(parseOperator(iter));
    else if (nextValue=='\u2205') return new OEvent(parseOperator(iter));
    else if (nextValue=='U')      return new UEvent(parseOperator(iter));
    else if (nextValue=='(')      return new beginEvent(parseEventHelper(iter),parseOperator(iter));
    else                          throw new setError(nextValue, 'A,B,C,&empty;,U,(', index)
  }

  function parseEventHelper(iter) {
    var Event = parseEvent(iter);
    return new EventHelper(Event);
  }

  function parseOperator(iter) {
    var next = iter.next();
    index++;
    var nextValue = next.value;
    var done = next.done;
    if (nextValue=='\u222A')          return new Union(parseEvent(iter));
    else if (nextValue == '\u2229')   return new Intersect(parseEvent(iter));
    else if (nextValue=="'")          return new Complement(parseOperator(iter));
    else if (nextValue == ')' || done)return new Identity();
    else                              throw new setError(nextValue, "&cup;,&cap;,',)", index)
  }

  drawSet();
  $(window).on("resize", drawSet);
}
//*******************************************************************************//
//Combinatorics
//*******************************************************************************//
function counting() {
  //Adapted from: https://bl.ocks.org/mbostock/4339083

  // Set up dimensions of SVG
  var margin = {top: 40, right: 40, bottom: 40, left: 40},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  //Create SVG
  var svgComb = d3.select("#svgComb").append("svg")
    .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Constants
  var i = 0,
      dur = 750,
      combinations = false,
      size = 4,
      number = 4,
      distNodes = 1,
      root = [];

  //Create Container
  var containerComb = svgComb.append("g");

  //Create Tree Layout
  var tree = d3.layout.tree()
    .size([height, width]);

  //Diagonal function
  var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });


  //Initiates a tree of certain depth
  function drawTree(level) {
    var source = {name:"", children:[]};
    var colors = ['A','B','C','D'];
    distNodes = tree.size()[1]/Math.max(1,size);

    //Creates JSON object of all possible permutations without replacement of first 
    //'num' number of elemenets from 'color'.  This is a recursive implementation.
    function permutationCalc(obj,num,color) {
      for (var i = 0; i < num; i++) {
        obj.children.push({name:obj.name+color[i], children:[]})
      }
      obj.children.map(function(x,i){
        var remainingColor = color.slice()
        remainingColor.splice(i, 1);
        permutationCalc(x,num-1,remainingColor)});
      return obj;
    }

    root = permutationCalc(Object.assign({}, source),size,colors);
    root.x0 = tree.size()[0] / 2;
    root.y0 = 0;

    //Hides all children below depth
    function collapse(d, depth) {
      if (d.children && depth>=number) {
        d._children = d.children;
        d._children.forEach(function(x){collapse(x,depth+1)});
        d.children = null;
      } else {
        d.children.forEach(function(x){collapse(x,depth+1)});
      }
      d._top = true;
    }
    collapse(root,level);
    update(0);
  }


  //ReDraws Tree Layout
  function update(duration) {

    // Compute the new tree layout nodes.
    var nodes = tree.nodes(root).reverse();

    //Update nodes.x and nodes.x0 for combinations
    function removeRepeats(nodeArray) {
      var hashmap = new Map();
      nodeArray.map(function(x){
        var key = hashAnagram(x.name);
        if(hashmap.has(key)) {
          var value = hashmap.get(key);
          value.push(x);
          hashmap.set(key,value);
        } else {
          hashmap.set(key,[x]);
        }
      });
      hashmap.forEach(function (value,key) {
        var len = value.length;
        var avgX = value.reduce(function(a,b){return a+b.x},0)/len;
        var avgX0 = value.reduce(function(a,b){return a+b.x0},0)/len;
        value.map(function(x,i){
          if(i!=len-1) x._top = false
          x.x = avgX; 
          x.x0 = avgX0;
          //Hard coded for overlap when size is four
          if(key==hashAnagram('AD')) x.x-=10;
          if(key==hashAnagram('BC')) x.x+=10;
        });
      });
    };
    if(combinations) removeRepeats(nodes);
    else             nodes.map(function(x){ x._top = true;});

    //Compute new tree layout Links.
    var links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * distNodes; });

    // Update the nodes…
    var node = containerComb.selectAll("g.node")
        .data(nodes, function(d) { return d.name });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d,i) { 
          if(typeof(d.parent)!='undefined')  return "translate(" + d.parent.y0 + "," + d.parent.x0 + ")";
          else      return  "translate(" + d.y0 + "," + d.x0 + ")";
        });


    nodeEnter.each(function(d,i) {
      for (var j = d.name.length - 1; j >= 0; j--) {
        d3.select(this).append("circle")
            .attr("r", 1e-6)
            .attr("cx",j*9)
            .attr('class',d.name[j]);
      };
    });

    nodeEnter.append("text")
        .attr("x", -10)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d.name })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.selectAll("circle").each(function(){
      d3.select(this).attr("r", 4.5);
    });

    nodeUpdate.select("text")
        .style("fill-opacity", function(d) { return d._top ? 1 : 1e-6; });

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d,i) { 
          if(typeof(d.parent)!='undefined')  return "translate(" + d.parent.y + "," + d.parent.x + ")";
          else      return  "translate(" + d.y + "," + d.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = containerComb.selectAll("path.link")
        .data(links, function(d) { return d.target.name; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
          var o = {x: d.source.x0, y: d.source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
          var o = {x: d.source.x, y: d.source.y};
          return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Update Table
    table();
  }

  //Display nodes to the level of depth
  function displayChildren(){
    containerComb.selectAll("g.node").each(function(d,i){
      if (d.depth + 1 == number && !d.children) {
          d.children = d._children;
          d._children = null;
      } else if(d.depth == number) {
        d._children = d.children;
        d.children = null;
      }
    })
  }

  //Combinatoric Functions
  function counter(n,r) {
  	return combinations ? nCr(n,r) : nPr(n,r);
  }
  //Calculates number of permutations of r items out of n elements
  function nPr(n,r) {
    var result = 1;
    for (var i = 0; i < r; i++) {
      result = result*(n-i);
    };
    return result ? result : "";
  }

  //Calculates number of combinations of r items out of n elements
  function nCr(n,r) {
    var result = 1;
    for (var i = 0; i < r; i++) {
      result = result*(n-i)/(i+1);
    };
    return result ? result : "";
  }

  //Hash Code unique for each anagram
  function hashAnagram(s){
    return s.split("").sort().reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
  }

  //Handles permutation/combination radio buttons
  $("input[name='radioComb']").on("change", function () {
      combinations = (this.value==='true');
      $(".count_label").toggle();
      update(dur);
  });

  //Handles Input on size
  $('#sizeComb img').click(function () {
      $('#sizeComb img').removeClass('active');
      $(this).toggleClass('active');
      size = $(this).index() + 1;
      number = Math.min(number, size);
      drawTree(0);
      $("colgroup").removeClass("click hover");
      $("#count_table colgroup").eq(number + 1).addClass("click");
  });

  // Update visualization with number
  function update_number(index) {
    oldNumber = number;
    number =  index;
    if (Math.abs(number-oldNumber) > 1) {
      drawTree(0);
      update(0);
    } else {
      displayChildren();
      update(dur);
    }
  }

  // Handle table click and hover
  $("#count_table").delegate('td','click mouseover mouseleave', function(e) {
    var col = $(this).index() - 1,
        curr = $("#count_table colgroup").eq(col + 1);
    if (0 <= col && col != number && col <= size) {
      if(e.type == 'mouseover' && !curr.hasClass("click")) {
        curr.addClass("hover");
      } else if (e.type == 'click') {
        update_number(col);
        $("colgroup").removeClass("click hover");
        curr.addClass("click");
      } else {
        curr.removeClass("hover");
      }
    };
  });

  // Fill in values of table
  function table() {
  	$('#r1').html(counter(size,1))
  	$('#r2').html(counter(size,2))
  	$('#r3').html(counter(size,3))
  	$('#r4').html(counter(size,4))
  }

  // setup
  drawTree(0);
  update(0);
}

//*******************************************************************************//
//Conditional Probability
//*******************************************************************************//
function conditional() {
  //Adapted from http://setosa.io/ev/conditional-probability/
  //Constants
  var currentPerspective = 'universe'
  var radius = 5;
  var eventsData = [
          { x: 1/6, y: 0.2, width: 1/3, height: 0.05, name: 'A' },
          { x: 1/3, y: 0.4, width: 1/3, height: 0.05, name: 'B' },
          { x: 1/2, y: 0.6, width: 1/3, height: 0.05, name: 'C' }
      ];
  var mapper = {0: "P(A)", 1: "P(B)", 2: "P(C)"};

  //Create SVG
  var svgBallCP = d3.select('#svgBallCP').append('svg');
  var svgProbCP = d3.select('#svgProbCP').append('svg');

  //Create Clip Path
  var clipCP = svgBallCP.append("clipPath").attr("id", "viewCP").append("rect");

  //Create Container
  var containerBallCP = svgBallCP.append('g').attr("clip-path", "url(#viewCP)");
  var containerProbCP = svgProbCP.append('g');
    
  //Create Scales
  var xScaleCP = d3.scale.linear().domain([0, 1]);
  var xWidthCP = d3.scale.linear().domain([0, 1]);
  var yScaleCP = d3.scale.linear().domain([0, 1]);

  var xScaleProbCP = d3.scale.ordinal().domain([0,1,2]);
  var yScaleProbCP = d3.scale.linear().domain([0, 1]);


  //Drag Functions
  var dragRect = d3.behavior.drag()
           .origin(function() { return {x: d3.select(this).attr("x"),y:0};})
           .on('dragstart', function(){d3.select(this.parentNode).moveToFront();}) 
           .on('drag', function(d,i) {
              var x = Math.max(0,Math.min(xScaleCP.invert(d3.event.x),(1-eventsData[i].width)));
              eventsData[i].x = x;
              changePerspective(currentPerspective);
              updateRects(0);
            })
  var dragLeft = d3.behavior.drag()
           .on('dragstart', function(){d3.select(this).moveToFront();})
           .on('drag', function(d,i) {
              var x = Math.max(0,Math.min(xScaleCP.invert(d3.event.x),(eventsData[i].x+eventsData[i].width),1));
              var change = eventsData[i].x - x;
              eventsData[i].x = x;
              eventsData[i].width = Math.max(0,eventsData[i].width + change);
              changePerspective(currentPerspective);
              updateRects(0);
           })
  var dragRight = d3.behavior.drag()
           .on('dragstart', function(){d3.select(this).moveToFront();})
           .on('drag', function(d,i) {
              var w = Math.max(0,Math.min(xScaleCP.invert(d3.event.x)-eventsData[i].x,(1-eventsData[i].x)));
              eventsData[i].width = w;
              changePerspective(currentPerspective);
              updateRects(0);
           })

  //Tool tip for Prob
  var tipCP = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d,i) { 
                  var prob = calcOverlap(i,currentPerspective)/(xWidthCP.domain()[1]);
                  return round(prob,2);});

  //Ball SVG elements
  var events = containerBallCP.selectAll('g.event').data(eventsData).enter().append('g').attr('class', 'event');

  var rects = events.append('rect').attr('class', function(d){ return (d.name + ' shelf') }).call(dragRect);

  var leftBorders = events.append('line').attr('class', function(d){ return (d.name + ' border') }).call(dragLeft);

  var rightBorders = events.append('line').attr('class', function(d){ return (d.name + ' border') }).call(dragRight);

  var texts = events.append('text').text(function(d){ return d.name }).attr('class', function(d){ return d.name + ' label'});

  var circles = containerBallCP.append("g").attr("class", "ball").moveToBack();

  //Prob SVG elements
  var probEvents = containerProbCP.selectAll('g.event').data(eventsData).enter().append('g').attr('class', 'event');

  var probRects = probEvents.append('rect').attr('class', function(d){ return (d.name + ' probability') }).on("mouseover", function(d,i) { tipCP.show(d,i);}).on("mouseout", function() { tipCP.hide();});;

  var probAxis = containerProbCP.append("g").attr("class", "x axis");

  var xAxis = d3.svg.axis().scale(xScaleProbCP).orient("bottom").tickFormat(function (d) { return mapper[d]});


  //Updates positions of rectangles and lines
  function updateRects(dur) {
    rects.transition().duration(dur)
      .attr('x', function(d){ return xScaleCP(d.x) })
      .attr('y', function(d){ return yScaleCP(d.y) })
      .attr('width', function(d){ return xWidthCP(d.width) })
      .attr('height', function(d){ return yScaleCP(d.height) });

    leftBorders.transition().duration(dur)
      .attr('x1', function(d){ return xScaleCP(d.x) })
      .attr('y1', function(d){ return yScaleCP(d.y) })
      .attr('x2', function(d){ return xScaleCP(d.x) })
      .attr('y2', function(d){ return yScaleCP(d.y+d.height) });

    rightBorders.transition().duration(dur)
      .attr('x1', function(d){ return xScaleCP(d.x+d.width) })
      .attr('y1', function(d){ return yScaleCP(d.y) })
      .attr('x2', function(d){ return xScaleCP(d.x+d.width) })
      .attr('y2', function(d){ return yScaleCP(d.y+d.height) });

    texts.transition().duration(dur)
      .attr('x', function(d){ return xScaleCP(d.x + d.width/2) })
      .attr('y', function(d){ return yScaleCP(d.y + d.height + 0.05) });

    circles.selectAll('g').each(function(){
      d3.select(this).transition().duration(dur)
        .attr('transform', function(d){return 'translate(' + xScaleCP(d.p) + ',0)'});
    })

    probRects.transition().duration(dur)
      .attr('x', function(d,i){ return xScaleProbCP(i); })
      .attr('y', function(d,i){ return yScaleProbCP(calcOverlap(i,currentPerspective)/xWidthCP.domain()[1]); })
      .attr('width', function(d,i){ return xScaleProbCP.rangeBand(); })
      .attr('height', function(d,i){ return yScaleProbCP(1-calcOverlap(i,currentPerspective)/xWidthCP.domain()[1]); });

    //calcIndependence();
  }

  //Drops ball randomly from 0 to 1
  function addBall(data){
    var dur = 2500;
    var p = Math.random();
    var pos = [{t: 0}, {t: 1}];
    var a, b, c, events = [];
    var bisector = d3.bisector(function(d){ return d.t }).right

    if(data[0].x <= p && p <= data[0].x + data[0].width) a = data[0]
    if(data[1].x <= p && p <= data[1].x + data[1].width) b = data[1]
    if(data[2].x <= p && p <= data[2].x + data[2].width) c = data[2]
    if(a) pos.splice(bisector(pos) - 1, 0, { t: a.y, event: a.name})
    if(b) pos.splice(bisector(pos) - 1, 0, { t: b.y, event: b.name})
    if(c) pos.splice(bisector(pos) - 1, 0, { t: c.y, event: c.name})
    if(a) events.push(a)
    if(b) events.push(b)
    if(c) events.push(c)
    var g = circles.append('g').datum({p: p, events: events })
        .attr('transform', function(d){return 'translate(' + xScaleCP(d.p) + ',0)'})
    var circle = g.append('circle')
                  .attr('r', radius)
                  .attr('cy', function(){ return yScaleCP(0) });

    pos.forEach(function(d, i){
      if(i === 0) return
      var dt = pos[i].t - pos[i - 1].t
      circle = circle
        .transition()
        .duration(dur * dt)
        .ease('bounce')
        .attr('cy', function(){ return yScaleCP(d.t) })
        .each('end', function(){ if(d.event) d3.select(this).classed(d.event, true) })
    })
    circle.each('end', function(d){
      d3.select(this.parentNode).remove();
    })
  }

  //Start and Stop ball sampling
  var interval;
  function start() {
    interval = setInterval(function() { 
      addBall(eventsData);
    }, 50);
  }
  function stop() {
    clearInterval(interval);
  }

  //Handles start and stop buttons
  $('.ballBtns').on('click', function(){
    var button = d3.select(this).attr('id');
    if(button=='start') start();
    if(button=='stop')  stop();
    $('#start').toggle();
    $('#stop').toggle(); 
  })

  //Handle Perspective Buttons
  $('.perspective').on('click', function(){
    $('#'+currentPerspective).toggleClass('active');
    $(this).toggleClass('active');
    changePerspective(d3.select(this).attr('id'));
    updateRects(1000);
  })

  //Changes Perspective
  function changePerspective(p){
    if(p=='a' && eventsData[0].width) {
      xScaleCP.domain([eventsData[0].x,(eventsData[0].x+eventsData[0].width)]);
      xWidthCP.domain([0,eventsData[0].width]);
      currentPerspective = 'a';
      mapper = {0: "P(A|A)", 1: "P(B|A)", 2: "P(C|A)"};
    } else if(p=='b' && eventsData[1].width) {
      xScaleCP.domain([eventsData[1].x,(eventsData[1].x+eventsData[1].width)]);
      xWidthCP.domain([0,eventsData[1].width]);
      currentPerspective = 'b';
      mapper = {0: "P(A|B)", 1: "P(B|B)", 2: "P(C|B)"};
    } else if(p=='c' && eventsData[2].width) {
      xScaleCP.domain([eventsData[2].x,(eventsData[2].x+eventsData[2].width)]);
      xWidthCP.domain([0,eventsData[2].width]);
      currentPerspective = 'c';
      mapper = {0: "P(A|C)", 1: "P(B|C)", 2: "P(C|C)"};
    } else if (p=='universe') {
      xScaleCP.domain([0,1]);
      xWidthCP.domain([0,1]);
      currentPerspective = 'universe';
      mapper = {0: "P(A)", 1: "P(B)", 2: "P(C)"};
    }
    probAxis.call(xAxis);
  }


  //Calculates overlap of rectangles
  function calcOverlap(index, perspective){
    var a1,a2;
    if(perspective=='a') { 
      a1 = eventsData[0].x; 
      a2 = a1 + eventsData[0].width;
    } else if(perspective=='b') { 
      a1 = eventsData[1].x; 
      a2 = a1 + eventsData[1].width;
    } else if(perspective=='c') { 
      a1 = eventsData[2].x; 
      a2 = a1 + eventsData[2].width;
    } else if (perspective=='universe') {
      a1 = 0; 
      a2 = 1;
    }
    
    var b1 = eventsData[index].x;
    var b2 = b1 + eventsData[index].width;

    var overlap = 0
    // if b1 is between [a1, a2]
    if(a1 <= b1 && b1 <= a2){
      // b is entirely inside of a
      if(b2 <= a2){
        overlap = b2 - b1
      }else {
        overlap = a2 - b1
      }
    }
    // if b2 is between [a1, a2]
    else if(a1 <= b2 && b2 <= a2){
      if(b1 <= a1){
        overlap = b2 - a1
      }else{
        overlap = b2 - b1
      }
    }
    // if b1 is left of a1 and b2 is right of a2
    else if(b1 <= a1 && a2 <= b2) {
      overlap = a2 - a1
    }
    return overlap
  }

  //Check if event pairs are Independent
  // function calcIndependence(){
  //   if(round(calcOverlap(0,'b')/eventsData[1].width,2) == round(eventsData[0].width,2)) {
  //     $('#AB').html('independent');
  //   } else {
  //     $('#AB').html('dependent');
  //   }
  //   if(round(calcOverlap(1,'c')/eventsData[2].width,2) == round(eventsData[1].width,2)) {
  //     $('#BC').html('independent');
  //   } else {
  //     $('#BC').html('dependent');
  //   }
  //   if(round(calcOverlap(2,'a')/eventsData[0].width,2) == round(eventsData[2].width,2)) {
  //     $('#CA').html('independent');
  //   } else {
  //     $('#CA').html('dependent');
  //   }
  // }

  //Draws SVG and elements according to width
  function drawCP() {
    var w = d3.select('#svgBallCP').node().clientWidth;
    var wProb = d3.select('#svgProbCP').node().clientWidth;
    var h = 500;
    var hProb = 200;
    var padding = 25;

    //Update svg size
    svgBallCP.attr("width", w).attr("height", h);
    svgProbCP.attr("width", wProb).attr("height", hProb).call(tipCP);;

    //Update Clip Path
    clipCP.attr("x", 0).attr("y", 0).attr("width", w-2*padding).attr("height", h-2*padding);

    //Update Container
    containerBallCP.attr("transform", "translate(" + padding + "," + padding + ")");
    containerProbCP.attr("transform", "translate(" + padding + "," + padding + ")");

    //Update Scale Range
    xScaleCP.range([0, (w - 2*padding)]);
    xWidthCP.range([0, (w - 2*padding)]);
    yScaleCP.range([0, (h-2*padding)]);

    xScaleProbCP.rangeRoundBands([0, wProb - 2*padding], .5);
    yScaleProbCP.range([hProb-2*padding, 0]);

    //Update Axis
    probAxis.attr("transform", "translate(" + 0 + "," + (hProb-2*padding+1) + ")").call(xAxis);

    //Update Rectangles
    changePerspective(currentPerspective);
    updateRects(0)
  }
  start();

  drawCP();
  $(window).on("resize", drawCP);
}