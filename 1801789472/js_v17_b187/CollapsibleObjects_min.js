CollapsibleObjects=function(e){this.setDefaults(),this.setOpts(this,e),this.errorCheck()||(this.saveToPersistentData(e),this.initEvents(),this.init())},CollapsibleObjects.affectedStyleCollection={},CollapsibleObjects.buttonCollection={},CollapsibleObjects.ClickableCollapseCollection={},CollapsibleObjects.prototype.saveToPersistentData=function(e){var t={et:"CObjectsRow",hss:e.hss,hass:e.hass,hcbd:e.hcbd,hrs:e.hrs,heco:e.heco};if(void 0==CollapsibleObjects.affectedStyleCollection[t.hass])CollapsibleObjects.affectedStyleCollection[t.hass]=[t];else{var l=CollapsibleObjects.affectedStyleCollection[t.hass];for(len=l.length,bflag=!1,i=0;i<len;i++)if(l[i].hss==t.hss){bflag=!0;break}bflag||l.push(t)}void 0==CollapsibleObjects.buttonCollection[e.hss]&&(CollapsibleObjects.buttonCollection[e.hss]=e)},CollapsibleObjects.prototype.setDefaults=function(){this.et=void 0,this.hss=void 0,this.hass=void 0,this.hoas=void 0,this.hdw="collapsed",this.hcbd=!0,this.hrs=!0,this.heco=!0,this.htmlCommonStyle=".CObject",this.hae="click",this.lrl=!0,this.bTouchDevice=!1,"ontouchstart"in document.documentElement&&(this.bTouchDevice=!0)},CollapsibleObjects.prototype.setOpts=function(e,t){if(t){for(var l in t)void 0!=t[l]&&(e[l]=t[l]);$(e.hss).hover(function(){$(this).css("cursor","pointer")})}},CollapsibleObjects.prototype.errorCheck=function(){return".undefined"==this.hss||".undefined"==this.hass||".undefined"==this.et},CollapsibleObjects.prototype.initEvents=function(){var e=this;"click"==e.hae?$(e.hss).on("click",[this],e.CObjectButtonClicked):e.bTouchDevice?($(e.hss).on("touchstart",[this],e.CObjectButtonClicked),$(e.hss).on("touchend",[this],e.CObjectButtonClicked)):($(e.hss).on("mouseenter",[this],e.CObjectButtonClicked),$(e.hss).on("mouseout",[this],e.CObjectButtonClicked))},CollapsibleObjects.prototype.init=function(){if(this.initAffectedStyles(),this.initSource(),""!=this.hecop){var e=this.hoas.substring(1,this.hoas.length);$(this.hass).removeClass(e),$(this.hass).addClass(this.hecop)}},CollapsibleObjects.prototype.CObjectButtonClicked=function(e){var t=e.data[0];t.updateAffectedStyles(t),t.updateButtonGroup(t)},CollapsibleObjects.prototype.initAffectedStyles=function(){var e=CollapsibleObjects.affectedStyleCollection[this.hass];if(void 0!=e){var t=e[e.length-1];1==t.hcbd?this.showElement(this.hass,!1,t.hrs):this.showElement(this.hass,!0,t.hrs)}},CollapsibleObjects.prototype.initSource=function(){var e=CollapsibleObjects.buttonCollection[this.hss];if(void 0!=e)if("both"!=e.hdw){var t=CollapsibleObjects.affectedStyleCollection[this.hass][0];void 0!=t&&("collapsed"==e.hdw&&1==t.hcbd?this.showElement(this.hss,!0,!1):"collapsed"==e.hdw&&0==t.hcbd?this.showElement(this.hss,!1,!1):"expanded"==e.hdw&&1==t.hcbd?this.showElement(this.hss,!1,!1):"expanded"==e.hdw&&0==t.hcbd&&this.showElement(this.hss,!0,!1))}else this.showElement(this.hss,!0,!1)},CollapsibleObjects.prototype.showElement=function(e,t,l){l?t?$(e).css("visibility","visible"):$(e).css("visibility","hidden"):t?$(e).show():$(e).hide()},CollapsibleObjects.prototype.initSourceVisibility=function(e){e?"collapsed"==this.hdw?($(this.htmlClickableElement1).hide(),$(this.htmlClickableElement2).show()):"expanded"==this.hdw&&($(this.htmlClickableElement1).show(),$(this.htmlClickableElement2).hide()):"collapsed"==this.hdw?($(this.htmlClickableElement1).show(),$(this.htmlClickableElement2).hide()):"expanded"==this.hdw&&($(this.htmlClickableElement1).hide(),$(this.htmlClickableElement2).show())},CollapsibleObjects.prototype.updateAffectedStyles=function(e){var t=[];if("both"==e.hdw){if($(e.hass).each(function(l,i){e.isTrulyVisible($(i).parents("table").eq(0))&&(e.isElementVisible(i,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs)?e.showElement(i,!1,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs):(CollapsibleObjects.affectedStyleCollection[e.hass][0].heco&&(""!=e.hecop?t.push(i):e.collapseAffectedStyleGroup(e,i,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs)),""==e.hecop&&e.showElement(i,!0,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs)))}),""!=e.hecop)for(e.collapseAffectedStyleGroup(e,null,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs),s=0;s<t.length;s++){var l=t[s],i=e.hasRetainSpace(l);e.showElement(l,!0,i)}}else if("collapsed"==e.hdw){if($(e.hass).each(function(l,i){e.isTrulyVisible($(i).parents("table").eq(0))&&(CollapsibleObjects.affectedStyleCollection[e.hass][0].heco&&(""!=e.hecop?t.push(i):e.collapseAffectedStyleGroup(e,i,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs)),""==e.hecop&&e.showElement(i,!0,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs))}),""!=e.hecop){e.collapseAffectedStyleGroup(e,null,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs);for(var s=0;s<t.length;s++){var l=t[s],i=e.hasRetainSpace(l);e.showElement(l,!0,i)}}}else"expanded"==e.hdw&&$(e.hass).each(function(t,l){e.isTrulyVisible($(l).parents("table").eq(0))&&e.showElement(l,!1,CollapsibleObjects.affectedStyleCollection[e.hass][0].hrs)})},CollapsibleObjects.prototype.collapseAffectedStyleGroup=function(e,t,l){if(""==e.hecop){for(i=5;i>=0;i--){var s=$(t).parents("table").eq(i);if(s.length)break}e.lrl?""!=e.hecop?$(s).find(e.hoas).each(function(t,i){e.showElement(i,!1,l)}):$(s).find(e.hoas).each(function(t,i){for(affectedTable=$(i).parents("table").eq(0),r=$(affectedTable).get(0).rows,t=0;t<r.length;t++)e.showElement($(r[t]),!1,l)}):$(s).find(e.hoas).each(function(t,i){e.showElement(i,!1,l)})}else e.collapseAffectedStyleGroupDocLevel(e,t,l)},CollapsibleObjects.prototype.collapseAffectedStyleGroupDocLevel=function(e,t,l){$("."+e.hecop).each(function(t,l){var i=e.hasRetainSpace(l);e.showElement(l,!1,i)})},CollapsibleObjects.prototype.isElementVisible=function(e,t){return t?"visible"==$(e).css("visibility"):"none"!=$(e).css("display")},CollapsibleObjects.prototype.updateButtonGroup=function(e){""==e.hecop?$(e.hass).each(function(t,l){for(t=5;t>=0;t--){var i=$(l).parents("table").eq(t);if(i.length)break}$(i).find(e.hoas).each(function(t,l){var i=$(l).attr("class").split(" ");for(var s in i){var o=CollapsibleObjects.affectedStyleCollection["."+i[s]];if(void 0!=o){e.updatePairButton(e,l,o[0].hass);break}}})}):e.updateButtonGroupPrefix(e)},CollapsibleObjects.prototype.updateButtonGroupPrefix=function(e){$("."+e.hecop).each(function(t,l){var i=$(l).attr("class").split(" ");for(var s in i){var o=CollapsibleObjects.affectedStyleCollection["."+i[s]];if(void 0!=o){e.updatePairButton(e,l,o[0].hass);break}}})},CollapsibleObjects.prototype.updatePairButton=function(e,t,l){var s=CollapsibleObjects.affectedStyleCollection[l];if(void 0!=s){var o=e.hasRetainSpace($(t)),a=e.isElementVisible(l,o);for(len=s.length,i=0;i<len;i++){var c=CollapsibleObjects.buttonCollection[s[i].hss];"both"!=c.hdw&&("collapsed"==c.hdw?a?$(c.hss).each(function(t,l){e.showElement(l,!1,!1)}):$(c.hss).each(function(t,l){e.showElement(l,!0,!1)}):"expanded"==c.hdw&&(a?$(c.hss).each(function(t,l){e.showElement(l,!0,!1)}):$(c.hss).each(function(t,l){e.showElement(l,!1,!1)})))}}},CollapsibleObjects.prototype.isTrulyVisible=function(e){return $(e).is(":visible")},CollapsibleObjects.prototype.hasRetainSpace=function(e){var t=!1,l=$(e).attr("class").split(" ");for(var i in l){var s=CollapsibleObjects.affectedStyleCollection["."+l[i]];if(void 0!=s){t=s[0].hrs;break}}return t};