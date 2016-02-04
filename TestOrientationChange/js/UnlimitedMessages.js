
/*****************************************************
UnlimitedMessages.js - V0.1
CSF Designer 15.0.0

Copyright (c) 2015. FIS.
*****************************************************/

(function() {		//Begin UnlimitedMessages

	UnlimitedMessages = function(element, subElements, opts)
	{
		// initialization
		this.setDefaults();
		this.setOpts(this, element, subElements, opts);
		
		// check if we need slide show
		if(!this.showMessageControl)
		{
			return;
		}
		
		this.setPlaceholderObject();
		
		this.setupButtons();
		
		this.initEvents();  

		
		if (!this.canProceed())
		{
			return; // cannot proceed
		}

		if (this.messageObjCollection.length == 1)
		{
			return; //single message, exit now.
		}


		this.initMessageStyle();
	  
	};

	
	UnlimitedMessages.prototype.setDefaults = function()
	{
		this.timeBetweenMessages = 5000; // The time interval between consecutive slides.
		this.placeholderID = undefined; // ID of the placeholder which contains all the messages
		this.subElementID = undefined; // ID of the messages inside placeholder
		this.placeholderObject = null; // Object which contains all the messages
		
		this.showPlayButton = true;
		this.playButtonID = undefined;		// play/pause button button
		this.buttonStartText = "Start Slides"; // Text used in the slide show toggle button.
		this.buttonStopText = "Stop Slides"; // Text used in the slide show toggle button.   
		
		this.overflowOpt = "visible";
		
		this.allowSwipe = true;
		
		this.showArrows = true;
		this.leftArrowID = undefined;		// left arrow
		this.rightArrowID = undefined;	// right arrow
		
		this.messageObjCollection = []; // Will contain all of the slide Message objects.
		this.slideShowID = null; // A setInterval() ID value used to stop the slide show.
		this.slideShowRunning = true; // is slides running or not. Slides starts with running.    
		this.currMessageIndex = 0; // The index of the current Message visible.
		this.loopMessages = true;		// is slide show in loop
		
		this.autoStartPlay = true;		// start the slide show on load
		this.isAlreadyPlaying = false;	// is slide show already running. It is possible that we try to set timer multiple times
		this.slideHeights = [];
		this.slideWidths = [];
		
		this.iconWidth = 64;
		this.iconHeight = 64;
		
		this.occur = 1;			// number of messages to show
		
		this.currPlayingVideoObj = undefined;		// Any video object currently playing if any.
		this.showMessageControl = false;
		this.navImagePath = null;
	};

	
	UnlimitedMessages.prototype.setOpts = function(obj, element, subElements, options)
	{
		obj.placeholderID = element;
		obj.subElementID = subElements;
		
		if (!options)
			return;
		
			for (var option in options)
		{
			if (options[option] == undefined)
				continue;
			
			obj[option] = options[option];
		}
	};

	
	UnlimitedMessages.prototype.setPlaceholderObject = function()
	{
		this.placeholderObject = ($(this.placeholderID) ? $(this.placeholderID) : null);
		var messageCollection;
		if (this.placeholderObject) 
		{
			messageCollection = $(this.placeholderObject).children(this.subElementID) ? $(this.placeholderObject).children(this.subElementID) : [];
		}
		
		// if messages are more than this.occur, 
		//truncate the collection and hide extra messages
		if(messageCollection.length > this.occur)
		{
			var i;
			for(i = 0;i < this.occur;i++)
			{
				this.messageObjCollection[i] = messageCollection[i];
			}
			
			// hide rest of the messages
			for(;i < messageCollection.length;i++)
			{
				$(messageCollection[i]).hide();
			}
		}
		else
		{
			this.messageObjCollection = messageCollection;
		}
		
	};
	
	
	UnlimitedMessages.prototype.setupButtons = function()
	{
		//width = ((this.iconWidth / this.placeholderObject.offsetWidth) * 100) + "%";
		//height = ((this.iconHeight / this.placeholderObject.offsetHeight) * 100) + "%";
		this.setupLeftArrow();
		this.setupRightArrow();
		this.setupPlayButton();		
	};
	
	
	UnlimitedMessages.prototype.setupLeftArrow = function()
	{
		var path = "url(" + this.navImagePath + ")";
		$(this.leftArrowID).css({
					"position":"absolute",
					"width":this.iconWidth,
					"height":this.iconHeight,
					"display":"inline-block",
					"left": 0,
					"bottom":0,
					"background-image": path,
					"z-index": 0,
					"background-position":"0 -64px"
		});
	};
	
	
	UnlimitedMessages.prototype.setupRightArrow = function()
	{
		var path = "url(" + this.navImagePath + ")";
		$(this.rightArrowID).css({
					"position":"absolute",
					"width":this.iconWidth,
					"height":this.iconHeight,
					"display":"inline-block",
					"bottom": 0,
					"right": 0,
					"background-image": path,
					"z-index": 0,
					"background-position":"-64px -64px"
		});
	};
	
	
	UnlimitedMessages.prototype.setupPlayButton = function()
	{
		var path = "url(" + this.navImagePath + ")";
		if(this.autoStartPlay)
		{
			$(this.playButtonID).css({
					"position":"absolute",
					"width":this.iconWidth,
					"height":this.iconHeight,
					"display":"inline-block",
					"bottom":0,
					"left":0,
					"right":0,
					"margin-left":"auto",
					"margin-right":"auto",
					"background-image": path,
					"z-index": 0,
					"background-position":"0 -128px"
		});
		}
		else
		{
			$(this.playButtonID).css({
					"position":"absolute",
					"width":this.iconWidth,
					"height":this.iconHeight,
					"display":"inline-block",
					"bottom":0,
					"left":0,
					"right":0,
					"margin-left":"auto",
					"margin-right":"auto",
					"background-image": path,
					"z-index": 0,
					"background-position":"64px -128px"
			});
		}
	};
	
	
	UnlimitedMessages.prototype.initEvents = function()
	{ 

		var self = this;
		$(self.leftArrowID).on("click", [this], self.leftArrowClick);
		$(self.rightArrowID).on("click", [this], self.rightArrowClick);
		$(self.playButtonID).on("click", [this], self.playButtonClick);
		//$(this.LoopSlideID).on("click", [this], self.SlidesLoop);
		
		
		// Auto loop timer event.
		self.startTransitionTimer();
		
		// hover over placeholder
		$(self.placeholderObject).on("mouseenter", [this], self.mouseEnterPlaceholder);
		$(self.placeholderObject).on("mouseleave", [this], self.mouseLeavePlaceholder);
		
		
		// hover over buttons
		$(self.leftArrowID).on("mouseenter", [this], self.mouseEnterLeftArrow);
		$(self.leftArrowID).on("mouseleave", [this], self.mouseLeaveLeftArrow);
		
		$(self.rightArrowID).on("mouseenter", [this], self.mouseEnterRightArrow);
		$(self.rightArrowID).on("mouseleave", [this], self.mouseLeaveRightArrow);
		
		$(self.playButtonID).on("mouseenter", [this], self.mouseEnterPlayButton);
		$(self.leftArrowID).on("mouseleave", [this], self.mouseLeavePlayButton);
		
		if(self.allowSwipe)
		{
			$(self.placeholderObject).on("swipeleft", [this], self.swipeLeft);
			$(self.placeholderObject).on("swiperight", [this], self.swipeRight);
		}

		//video play/pause event, stop/run slide show
		$("video").on("play", [this], self.videoPlayClick);
		$("video").on("pause", [this], self.videoPauseClick);
		
		
	}; // initEvents
 

	UnlimitedMessages.prototype.canProceed = function()
	{
		if (!this.placeholderObject) 
		{
			return false;
		}

		if (!this.messageObjCollection.length) 
		{ // There needs to be at least one message
			if (this.placeholderObject) 
			{
				this.placeholderObject.style.display = "none";
			}

			return false;
		}

		return true; 		//we can proceed
	};
  

	UnlimitedMessages.prototype.initMessageStyle = function()
	{  
		var slideWidthMax = this.maxSlideWidth(); // Returns a value that is always in pixel units.
		var slideHeightMax = this.maxSlideHeight(); // Returns a value that is always in pixel units.

		//this.placeholderObject.style.position = "relative";
		//this.placeholderObject.style.overflow = this.overflowOpt;
		$(this.placeholderObject).css({"text-align":"center", "position":"relative", "overflow":this.overflowOpt});
		//this.placeholderObject.style.width = "100%";
		//$(this.placeholderObject).animate({height: this.slideHeights[0] + 48 + "px"}, 1000);

		var slideCount = this.messageObjCollection.length;
		var totalWidth = 0;
		for (var i = 0; i < slideCount; i++) 
		{ 
			$(this.messageObjCollection[i]).css({"position":"relative", "left":totalWidth});
			//this.messageObjCollection[i].style.position = "absolute";
			//this.messageObjCollection[i].style.top = 0 + "px"; //(this.slideHeights[i] - this.messageObjCollection[i].offsetHeight) / 2 + "px";              
			//this.messageObjCollection[i].style.left = totalWidth + "px";
			$(this.messageObjCollection[i]).hide();
			totalWidth += this.slideWidths[i];
		}
		$(this.messageObjCollection[0]).show();
		
		this.updateButtonPosition();

		// initially hide buttons
		$(this.leftArrowID).hide();
		$(this.rightArrowID).hide();
		$(this.playButtonID).hide();
		

	}; // initMessageStyle
  

	UnlimitedMessages.prototype.maxSlideWidth = function()
	{
		var maxWidth = 0;
		var maxSlideIndex = 0;
		var slideCount = this.messageObjCollection.length;
		
		for (var i = 0; i < slideCount; i++) 
		{
			this.slideWidths[i] = this.messageObjCollection[i].offsetWidth;
			if (this.slideWidths[i] > maxWidth) 
			{
				maxWidth = this.slideWidths[i]; // The height of the tallest slide so far.		
				maxSlideIndex = i; // The slide with the tallest height so far.
			}
			//maxWidth = ($(this.messageObjCollection[0]).width() / $(this.placeholderObject).parent().width()) * 100;
		}

		//return this.messageObjCollection[maxSlideIndex].getBoundingClientRect().width;
		return this.messageObjCollection[maxSlideIndex].offsetWidth;
	}; // maxSlideWidth
  
   
	UnlimitedMessages.prototype.maxSlideHeight = function()
	{
		var maxHeight = 0;
		var maxSlideIndex = 0;    
		var slideCount = this.messageObjCollection.length;

		for (var i = 0; i < slideCount; i++) 
		{
			this.slideHeights[i] = this.messageObjCollection[i].offsetHeight;
			if (this.slideHeights[i] > maxHeight) 
			{
				maxHeight = this.slideHeights[i]; // The height of the tallest slide so far.		
				maxSlideIndex = i; // The slide with the tallest height so far.
			}
		}

		// set max height for each element
		//	for (var i = 0; i < slideCount; i++) {
		//		this.messageObjCollection[i].height = maxHeight;
		//   }

		return this.messageObjCollection[maxSlideIndex].offsetHeight; 
	}; // maxSlideHeight

	
	UnlimitedMessages.prototype.hideLeftArrow = function(bHide)
	{
		if(!this.showArrows)
		{
			// only show when show arrows enabled
			return;
		}
		
		if(bHide)
		{
			$(this.leftArrowID).hide();
		}
		else
		{
			$(this.leftArrowID).show();
		}
	};
	
	
	UnlimitedMessages.prototype.hideRightArrow = function(bHide)
	{
		if(!this.showArrows)
		{
			// only show when show arrows enabled
			return;
		}
		
		var obj = $(this.rightArrowID);
		if(bHide)
		{
			$(this.rightArrowID).hide();
		}
		else
		{
			$(this.rightArrowID).show();
		}
	};
	

	UnlimitedMessages.prototype.hidePlayButton = function(bHide)
	{
		if(!this.showPlayButton)
		{
			// only show when show arrows enabled
			return;
		}
		
		if(bHide)
		{
			$(this.playButtonID).hide();
		}
		else
		{
			$(this.playButtonID).show();
		}
	};
	
	
	UnlimitedMessages.prototype.updateButtonVisibility = function()
	{
		if(this.loopMessages)
		{
			// show buttons all the time when looping
			this.hideRightArrow(false);
			this.hideLeftArrow(false);
			this.hidePlayButton(false);
		}
		else
		{
			if(this.currMessageIndex == 0)
			{
				// first slide showing, hide right and show left
				this.hideRightArrow(true);
				this.hideLeftArrow(false);
			}
			else if(this.currMessageIndex == this.messageObjCollection.length - 1)
			{
				// last slide showing, dont show left button
				this.hideRightArrow(false);
				this.hideLeftArrow(true);
			}
			else
			{
				// any middle slide showing, show both buttons
				this.hideRightArrow(false);
				this.hideLeftArrow(false);
			}
			this.hidePlayButton(false);
		}
		
	};
	
	
	UnlimitedMessages.prototype.rightArrowClick = function(e)
	{
		var self = e.data[0];

		// if loop is not on and its first slide, do nothing
		if(self.currMessageIndex == 0 && !self.loopMessages)
		{
			return;
		}
		
		self.slideMessageRight();		
		self.updateButtonVisibility();
		self.updateButtonPosition();

		// stop any videos running
		self.pauseCurrentVideo();

	}; // rightArrowClick
  
  
	UnlimitedMessages.prototype.leftArrowClick = function(e)
	{
		var self = e.data[0];

		// if loop is not on and its last slide, do nothing
		if(self.currMessageIndex == self.messageObjCollection.length - 1 
			&& !self.loopMessages)
		{
			return;
		}
		
		self.slideMessageLeft();		
		self.updateButtonVisibility();
		self.updateButtonPosition();
		
		// stop any videos running
		self.pauseCurrentVideo();
		
	}; // leftArrowClick
  
  
	UnlimitedMessages.prototype.playButtonClick = function(e)
	{
		var self = e.data[0];
	  
		if(self.autoStartPlay == true)
		{
			// play Message showing, means the autoplay is stopped
			self.autoStartPlay = false;
			self.setupPlayButton();
			self.clearTransitionTimer();
		}
		else
		{
			// pause Message showing, ,means autoplay is working
			self.autoStartPlay = true;
			self.setupPlayButton();
			self.slideMessageLeft();
			self.startTransitionTimer();
		}	  
	};		// playButtonClick
  
  
	UnlimitedMessages.prototype.mouseEnterPlaceholder = function(e)
	{
		var self = e.data[0];
		if(self.autoStartPlay)
		{
			self.clearTransitionTimer();
		}
		
		// show buttons
		//$(self.leftArrowID).show();
		//$(self.rightArrowID).show();
		//$(self.playButtonID).show();
		self.updateButtonVisibility();
		self.updateButtonPosition();
		
	};
	
	
	UnlimitedMessages.prototype.mouseLeavePlaceholder = function(e)
	{
		var self = e.data[0];
		
		// hide buttons
		self.hideLeftArrow(true);
		self.hideRightArrow(true);
		self.hidePlayButton(true);
//		$(self.leftArrowID).hide();
//		$(self.rightArrowID).hide();
//		$(self.playButtonID).hide();
		
		self.startTransitionTimer();
	};
	
	
/*  UnlimitedMessages.prototype.SlidesLoop = function(e)
  {
	
	var self = e.data[0];
	if(self.slideShowRunning == false)
	{
		// this button wont work when slide show is not running.
		return;
	}
	
	if(self.loop == true)
	{
		//self.loop = false;
		if(self.allowSwipe)
		{
			$(self.LoopSlideIDP).removeClass('loop-Message').addClass('loopstop-Message');
		}
		else
		{
			$(self.LoopSlideID).removeClass('loop-Message').addClass('loopstop-Message');
		}
	}
	else
	{
		//self.loopMessages = true;
		if(self.allowSwipe)
		{
			$(self.LoopSlideIDP).removeClass('loopstop-Message').addClass('loop-Message');
		}
		else
		{
			$(self.LoopSlideID).removeClass('loopstop-Message').addClass('loop-Message');
		}
	} 
  };
  */
  
  
	UnlimitedMessages.prototype.swipeRight = function(e)
	{
		var self = e.data[0];
		
		// if loop is not on and its first slide, do nothing
		if(self.currMessageIndex == 0 && !self.loopMessages)
		{
			$(self.messageObjCollection[self.currMessageIndex])
			.animate(
			{ 
				left:'+=200' 
			}, 
			{
				duration: 'slow',
				easing: 'easeOutBack'
			})
			.animate(
			{ 
				left: 0 
			}, 
			{
				duration: 'slow',
				easing: 'easeOutBack'
			});
				
			return;
		}
		
		self.slideMessageRight();

	};	// swipeRight

	
	UnlimitedMessages.prototype.slideTransitionTimer = function(e)
	{
		var self = e;	
		
		// if loop is not on and its last slide, do nothing
		if(self.currMessageIndex == self.messageObjCollection.length - 1 
			&& !self.loopMessages)
		{				
			return;
		}
		
		self.slideMessageLeft();
	};

	
	UnlimitedMessages.prototype.swipeLeft = function(e)
	{
	
		var self = e.data[0];
		
		// if loop is not on and its last slide, do nothing
		if(self.currMessageIndex == self.messageObjCollection.length - 1 
			&& !self.loopMessages)
		{
			return;
		}	

		self.slideMessageLeft();
	
	};	// swipeLeft


	UnlimitedMessages.prototype.slideMessageLeft = function()
	{
		// check if the current slide is the last slide
		// show the first slide
		if(this.currMessageIndex == this.messageObjCollection.length - 1)
		{
			// if loop is on, go to the first slide
			this.currMessageIndex = 0;
			var l;
			//$(this.messageObjCollection[this.currMessageIndex]).show();
			for(var i = this.messageObjCollection.length - 1;i >= 0;i--)
			{
				// shift each slide right one step
				var currentSlide = this.messageObjCollection[i];
				l = this.slideWidths[i] * i;
				//$(currentSlide).animate({left:l});
				if(this.currMessageIndex == i)
				{
					$(currentSlide).animate({left:l}).show(400);
					//$(this.messageObjCollection[i]).show(1000);
				}
				else
				{
					$(currentSlide).animate({left:l}).hide(400);
					//$(this.messageObjCollection[i]).hide();
				}
			}			
			//$(this.messageObjCollection[this.currMessageIndex]).show(1000);
			
			// update the dimensions of the placeholder to the current slide
			this.updatePlaceHolderDimensions();
			this.updateButtonPosition();
			
			return;
		}
		
		// do the normal transition if not border case
		++(this.currMessageIndex);
		//$(this.messageObjCollection[this.currMessageIndex]).show();
		for(var i = 0;i < this.messageObjCollection.length;i++)
		{
			// shift each slide left
			var currentSlide = this.messageObjCollection[i];
			//$(currentSlide).animate( {left:"-=" + this.slideWidths[i]}).show();
			if(this.currMessageIndex == i)
			{
				$(currentSlide).animate( {left:"-=" + this.slideWidths[i]}).show(400);
				//$(this.messageObjCollection[i]).show(1000);
		}
			else
			{
				$(currentSlide).animate( {left:"-=" + this.slideWidths[i]}).hide(400);
				//$(this.messageObjCollection[i]).hide();
			}
		}
		//$(this.messageObjCollection[this.currMessageIndex]).show(1000)
		
		this.updatePlaceHolderDimensions();
		this.updateButtonPosition();
	};
	
	
	UnlimitedMessages.prototype.slideMessageRight = function()
	{

		// show the last slide if its a first slide
		if(this.currMessageIndex == 0)
		{
			
			this.currMessageIndex = this.messageObjCollection.length - 1;
			var l;
			for(var i = 0, counter = this.messageObjCollection.length - 1;i < this.messageObjCollection.length;i++, counter--)
			{
				// shift each slide left one step
				var currentSlide = this.messageObjCollection[i];
				l = this.slideWidths[i] * counter * -1;
				//$(currentSlide).animate({left: l});		// go to left, negative
				//$(this.messageObjCollection[i]).hide();
				if(this.currMessageIndex == i)
				{
					$(currentSlide).animate({left: l}).show(400);
			}
				else
				{
					$(currentSlide).animate({left: l}).hide(400);
				}
			
			}
			//$(this.messageObjCollection[this.currMessageIndex]).show();
			
			this.updatePlaceHolderDimensions();
			this.updateButtonPosition();
				
			return;
			
		}
		
			
		--(this.currMessageIndex);
		for(var i = 0;i < this.messageObjCollection.length;i++)
		{
			// shift each slide right one step
			var currentSlide = this.messageObjCollection[i]
			//$(currentSlide).animate( {left:"+=" + this.slideWidths[i]});
			//$(this.messageObjCollection[i]).hide();
			if(this.currMessageIndex == i)
			{
				$(currentSlide).animate( {left:"+=" + this.slideWidths[i]}).show(400);
		}
			else
			{
				$(currentSlide).animate( {left:"+=" + this.slideWidths[i]}).hide(400);
			}
		}
		//$(this.messageObjCollection[this.currMessageIndex]).show();
		
		
		this.updatePlaceHolderDimensions();
		this.updateButtonPosition();
	};
	
	
	UnlimitedMessages.prototype.updatePlaceHolderDimensions = function()
	{
		$(this.placeholderObject).animate({width: this.slideWidths[this.currMessageIndex]}, 1000);
	};
	
	
	UnlimitedMessages.prototype.updateButtonPosition = function()
	{
		//this.setupLeftArrow();
		//this.setupRightArrow();
		//this.setupPlayButton();
		/*
		$(this.leftArrowID).css({"float": "left", "margin-left":"5%"});
		$(this.rightArrowID).css({"float": "right", "margin-right":"5%"});
		
		
		// play button in center
		width = this.slideWidths[this.currMessageIndex] / 2 - $(this.playButtonID)[0].offsetWidth/2;
		height = $(this.playButtonID)[0].offsetHeight;
		$(this.playButtonID).css({"margin-left": "auto", "margin-right":"auto"});
		*/
	};
	
	
	UnlimitedMessages.prototype.mouseEnterLeftArrow = function(e)
	{
		var self = e.data[0];
		$(self.leftArrowID).css({"background-position":"0 0"});
	};
	
	
	UnlimitedMessages.prototype.mouseLeaveLeftArrow = function(e)
	{
		var self = e.data[0];
		$(self.leftArrowID).css({"background-position":"0 -64px"});
	};
	
	
	UnlimitedMessages.prototype.mouseEnterRightArrow = function(e)
	{
		var self = e.data[0];
		$(self.rightArrowID).css({"background-position":"-64px 0"});
	};
	
	
	UnlimitedMessages.prototype.mouseLeaveRightArrow = function(e)
	{
		var self = e.data[0];
		$(self.rightArrowID).css({"background-position":"-64px -64px"});
	};
	

	UnlimitedMessages.prototype.mouseEnterPlayButton = function(e)
	{
		var self = e.data[0];
		$(self.playButtonID).css("cursor", "pointer");
	};
	
	
	UnlimitedMessages.prototype.mouseLeavePlayButton = function(e)
	{
		var self = e.data[0];
		$(self.playButtonID).css("cursor", "auto");
	};
	
	
	UnlimitedMessages.prototype.startTransitionTimer = function()
	{
		if(this.autoStartPlay && !this.isAlreadyPlaying)
		{
			this.isAlreadyPlaying = true;
			this.slideShowID = window.setInterval(this.slideTransitionTimer, this.timeBetweenMessages, this);
		}
	};
	
	
	UnlimitedMessages.prototype.clearTransitionTimer = function()
	{
		this.isAlreadyPlaying = false;
		window.clearInterval(this.slideShowID);
	};

	
	UnlimitedMessages.prototype.videoPlayClick = function(e)
	{
		var self = e.data[0];
		
		self.autoStartPlay = false;
		self.setupPlayButton();
		self.clearTransitionTimer();

		//stop the last playing video if any and save the current target
		self.pauseCurrentVideo();
		self.currPlayingVideoObj = e.target;
	};
	
	
	UnlimitedMessages.prototype.videoPauseClick = function(e)
	{
		var self = e.data[0];
		
		self.autoStartPlay = true;
		self.setupPlayButton();
		self.startTransitionTimer();
		
		// no video playing
		self.currPlayingVideoObj = undefined;
		
	};

	
	UnlimitedMessages.prototype.pauseCurrentVideo = function()
	{
		if(this.currPlayingVideoObj != undefined)
		{
			$(this.currPlayingVideoObj).get(0).pause();
			this.currPlayingVideoObj = undefined;
		}
	};
	
})();		// End Unlimited Messages
