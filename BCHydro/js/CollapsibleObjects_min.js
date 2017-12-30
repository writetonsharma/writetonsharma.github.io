CollapsibleObjects=function(e){this.setDefaults(),this.setOpts(this,e),this.errorCheck()||(this.saveToPersistentData(e),this.initEvents(),this.init())},CollapsibleObjects.affectedStyleCollection={},CollapsibleObjects.buttonCollection={},CollapsibleObjects.ClickableCollapseCollection={},CollapsibleObjects.prototype.saveToPersistentData=function(e){var t={elementType:"CObjectsRow",htmlSourceStyle:e.htmlSourceStyle,htmlAffectedStyle:e.htmlAffectedStyle,htmlCollapsedByDefault:e.htmlCollapsedByDefault,htmlRetainSpace:e.htmlRetainSpace,htmlExpandCollapsesOthers:e.htmlExpandCollapsesOthers};if(void 0==CollapsibleObjects.affectedStyleCollection[t.htmlAffectedStyle])CollapsibleObjects.affectedStyleCollection[t.htmlAffectedStyle]=[t];else{var l=CollapsibleObjects.affectedStyleCollection[t.htmlAffectedStyle];for(len=l.length,bflag=!1,i=0;i<len;i++)if(l[i].htmlSourceStyle==t.htmlSourceStyle){bflag=!0;break}bflag||l.push(t)}void 0==CollapsibleObjects.buttonCollection[e.htmlSourceStyle]&&(CollapsibleObjects.buttonCollection[e.htmlSourceStyle]=e)},CollapsibleObjects.prototype.setDefaults=function(){this.elementType=void 0,this.htmlSourceStyle=void 0,this.htmlAffectedStyle=void 0,this.htmlOrigAffectedStyle=void 0,this.htmlDisplayWhen="collapsed",this.htmlCollapsedByDefault=!0,this.htmlRetainSpace=!0,this.htmlExpandCollapsesOthers=!0,this.htmlCommonStyle=".CObject",this.htmlActivationEvent="click",this.literal=!0,this.bTouchDevice=!1,"ontouchstart"in document.documentElement&&(this.bTouchDevice=!0)},CollapsibleObjects.prototype.setOpts=function(e,t){if(t){for(var l in t)void 0!=t[l]&&(e[l]=t[l]);$(e.htmlSourceStyle).hover(function(){$(this).css("cursor","pointer")})}},CollapsibleObjects.prototype.errorCheck=function(){return".undefined"==this.htmlSourceStyle||".undefined"==this.htmlAffectedStyle||".undefined"==this.elementType},CollapsibleObjects.prototype.initEvents=function(){var e=this;"click"==e.htmlActivationEvent?$(e.htmlSourceStyle).on("click",[this],e.CObjectButtonClicked):e.bTouchDevice?($(e.htmlSourceStyle).on("touchstart",[this],e.CObjectButtonClicked),$(e.htmlSourceStyle).on("touchend",[this],e.CObjectButtonClicked)):($(e.htmlSourceStyle).on("mouseenter",[this],e.CObjectButtonClicked),$(e.htmlSourceStyle).on("mouseout",[this],e.CObjectButtonClicked))},CollapsibleObjects.prototype.init=function(){this.initAffectedStyles(),this.initSource()},CollapsibleObjects.prototype.CObjectButtonClicked=function(e){var t=e.data[0];t.updateAffectedStyles(t),t.updateButtonGroup(t)},CollapsibleObjects.prototype.initAffectedStyles=function(){var e=CollapsibleObjects.affectedStyleCollection[this.htmlAffectedStyle];if(void 0!=e){var t=e[e.length-1];1==t.htmlCollapsedByDefault?this.showElement(this.htmlAffectedStyle,!1,t.htmlRetainSpace):this.showElement(this.htmlAffectedStyle,!0,t.htmlRetainSpace)}},CollapsibleObjects.prototype.initSource=function(){var e=CollapsibleObjects.buttonCollection[this.htmlSourceStyle];if(void 0!=e)if("both"!=e.htmlDisplayWhen){var t=CollapsibleObjects.affectedStyleCollection[this.htmlAffectedStyle][0];void 0!=t&&("collapsed"==e.htmlDisplayWhen&&1==t.htmlCollapsedByDefault?this.showElement(this.htmlSourceStyle,!0,!1):"collapsed"==e.htmlDisplayWhen&&0==t.htmlCollapsedByDefault?this.showElement(this.htmlSourceStyle,!1,!1):"expanded"==e.htmlDisplayWhen&&1==t.htmlCollapsedByDefault?this.showElement(this.htmlSourceStyle,!1,!1):"expanded"==e.htmlDisplayWhen&&0==t.htmlCollapsedByDefault&&this.showElement(this.htmlSourceStyle,!0,!1))}else this.showElement(this.htmlSourceStyle,!0,!1)},CollapsibleObjects.prototype.showElement=function(e,t,l){l?t?$(e).css("visibility","visible"):$(e).css("visibility","hidden"):t?$(e).show():$(e).hide()},CollapsibleObjects.prototype.initSourceVisibility=function(e){e?"collapsed"==this.htmlDisplayWhen?($(this.htmlClickableElement1).hide(),$(this.htmlClickableElement2).show()):"expanded"==this.htmlDisplayWhen&&($(this.htmlClickableElement1).show(),$(this.htmlClickableElement2).hide()):"collapsed"==this.htmlDisplayWhen?($(this.htmlClickableElement1).show(),$(this.htmlClickableElement2).hide()):"expanded"==this.htmlDisplayWhen&&($(this.htmlClickableElement1).hide(),$(this.htmlClickableElement2).show())},CollapsibleObjects.prototype.updateAffectedStyles=function(e){"both"==e.htmlDisplayWhen?$(e.htmlAffectedStyle).each(function(t,l){e.isTrulyVisible($(l).parents("table").eq(0))&&(e.isElementVisibile(l,CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlRetainSpace)?e.showElement(l,!1,CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlRetainSpace):(CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlExpandCollapsesOthers&&e.collapseAffectedStyleGroup(e,l,CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlRetainSpace),e.showElement(l,!0,CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlRetainSpace)))}):"collapsed"==e.htmlDisplayWhen?$(e.htmlAffectedStyle).each(function(t,l){e.isTrulyVisible($(l).parents("table").eq(0))&&(CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlExpandCollapsesOthers&&e.collapseAffectedStyleGroup(e,l,CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlRetainSpace),e.showElement(l,!0,CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlRetainSpace))}):"expanded"==e.htmlDisplayWhen&&$(e.htmlAffectedStyle).each(function(t,l){e.isTrulyVisible($(l).parents("table").eq(0))&&e.showElement(l,!1,CollapsibleObjects.affectedStyleCollection[e.htmlAffectedStyle][0].htmlRetainSpace)})},CollapsibleObjects.prototype.collapseAffectedStyleGroup=function(e,t,l){for(i=2;i>=0;i--){var o=$(t).parents("table").eq(i);if(o.length)break}e.literal?$(o).find(e.htmlOrigAffectedStyle).each(function(t,i){for(affectedTable=$(i).parents("table").eq(0),r=$(affectedTable).get(0).rows,t=0;t<r.length;t++)e.showElement($(r[t]),!1,l)}):$(o).find(e.htmlOrigAffectedStyle).each(function(t,i){e.showElement(i,!1,l)})},CollapsibleObjects.prototype.isElementVisibile=function(e,t){return t?"visible"==$(e).css("visibility"):"none"!=$(e).css("display")},CollapsibleObjects.prototype.updateButtonGroup=function(e){$(e.htmlAffectedStyle).each(function(t,l){for(t=2;t>=0;t--){var i=$(l).parents("table").eq(t);if(i.length)break}$(i).find(e.htmlOrigAffectedStyle).each(function(t,l){var l=$(l).attr("class").split(" ");for(var i in l){var o=CollapsibleObjects.affectedStyleCollection["."+l[i]];if(void 0!=o){e.updatePairButton(e,o[0].htmlAffectedStyle);break}}})})},CollapsibleObjects.prototype.updatePairButton=function(e,t){var l=CollapsibleObjects.affectedStyleCollection[t];if(void 0!=l){var o=e.isElementVisibile(t,CollapsibleObjects.affectedStyleCollection[t][0].htmlRetainSpace);for(len=l.length,i=0;i<len;i++){var s=CollapsibleObjects.buttonCollection[l[i].htmlSourceStyle];"both"!=s.htmlDisplayWhen&&("collapsed"==s.htmlDisplayWhen?o?$(s.htmlSourceStyle).each(function(t,l){e.showElement(l,!1,!1)}):$(s.htmlSourceStyle).each(function(t,l){e.showElement(l,!0,!1)}):"expanded"==s.htmlDisplayWhen&&(o?$(s.htmlSourceStyle).each(function(t,l){e.showElement(l,!0,!1)}):$(s.htmlSourceStyle).each(function(t,l){e.showElement(l,!1,!1)})))}}},CollapsibleObjects.prototype.isTrulyVisible=function(e){return $(e).is(":visible")};