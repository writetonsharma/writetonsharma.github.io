window.addEventListener('load', slideShow, false);

function slideShow() {
  
  /* GLOBALS **********************************************************************************************/
  
  var globals = {
    slideDelay: 4000, // The time interval between consecutive slides.
    fadeDelay: 35, // The time interval between individual opacity changes. This should always be much smaller than slideDelay.  
    wrapperID: "slideShowImages", // The ID of the <div> element that contains all of the <img> elements to be shown as a slide show.
    wrapperIDPhone: "slideShowImagesPhone", // The ID of the <div> element that contains all of the <img> elements to be shown as a slide show.
    buttonStartText: "Start Slides", // Text used in the slide show toggle button.
    buttonStopText: "Stop Slides", // Text used in the slide show toggle button.    
    wrapperObject: null, // Will contain a reference to the <div> element that contains all of the <img> elements to be shown as a slide show.
	LeftSlideID: "#nav-left",
	RightSlideID: "#nav-right",
    slideImages: [], // Will contain all of the slide image objects.
    slideShowID: null, // A setInterval() ID value used to stop the slide show.
    slideShowRunning: true, // Used to record when the slide show is running and when it's not. The slide show is always initially running.    
    slideIndex: 0 // The index of the current slide image.
  }
  
  /* MAIN *************************************************************************************************/
	
  initializeGlobals();  
  
  if ( insufficientSlideShowMarkup() ) {
    return; // Insufficient slide show markup - exit now.
  }
 
   // Assert: there's at least one slide image.
 
  if (globals.slideImages.length == 1) {
    return; // The solo slide image is already being displayed - exit now.
  }
  
  
  initializeSlideShowMarkup();
  
 
  //startSlideShow();
  
  /* FUNCTIONS ********************************************************************************************/
  
  function initializeGlobals() { 

	if(document.documentElement.clientWidth < 720 )
	{
		globals.wrapperObject = (document.getElementById(globals.wrapperIDPhone) ? document.getElementById(globals.wrapperIDPhone) : null);
		$(globals.wrapperObject).on("swipeleft", swipeSlidesLeft);
		$(globals.wrapperObject).on("swiperight", swipeSlidesRight);
		//globals.buttonObject = (document.getElementById(globals.buttonIDPhone) ? document.getElementById(globals.buttonIDPhone) : null); 	
	}
	else
    {
		globals.wrapperObject = (document.getElementById(globals.wrapperID) ? document.getElementById(globals.wrapperID) : null);
		$(globals.LeftSlideID).click(transitionSlidesLeft);
		$(globals.RightSlideID).click(transitionSlidesRight);
		//globals.buttonObject = (document.getElementById(globals.buttonID) ? document.getElementById(globals.buttonID) : null);   
    }	
	
    if (globals.wrapperObject) {
      globals.slideImages = (globals.wrapperObject.querySelectorAll('img') ? globals.wrapperObject.querySelectorAll('img') : []);
    }
  } // initializeGlobals
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function insufficientSlideShowMarkup() {
    if (!globals.wrapperObject) { // There is no wrapper element whose ID is globals.wrapperID - fatal error.
//      if (globals.buttonObject) {
//        globals.buttonObject.style.display = "none"; // Hide the not needed slide show button element when present.
//      }
      return true;
    }

    if (!globals.slideImages.length) { // There needs to be at least one slide <img> element - fatal error.
      if (globals.wrapperObject) {
        globals.wrapperObject.style.display = "none"; // Hide the not needed <div> wrapper element.
      }
    
//      if (globals.buttonObject) {
//       globals.buttonObject.style.display = "none"; // Hide the not needed slide show button element.
//      }
    
      return true;
    }
    
    return false; // The markup expected by this library seems to be present.
  } // insufficientSlideShowMarkup
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  function initializeSlideShowMarkup() {  
    var slideWidthMax = maxSlideWidth(); // Returns a value that is always in pixel units.
    var slideHeightMax = maxSlideHeight(); // Returns a value that is always in pixel units.
    
    globals.wrapperObject.style.position = "relative";
    globals.wrapperObject.style.overflow = "hidden"; // This is just a safety thing.
    globals.wrapperObject.style.width = slideWidthMax + "%";
    globals.wrapperObject.style.height = slideHeightMax + "px";
	globals.wrapperObject.style.marginBottom = "5px";
    
    var slideCount = globals.slideImages.length;
	var totalWidth = 0;
    for (var i = 0; i < slideCount; i++) { 
      //globals.slideImages[i].style.opacity = 0;
      globals.slideImages[i].style.position = "absolute";
      globals.slideImages[i].style.top = (slideHeightMax - globals.slideImages[i].getBoundingClientRect().height) / 2 + "px";   
      //globals.slideImages[i].style.left = ($(globals.slideImages[0]).width() - globals.slideImages[i].getBoundingClientRect().width) / 2 + "px";               
	  globals.slideImages[i].style.left = totalWidth + "px";
	  totalWidth += $(globals.slideImages[i]).width();
    }
    
	// hide the right button initially
	$('#nav-right').css("visibility", "hidden");
	

  } // initializeSlideShowMarkup
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
  function maxSlideWidth() {
    var maxWidth = 0;
    var maxSlideIndex = 0;
	
	// All images are of same width

	maxWidth = ($(globals.slideImages[0]).width() / $(globals.wrapperObject).parent().width()) * 100;

    //return globals.slideImages[maxSlideIndex].getBoundingClientRect().width; // Account for the image's border, padding, and margin values. Note that getBoundingClientRect() is always in units of pixels.
	return maxWidth;
  } // maxSlideWidth
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    
  function maxSlideHeight() {
    var maxHeight = 0;
    var maxSlideIndex = 0;    
    var slideCount = globals.slideImages.length;
    
    for (var i = 0; i < slideCount; i++) {
      if (globals.slideImages[i].height > maxHeight) {
        maxHeight = globals.slideImages[i].height; // The height of the tallest slide so far.
        maxSlideIndex = i; // The slide with the tallest height so far.
      }
    }
    
    return globals.slideImages[maxSlideIndex].getBoundingClientRect().height; // Account for the image's border, padding, and margin values. Note that getBoundingClientRect() is always in units of pixels.
  } // maxSlideHeight


  function transitionSlidesRight() {
  
	// on right, make the left arrow visible as this made room to move slides left
	$('#nav-left').css("visibility", "visible");
	
	if(globals.slideIndex == 1)
	{
		$('#nav-right').css("visibility", "hidden");
	}
	--(globals.slideIndex);
	for(var i = 0;i < globals.slideImages.length;i++)
	{
		// shift each slide right one step
		var currentSlide = globals.slideImages[i]
		$(currentSlide).animate( {left:"+=" + $(currentSlide).width()});
	}
  

  } // transitionSlidesRight
  
    function transitionSlidesLeft() {
	
	// on left click, make the right visible as this made room to move right
	$('#nav-right').css("visibility", "visible");
	
	
	// check if the next slide is going to be the last slide
	// hide the left button in that case
	if(globals.slideIndex == globals.slideImages.length - 2)
	{
		$('#nav-left').css("visibility", "hidden");
	}
	++(globals.slideIndex);
	for(var i = 0;i < globals.slideImages.length;i++)
	{
		// shift each slide left
		var currentSlide = globals.slideImages[i]
		$(currentSlide).animate( {left:"-=" + $(currentSlide).width()});
	}
	
  } // transitionSlidesLeft
  
    function swipeSlidesRight() {
	
	if(globals.slideIndex == 0)
	{
		 $(globals.slideImages[globals.slideIndex])
		.animate(
			{ left:'+=200' }, {
				duration: 'slow',
				easing: 'easeOutBack'
			})
		.animate(
			{ left: 0 }, {

				duration: 'slow',
				easing: 'easeOutBack'
			});

		return;
	}
	--(globals.slideIndex);
	for(var i = 0;i < globals.slideImages.length;i++)
	{
		// shift each slide right one step
		var currentSlide = globals.slideImages[i]
		$(currentSlide).animate( {left:"+=" + $(currentSlide).width()});
	}
}	// swipeSlidesRight

	function swipeSlidesLeft() {
		
	// check if the next slide is going to be the last slide
	// hide the left button in that case
	if(globals.slideIndex == globals.slideImages.length - 1)
	{
	        $(globals.slideImages[globals.slideIndex])
            .animate(
                { left:'-=200' }, {
                    duration: 'slow',
                    easing: 'easeOutBack'
                })
            .animate(
                { left: 0 }, {
 
                    duration: 'slow',
                    easing: 'easeOutBack'
                });
		return;
	}
	++(globals.slideIndex);
	for(var i = 0;i < globals.slideImages.length;i++)
	{
		// shift each slide left
		var currentSlide = globals.slideImages[i];
		$(currentSlide).animate( {left:"-=" + $(currentSlide).width()});
	}
}	// swipeSlidesLeft

} // slideShow
