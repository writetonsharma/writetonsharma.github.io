
(function() {		//Begin UnlimitedMessages

UnlimitedMessages = function(element, opts)
{
	
	var self = this;
	this.element = this.getElement(element);
	this.LoopSlideID= "#nav-loop";
	this.name = "hello";
	
	$(this.LoopSlideID).on("click", [this], self.SlidesLoop);
};

  UnlimitedMessages.prototype.SlidesLoop = function(e)
  {
	  var self = e.data[0];
	  alert(self.name);
  };
  
UnlimitedMessages.prototype.getElement = function(ele)
{
	if (ele && typeof ele == "string")
		return document.getElementById(ele);
	return ele;
};

}) ();
