jQuery(document).on("mobileinit", function() {
    jQuery.mobile.autoInitializePage = false;
});
jQuery(window).on("orientationchange",function(){
	alert(window.orientation);
    window.location.reload()
}, false); 

