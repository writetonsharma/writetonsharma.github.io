var currDev, deviceCount = 0;
devices = {}, jQuery(document).on("mobileinit", function() {
    jQuery.mobile.autoInitializePage = !1
}), window.addEventListener("orientationchange", function() {
    var e = $(window).innerWidth();
    dev = getDevice(e), dev != currDev && window.location.reload(), currDev = dev
}, !1), getDevice = function(e) {
    var t = 0;
    for (i = 0; i < deviceCount; i++) {
        if (i == deviceCount - 1) return ++t;
        if (e >= devices[i] && e < devices[i + 1]) break;
        t++
    }
    return t
}, $(document).load();
var links = $("link");
$(links).each(function() {
    if ("stylesheet" == $(this).attr("rel") && null != (str = $(this).attr("media"))) {
        0 == deviceCount && (devices[deviceCount++] = 0);
        var e = str.match(/\d+/);
        devices[deviceCount++] = e[0]
    }
}), currDev = deviceCount;
var width = $(window).innerWidth();
currDev = getDevice(width);