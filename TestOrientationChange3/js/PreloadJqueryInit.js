var currDev;
var deviceCount = 0;
devices = {};

jQuery(document).on("mobileinit",function()
{
	jQuery.mobile.autoInitializePage=!1
}),
window.addEventListener("orientationchange",function()
{
	var width = $(window).width();
	dev = getDevice(width);
	if(dev != currDev)
	{
		window.location.reload()
	}
	currDev = dev;
},!1);

getDevice = function(width)
{
	var currRange = 0;
	for(i = 0;i < deviceCount;i++)
	{
		if(i == (deviceCount - 1))
		{
			currRange++;	//biggest device
			return currRange;
		}
		
		if(width >= devices[i] 
			&& width < devices[i + 1])
		{
			break;
		}
		currRange++;
	}
	
	return currRange;
}

$( document ).load()
{	
	var links = $('link');
	$(links).each(function() {
		
		if($(this).attr('rel') == 'stylesheet' 
			&& (str = $(this).attr('media')) != undefined)
		{
			if(deviceCount == 0)
			{
				devices[deviceCount++] = 0;		// starts from 0
			}
			
			var dw = str.match(/\d+/);
			devices[deviceCount++] = dw[0];
		}
	});

	currDev = deviceCount;
	
	var width = $(window).width();
	currDev = getDevice(width);
}
