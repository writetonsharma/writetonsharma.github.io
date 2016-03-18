
/*****************************************************
CollapsibleObjects.js - V0.1
CSF Designer 15.0.0

Copyright (c) 2015-16. FIS.
*****************************************************/


(function() {		//Begin CollapsibleObjects

	
	CollapsibleObjects = function(opts)
	{
		
		// initialization
		this.setDefaults();
		this.setOpts(this, opts);	
		
		// check if necessary parameters are set
		if(this.errorCheck())
		{
			return;
		}
		
		this.saveToPersistentData(opts);
		this.initEvents();
		
		this.init();		
	};
	
	// persistent data
	CollapsibleObjects.affectedStyleCollection = {};
	CollapsibleObjects.buttonCollection = {};
	CollapsibleObjects.ClickableCollapseCollection = {};

	
	CollapsibleObjects.prototype.saveToPersistentData = function(opts)
	{
		var rowOpts = {elementType:"CObjectsRow", htmlSourceStyle:opts.htmlSourceStyle, htmlAffectedStyle: opts.htmlAffectedStyle, htmlCollapsedByDefault:opts.htmlCollapsedByDefault,
							htmlRetainSpace:opts.htmlRetainSpace, htmlExpandCollapsesOthers:opts.htmlExpandCollapsesOthers};
		if(CollapsibleObjects.affectedStyleCollection[rowOpts.htmlAffectedStyle] == undefined)
		{
			CollapsibleObjects.affectedStyleCollection[rowOpts.htmlAffectedStyle] = [rowOpts];
		}
		else
		{
			var optsArray = CollapsibleObjects.affectedStyleCollection[rowOpts.htmlAffectedStyle];
			
			// only add if rowOpts do not already exist;
			len = optsArray.length;
			bflag = false;
			for(i = 0;i < len;i++)
			{
				if(optsArray[i].htmlSourceStyle == rowOpts.htmlSourceStyle)
				{
					bflag = true;
					break;
				}
			}
			if(!bflag)
			{
				optsArray.push(rowOpts);
			}			
		}
		
		// if not already saved
		if(CollapsibleObjects.buttonCollection[opts.htmlSourceStyle] == undefined)
		{
			CollapsibleObjects.buttonCollection[opts.htmlSourceStyle] = opts;
		}
	};
	
	CollapsibleObjects.prototype.setDefaults = function()
	{
		// Type of element, a button or row ?
		this.elementType = undefined;
		
		// ID of element whose state is this instance of class
		this.htmlSourceStyle = undefined;

		// ID of the element on which to act, hide/show it.
		this.htmlAffectedStyle = undefined;
		
		// When do you want to show the clicked element.
		// Collapsed means when @htmlAffectedStyle is collapsed, show this element
		// Expanded means when @htmlAffectedStyle is expanded, show this element
		// So a + sign will hide itself on expansion and a - sign will show. 
		// On collapse the - sign will hide and a + sign will show back again.
		// + and - can be anything, be a text, image or both.
		this.htmlDisplayWhen = "collapsed";
		
		// Do we want to collapse @htmlAffectedStyle at start
		this.htmlCollapsedByDefault = true;
		
		// Do we want to retain space of @htmlAffectedStyle
		this.htmlRetainSpace = true;
		
		// On expansion of one element, do we want to collapse all other already expanded elements in the group
		this.htmlExpandCollapsesOthers = true;
		
		// common style name of target
		this.htmlCommonStyle = ".CObject";
		
		// Click or hover event ?
		this.htmlActivationEvent = "click";
		
		// touch device ?
		this.bTouchDevice = false;
		if (("ontouchstart" in document.documentElement)) {
			this.bTouchDevice = true;
		}		
	};
	
	CollapsibleObjects.prototype.setOpts = function(obj, options)
	{		
		if (!options)
			return;
		
		for (var option in options)
		{
			if (options[option] == undefined)
				continue;
			
			obj[option] = options[option];
		}
		
		$(obj.htmlSourceStyle).hover(function() {
			$(this).css("cursor","pointer")
		});		
	};
	
	CollapsibleObjects.prototype.errorCheck = function()
	{
		if(this.htmlSourceStyle == ".undefined"
		|| this.htmlAffectedStyle == ".undefined"
		|| this.elementType == ".undefined")
		{
			return true;
		}
		
		return false;
	};
	
	CollapsibleObjects.prototype.initEvents = function()
	{
		var self = this;
		if(self.htmlActivationEvent == "click")
		{
			$(self.htmlSourceStyle).on("click", [this], self.CObjectButtonClicked);
		}
		else
		{
			if(bTouchDevice)
			{
				//touchstart and touchend for touch devices
				$(self.htmlSourceStyle).on("touchstart", [this], self.CObjectButtonClicked);
				$(self.htmlSourceStyle).on("touchend", [this], self.CObjectButtonClicked);
			}
			else
			{
				// Actual hover event for non touch devices
				$(self.htmlSourceStyle).on("mouseenter", [this], self.CObjectButtonClicked);
				$(self.htmlSourceStyle).on("mouseout", [this], self.CObjectButtonClicked);
			}
		}
	};
	
	CollapsibleObjects.prototype.init = function()
	{
		// update affected style visibility
		this.initAffectedStyles();
		
		this.initSource();
		
	};
	
	CollapsibleObjects.prototype.CObjectButtonClicked = function(e)
	{
		//var clickedElement = e.target;
		var self = e.data[0];

		// update content
		self.updateAffectedStyles(self);
		
		// hide show pair button(s) if any
		self.updateButtonGroup(self);
	};
	
	CollapsibleObjects.prototype.initAffectedStyles = function()
	{
		var optArray = CollapsibleObjects.affectedStyleCollection[this.htmlAffectedStyle];
		if(optArray == undefined)
		{
			return;
		}
		
		var opt = optArray[optArray.length - 1];
		if(opt["htmlCollapsedByDefault"] == true)
		{
			this.showElement(this.htmlAffectedStyle, false, opt["htmlRetainSpace"]);
		}
		else
		{
			this.showElement(this.htmlAffectedStyle, true, opt["htmlRetainSpace"]);
		}		
	};
	
	CollapsibleObjects.prototype.initSource = function()
	{
		var optsSource = CollapsibleObjects.buttonCollection[this.htmlSourceStyle];
		if(optsSource == undefined)
		{
			return;
		}
		
		if(optsSource["htmlDisplayWhen"] == "both")
		{
			this.showElement(this.htmlSourceStyle, true, false);
			return;
		}
		
		var optsTarget = CollapsibleObjects.affectedStyleCollection[this.htmlAffectedStyle][0];
		if(optsTarget == undefined)
		{
				return;
		}
		
		if(optsSource["htmlDisplayWhen"] == "collapsed" &&
			optsTarget["htmlCollapsedByDefault"] == true)
		{
			this.showElement(this.htmlSourceStyle, true, false);
		}
		else if(optsSource["htmlDisplayWhen"] == "collapsed" &&
			optsTarget["htmlCollapsedByDefault"] == false)
		{
			this.showElement(this.htmlSourceStyle, false, false);
		}
		else if(optsSource["htmlDisplayWhen"] == "expanded" &&
			optsTarget["htmlCollapsedByDefault"] == true)
		{
			this.showElement(this.htmlSourceStyle, false, false);
		}
		else if(optsSource["htmlDisplayWhen"] == "expanded" &&
			optsTarget["htmlCollapsedByDefault"] == false)
		{
			this.showElement(this.htmlSourceStyle, true, false);
		}		
	};
	
	CollapsibleObjects.prototype.showElement = function(element, bShow, bRetainSpace)
	{
		if(bRetainSpace)
		{
			if(bShow)
			{				
				$(element).css("visibility", "visible");
			}
			else
			{
				$(element).css("visibility", "hidden");
			}
		}
		else
		{
			if(bShow)
			{
				$(element).show();
			}
			else
			{
				$(element).hide();
			}
		}		
	};
	
	CollapsibleObjects.prototype.initSourceVisibility = function(bTargetVisibile)
	{
		if(bTargetVisibile)
		{
			// set the initial visibility of the source/clickable element
			if(this.htmlDisplayWhen == "collapsed")
			{
				$(this.htmlClickableElement1).hide();
				$(this.htmlClickableElement2).show();
			}
			else if(this.htmlDisplayWhen == "expanded")
			{
				$(this.htmlClickableElement1).show();
				$(this.htmlClickableElement2).hide();
			}
		}
		else
		{
			if(this.htmlDisplayWhen == "collapsed")
			{
				$(this.htmlClickableElement1).show();
				$(this.htmlClickableElement2).hide();
			}
			else if(this.htmlDisplayWhen == "expanded")
			{
				$(this.htmlClickableElement1).hide();
				$(this.htmlClickableElement2).show();
			}
		}		
	};
		
	CollapsibleObjects.prototype.updateAffectedStyles = function(self)
	{
		if(self.htmlDisplayWhen == "both")
		{
			// its a toggle button
			// iterate each affected style and toggle the visibility
			// update the group depending on affected style visibility and @htmlExpandCollapsesOthers
			$(self.htmlAffectedStyle).each(function(i, e) {
				var bVisible = self.isElementVisibile(e, CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlRetainSpace);
				if(bVisible)
				{
					// its already expanded, collapse it
					self.showElement(e, false, CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlRetainSpace);
				}
				else
				{
					// it is collapsed, expand it
					if(CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlExpandCollapsesOthers)
					{
						// collapse the group
						self.collapseAffectedStyleGroup(self, e, CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlRetainSpace);
					}
					self.showElement(e, true, CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlRetainSpace);					
				}				
			});
		}
		else if(self.htmlDisplayWhen == "collapsed")
		{
			// this button can only be clicked when affected style is collapsed
			// iterate each affected style element and expand it
			// collapse the group depending on @htmlExpandCollapsesOthers
			$(self.htmlAffectedStyle).each(function(i, e) {				
				// collapse all the group
				if(CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlExpandCollapsesOthers)
				{
					// collapse the group
					self.collapseAffectedStyleGroup(self, e, CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlRetainSpace);
				}
				// expand correct affected style element
				self.showElement(e, true, CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlRetainSpace);
			});
		}
		else if(self.htmlDisplayWhen == "expanded")
		{
			// this button can only be clicked when affected style is expanded
			// iterate each affected style element and collapse it
			// don't do anything with the group
			$(self.htmlAffectedStyle).each(function(i, e) {
				self.showElement(e, false, CollapsibleObjects.affectedStyleCollection[self.htmlAffectedStyle][0].htmlRetainSpace);
			});
		}
	};
	
	CollapsibleObjects.prototype.collapseAffectedStyleGroup = function(self, element, bRetainSpace)
	{
		// only hide all @htmlCommonStyle inside parent table at second level
		// if nothing found, seach at same level
		var outerTable = $(element).parents("table").eq(1);
		if(!outerTable.length)
		{
			// same level
			outerTable = $(element).parents("table").eq(0);
		}
		$(outerTable).find(self.htmlCommonStyle).each(function(i, e) {
			self.showElement(e, false, bRetainSpace);
		});	
		
		// collapse all other affected styles
		//self.collapseAffectedStyleGroup(self, outerTable, bRetainSpace);
		
		// collapse/expand other buttons
		//self.collapseButtonGroup(self, outerTable, bRetainSpace);		
	};
	
	CollapsibleObjects.prototype.isElementVisibile = function(elementID, bRetainSpace)
	{
		//var element = $(elementID)[0];
		var bVisible = true;
		
		if(bRetainSpace)
		{
			var v = $(elementID).css("visibility");
			if(v == "visible")
			{
				bVisible = true;
			}
			else
			{
				bVisible = false;
			}
		}
		else
		{
			var d = $(elementID).css("display");
			if(d == "none")
			{
				bVisible = false;
			}
			else
			{
				bVisible = true;
			}			
		}
		
		return bVisible;
	};
		
	CollapsibleObjects.prototype.updateButtonGroup = function(self)
	{
		$(self.htmlAffectedStyle).each(function(i, element) {
			
			// try in parent table, otherwise at the same level
			var outerTable = $(element).parents("table").eq(1);
			if(!outerTable.length)
			{
				// same level
				outerTable = $(element).parents("table").eq(0);
			}
			$(outerTable).find(self.htmlCommonStyle).each(function(i, e) {
				var e = $(e).attr("class").split(' ');
				for(var a in e)
				{
					// take out button collection for affected style and update them
					var buttonArray = CollapsibleObjects.affectedStyleCollection["." + e[a]];
					if(buttonArray != undefined)
					{
						self.updatePairButton(self, buttonArray[0].htmlAffectedStyle);
						break;
					}					
				}
			});
		});	
	};
	
	CollapsibleObjects.prototype.updatePairButton = function(self, affectedStyle)
	{
		var buttonArray = CollapsibleObjects.affectedStyleCollection[affectedStyle];
		if(buttonArray == undefined)
		{
			return;	// code will never reach here!
		}
		
		// is affected style currently visible or hidden ?
		var bVisible = self.isElementVisibile(affectedStyle, CollapsibleObjects.affectedStyleCollection[affectedStyle][0].htmlRetainSpace);
		
		// get each button and update
		len = buttonArray.length;
		for(i = 0;i < len;i++)
		{
			// get the button object and query for @htmlDisplayWhen
			var obj = CollapsibleObjects.buttonCollection[buttonArray[i].htmlSourceStyle];
			if(obj.htmlDisplayWhen == "both")
			{
				continue;
			}
			else if(obj.htmlDisplayWhen == "collapsed")
			{
				if(bVisible)
				{
					// expanded, hide it button
					$(obj.htmlSourceStyle).each(function(i, e) {
						self.showElement(e, false, false);
					});
				}
				else
				{
					// collapsed, show the button
					$(obj.htmlSourceStyle).each(function(i, e) {
						self.showElement(e, true, false);
					});
				}
			}
			else if(obj.htmlDisplayWhen == "expanded")
			{
				if(bVisible)
				{
					// expanded, show the button
					$(obj.htmlSourceStyle).each(function(i, e) {
						self.showElement(e, true, false);
					});
				}
				else
				{
					// collapsed, hide the button
					$(obj.htmlSourceStyle).each(function(i, e) {
						self.showElement(e, false, false);
					});
				}	
			}
		}
	};
	
})();		// End CollapsibleObjects
