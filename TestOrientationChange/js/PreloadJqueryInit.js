jQuery(document).on("mobileinit", function() {
    jQuery.mobile.autoInitializePage = false;
});
window.addEventListener("orientationchange", function() {
	alert(window.orientation);
    window.location.reload()
}, false); 

