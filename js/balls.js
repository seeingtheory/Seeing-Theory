//Home Page Graphic
//adapted from https://bl.ocks.org/mbostock/3231307

var width = d3.select("#background").node().clientWidth,
    height = d3.select("#background").node().clientHeight;

var num = 300,
    base = 4,
    dif = 12;

var nodes = d3.range(num).map(function() { return {radius: Math.random() * dif + base }; }),
    root = nodes[0],
    color = ['#009cde', '#46c8b2', '#f5d800', '#ff8b22', '#ff6859', '#fc4d77'];

root.radius = 0;
root.fixed = true;
root.px = width/2;
root.py = height/2;

var force = d3.layout.force()
    .gravity(0.015)
    .charge(function(d, i) { return i ? 0 : - (height + width); })
    .nodes(nodes)
    .size([width, height]);

force.start();

var canvas = d3.select("#background").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

force.on("tick", function(e) {
  var q = d3.geom.quadtree(nodes),
      i,
      d,
      n = nodes.length;

  for (i = 1; i < n; ++i) q.visit(collide(nodes[i]));

  context.clearRect(0, 0, width, height);
  force.size([width, height]);
  for (i = 1; i < n; ++i) {
    context.fillStyle = color[i % color.length];
    context.globalAlpha = 0.6;
    d = nodes[i];
    context.moveTo(d.x, d.y);
    context.beginPath();
    context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
    context.fill();
  }
});

canvas.on("mousemove", move);
canvas.on("touchmove", move);

function move() {
  var p1 = d3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
};

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
          r = node.radius + quad.point.radius + 7;
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

$(window).on("resize", function () {
  width = d3.select("#background").node().clientWidth,
  height = d3.select("#background").node().clientHeight;
  canvas.attr("width", width).attr("height", height);
  force.start();
});

// Detect Swipe Down (www.javascriptkit.com/javatutors/touchevents2.shtml)
window.addEventListener('load', function(){
 
    var touchsurface = document.getElementById("background"),
        startX,
        startY,
        dist,
        threshold = 150, //required min distance traveled to be considered swipe
        allowedTime = 200, // maximum time allowed to travel that distance
        elapsedTime,
        startTime
 
    function handleswipe(down){
        if (down) {
            window.location.href = "#secondPage";
        }
    }
 
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
    })
    
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        dist = startY - touchobj.pageY // get total dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
        var down = (elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageX - startX) <= 100)
        handleswipe(down)
    })
 
})
