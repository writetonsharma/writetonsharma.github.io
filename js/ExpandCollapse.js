/*****************************************************
expandCollapse.js - V0.1
CSF Designer 13.0.0

Copyright (c) 2013. FIS.
*****************************************************/

(function() {		//Begin expand collapse

ExpandCollapse = function(element, opts)
{
	var self = this;
	jQuery(element).each(function(i) 
	{		
		jQuery(this).before(self.getExpandDiv());
	});
	
	jQuery(".expanded").each(function(i)
	{
		jQuery(this).addClass("eclink_expand");
		jQuery(this).text("[ - ]");
		
		jQuery(this).click(function()
		{
			if(jQuery(this).hasClass("expanded"))
			{
				var width = jQuery(this).next("div").outerWidth();
				jQuery(this).next("div").fadeIn().hide(600).slideUp();
				jQuery(this).css("width", width);
				jQuery(this).removeClass("eclink_expand");
				jQuery(this).removeClass("expanded");
				jQuery(this).addClass("eclink_collapse");
				jQuery(this).addClass("collapsed");
				jQuery(this).text("[ + ]  " + jQuery(this).next("div").attr("name"));				
			}
			else
			{				
				jQuery(this).removeClass("eclink_collapse");
				jQuery(this).removeClass("collapsed");
				jQuery(this).addClass("eclink_expand");
				jQuery(this).addClass("expanded");
				jQuery(this).css("width","");
				jQuery(this).text("[ - ]");
				jQuery(this).next("div").fadeOut().show(600).slideDown();	
			}
		});
		
		jQuery(this).mouseenter(function()
		{
			jQuery(this).addClass("eclink_bold");
		}).mouseleave(function()
		{
			jQuery(this).removeClass("eclink_bold");
		});
	});	
};

ExpandCollapse.prototype.getExpandDiv = function()
{
	return "<div class=\"expanded eclink_font\" ><span class=\"f1\"></span></div>";
};

ExpandCollapse.prototype.getCollapseDiv = function()
{
	return "<div class=\"collapsed eclink_font\" ><span class=\"f1\"></span></div>";
};

})();