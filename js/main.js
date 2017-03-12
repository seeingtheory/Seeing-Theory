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
 	$('body').append("<div class='modal fade' id='mobile' role='dialog'> \
                        <div class='modal-dialog modal-sm'> \
                          <div class='modal-content'> \
                            <div class='modal-header'> \
                              <button type='button' class='close' data-dismiss='modal'>&times;</button> \
                              <h4 class='modal-title'>Seeing Theory is not Mobile Friendly</h4> \
                            </div> \
                            <div class='modal-body'> \
                              <p class='text-center'>Sorry, some of the visualizations might not be fully functional.</p> \
                            </div> \
                          </div> \
                        </div> \
                    </div>");
 	$('#mobile').modal('show');
 	// $('body').children().css('display','none');
 	// $('body').append( "<div class='text-center'><img src='/img/noMobile.png' /><h4>Please do not use a mobile device!</h4></div>" );
}