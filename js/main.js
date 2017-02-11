//JS functions used in all pages

//Adds bring to front for all elements from D3 selection
//Adapted from the following code:
//http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

//Adds bring to back for all elements from D3 selection
d3.selection.prototype.moveToBack = function() {
  return this.each(function(){
    this.parentNode.insertBefore(this,this.parentNode.firstChild);
  });
};

//Rounds the input number to input decimal places
function round(number,decimal) {
	var power = Math.pow(10,decimal);
	return (Math.round(number*power)/power).toFixed(decimal);
}

// var options = {'easing':'swing'}
// //Panel Snapping
// jQuery(function($) {
// $('body').panelSnap(options);
// });

//Prevent users from using on mobile devices
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 	$('body').children().css('display','none');
 	$('body').append( "<div class='text-center'><img src='/img/noMobile.png' /><h4>Please do not use a mobile device!</h4></div>" );
}