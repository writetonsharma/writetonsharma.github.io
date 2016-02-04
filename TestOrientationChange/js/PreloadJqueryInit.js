jQuery(document).on("mobileinit", function() {
    jQuery.mobile.autoInitializePage = false;
});
jQuery(window).on("orientationchange",function(){
    window.location.reload()
}, false); 

