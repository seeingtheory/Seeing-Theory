//JS functions used in all pages

//Adds bring to front for all elements from D3 selection
//Adapted from the following code:
//http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

//Adds bring to back for all elements from D3 selection
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        this.parentNode.insertBefore(this, this.parentNode.firstChild);
    });
};

//Rounds the input number to input decimal places
function round(number, decimal) {
    var power = Math.pow(10, decimal);
    return (Math.round(number * power) / power).toFixed(decimal);
}


//Additional Functions to JSTAT

jStat.binomialDiscrete = {};

jStat.binomialDiscrete.pdf = function(k, n, p) {
    if (k < 0 || !Number.isInteger(k) || k > n || p < 0 || p > 1) {
        return 0;
    } else {
        return jStat.binomial.pdf(k, n, p);
    }
}

jStat.binomialDiscrete.cdf = function(k, n, p) {
    return jStat.binomial.cdf(k, n, p);
}

jStat.binomialDiscrete.mean = function(n, p) {
    return n * p;
}

jStat.binomialDiscrete.sample = function(n, p) {
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += +(Math.random() < p);
    }
    return sum;
}

jStat.bernoulli = {};

jStat.bernoulli.pdf = function(k, p) {
    return jStat.binomialDiscrete.pdf(k, 1, p);
}

jStat.bernoulli.cdf = function(k, p) {
    return jStat.binomial.cdf(k, 1, p);
}

jStat.bernoulli.mean = function(p) {
    return p;
}

jStat.bernoulli.sample = function(p) {
    return +(Math.random() < p);
}

jStat.negbin.mean = function(r, p) {
    return (1 - p) * r / p;
}

jStat.geometric = {};

jStat.geometric.pdf = function(k, p) {
    if (k < 0 || !Number.isInteger(k)) {
        return 0;
    } else {
        return Math.pow(1 - p, k) * p;
    }
}

jStat.geometric.cdf = function(k, p) {
    if (k < 0) {
        return 0;
    } else {
        return 1 - Math.pow(1 - p, Math.floor(k) + 1);
    }
}

jStat.geometric.mean = function(p) {
    return (1 - p) / p;
}

jStat.poisson.mean = function(lambda) {
    return lambda;
}



// Slider
function create_slider(slide, svg, width, height, margin) {
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, width])
        .clamp(true);

    var drag = d3.behavior.drag()
        .on('drag', function(d, i) {
            var val = x.invert(d3.event.x);
            handle.attr("cx", x(val));
            slide(val);
        });

    var slider = svg.append("g")
        .attr("class", "range")
        .attr("transform", "translate(" + margin + "," + height + ")");

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
        .attr("transform", "translate(0," + 25 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 12);

    function reset() {
        handle.attr("cx", x(0));
    }

    return reset;
}



// Jingru's Code

var n = $(window).height() * 0.75;
var m = n * 0.6; // where to update the card
var chapter_name = true;
var end_url = langDetect();
var chapterlist = new Array("bp", "cp", "pd", "fi", "bi", "ra");
var chapter_list = new Array("basic-probability", "compound-probability", "probability-distributions", "frequentist-inference", "bayesian-inference", "regression-analysis");
var shareUrl = window.location.href;

window.onload = function() {

    scrollTo();

    //onload animation
    $('body').fadeIn(1000);

    scrollAndReavealOnLoad();
    modalTitleOnLoad();
    chapterBackgroundColorChange();
    shareButtonToggle();
    inlineShare();




}


function modalTitleOnLoad() {


    $('.modal-chapter-titles li').on("dblclick", function() {
        var cur_id = $(this).attr("id").slice(0, 2);
        var a = chapterlist.indexOf(cur_id);

        window.location.href = "../" + chapter_list[a] + "/" + end_url;

    })

    $('.modal-chapter-titles li').on("click", function() {
        $('.modal-chapter-titles li').removeClass('chapter-highlighted');
        $(this).addClass('chapter-highlighted');
        var cur_id = $(this).attr("id").slice(0, 2);

        var a = chapterlist.indexOf(cur_id);


        if ($(window).width() < 750) {
            window.location.href = "../" + chapter_list[a] + "/" + end_url;
        } else {
            hideAllTiles();
            $("#" + cur_id).css("display", "block");
        }

    });

}




$(window).scroll(function() {
    ScrollProgressBar();
    chapterBackgroundColorChange();


    var scrollTopH = $(window).scrollTop();
    scrollAndReveal();


});



function scrollAndReavealOnLoad() {
    var scrollTopH = $(window).scrollTop();
    var section1H = $('#section1').offset().top;
    var section2H = $('#section2').offset().top;
    var section3H = $('#section3').offset().top;

    chapter_name = false;
    if (scrollTopH < section1H - m) {

        downArrowShow();
        chapter_name = true;

    } else if (scrollTopH < section2H - m) {

        moveToMiddle($('#section-1'));


    } else if (scrollTopH < section2H - m) {

        moveToMiddle($('#section-2'));

    }
    titleChangeToChapter();



}

function scrollAndReveal() {
    var scrollTopH = $(window).scrollTop();
    var section1H = $('#section1').offset().top;
    var section2H = $('#section2').offset().top;
    var section3H = $('#section3').offset().top;


    chapter_name = false;
    if (scrollTopH <= section1H - m) {

        //from section1 to section0, v1 move down
        hideDiv($('#section-1'));
        hideDiv($('#section-2'));
        hideDiv($('#section-3'));
        chapter_name = true;


    } else if (scrollTopH <= section2H - m) {
        if (scrollTopH > section1H - m) {

            moveToMiddle($('#section-1'));

            hideDiv($('#section-2'));
            hideDiv($('#section-3'));

        }

    } else if (scrollTopH < section3H - m) {
        if (scrollTopH > section1H - m) {

            moveToMiddle($('#section-2'));
            hideDiv($('#section-1'));
            hideDiv($('#section-3'));

        }
    } else if (scrollTopH > section3H - m) {

        moveToMiddle($('#section-3'));
        hideDiv($('#section-2'));
        hideDiv($('#section-1'));
    }
    titleChangeToChapter();
}


function moveToMiddle(div) {
    div.css("visibility", "visible");

}


function hideDiv(div) {
    div.css("visibility", "hidden");
}



function titleChangeToChapter() {

    if (chapter_name == true) {
        $("#display-chapter").css("display", "none");
        $("#seeing-theory").css("display", "block");
    } else {
        $("#seeing-theory").css("display", "none");
        $("#display-chapter").css("display", "block");
    }


}


function downArrowShow() {
    $('.scroll-down').show("fade");
    $('.scroll-down').fadeIn(1000).fadeOut(1000).fadeIn(1000).fadeOut(1000).fadeIn(1000);

}



//Progress
function ScrollProgressBar() {
    var wh = $(window).height();

    max = $('.col-left').width();


    var section1toTop = $('#section1').offset().top;
    var scrolltoTop = $(window).scrollTop() - section1toTop;
    var lasttoTop = $('#section3').offset().top - section1toTop;

    var x = (scrolltoTop / lasttoTop) * max;


    if (x > max) {
        x = max;
    }
    $('.progress-bar-color').css('width', x);

}


//scrollTo

function scrollTo() {

    $("#one").click(function() {
        toSection($("#section1"));
    });

    $("#two").click(function() {
        toSection($("#section2"));
    });

    $("#three").click(function() {
        toSection($("#section3"));
    });


    $(".scroll-down").click(function() {
        toSection($("#section1"));
        $(".scroll-down").css("display", "none");
    });


    //Modal Menu Scrolling to chapter
    $(".nav-unit-wrapper-s").click(function() {
        parent_id = $(this).parent().attr('id');
        current_page = $(this).parent().attr('class');

        if (current_page) {
            closeNav();
            var num = $(this).attr('class').slice(-1);
            toSection($("#section" + num));

        } else {
            var a = chapterlist.indexOf(parent_id);
            chapter_list[a];

            toNewChapterUnit(this, "../" + chapter_list[a] + "/" + end_url);

        }








    });


    function toSection(section) {
        var n = section;
        var pos = { 'scrollTop': n.offset().top }
        $('html,body').animate(pos, 'slow');
    }

    function toNewChapterUnit(thisObj, chapter) {
        var url = chapter;

        var n = $(thisObj);

        if (n.hasClass("tile1")) {
            url = url + "#section1";
        } else if (n.hasClass("tile2")) {
            url = url + "#section2";
        } else if (n.hasClass("tile3")) {
            url = url + "#section3";
        }


        window.location.href = url;
    }

}


function toTop() {
    $('html,body').animate({
            scrollTop: $("#section0").offset().top
        },
        'slow');
}



function chapterBackgroundColorChange() {
    var xh = $(window).height() * 0.45;
    var alpha;
    var n = 0.1;
    var bg_color = $('.col-left').css('background-color');
    bg_color = bg_color.slice(3, -1);

    var m = $('.nav-unit-wrapper').css("margin-left");
    m = m.slice(0, -2);


    if ($(window).scrollTop() >= xh) {
        alpha = 0;


    } else if ($(window).scrollTop() >= n * xh) {

        alpha = $(window).scrollTop() - n * xh;
        alpha = 1 - alpha / ((1 - n) * xh);



    } else if ($(window).scrollTop() >= 0) {
        alpha = 1;


    }

    m = m * alpha;


    setPadding(m);


    $('body').css('background', "rgba" + bg_color + "," + alpha + ")");
    $('#section-0').css('opacity', alpha);

}

function setPadding(n) {

    // n = n;
    $('.col-left-wrapper, .header-wrapper').css("padding-left", n);

}



/*MODAL*/

$(window).resize(function() {


    if ($(window).width() < 750) {
        hideAllTiles();

    } else {
        displayCurrentClass();
    }

    chapterBackgroundColorChange();


});

function displayCurrentClass() {
    var cur_chapter = getCurrentChapter();
    $('#' + cur_chapter).css("display", "block");

}


function hideAllTiles() {
    $('#bp,#cp,#pd,#fi,#ra,#bi').css("display", "none");
}




function openNav() {

    $('#overlay').show("fade");

    // add listener to disable scroll
    disableScroll();
}

function closeNav() {

    $('#overlay').hide("slow");

    enableScroll();
}


var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function shareButtonToggle() {

    $('#share-modal').click(function() {
        $('#share').slideToggle();
        $('#share-modal').toggle();

    })
}

function langDetect() {
    var a = document.documentElement.lang.toLowerCase();

    var current_url;

    if (a != "en") {
        current_url = "index-" + a + ".html";
    } else {
        current_url = "index.html"
    }

    return current_url;

}

function getCurrentChapter() {
    return $('meta[name=chapter]').attr("content");
}

function inlineShare(){
    $(".inline-share").on("click", function() {
        $('#share').slideToggle();
        $('#share-modal').toggle();
        var left_pos = $(this).offset().left;
        var top_pos = $(this).offset().top;

        var section = $(this).parent().parent().attr('id');
        console.log(section);
       

        if(section){
            if(shareUrl.slice(-1)=="l"){
                shareUrl = shareUrl+"#"+section;
            }
        }
       
        $("#share").css({top: top_pos, left: left_pos, position:'absolute'});
    })

    
}



