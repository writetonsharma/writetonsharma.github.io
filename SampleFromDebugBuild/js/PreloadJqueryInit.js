jQuery(document).on("mobileinit", function() {
    jQuery.mobile.autoInitializePage = false;
});
window.addEventListener("orientationchange", function() {
    window.location.reload()
}, false); 
