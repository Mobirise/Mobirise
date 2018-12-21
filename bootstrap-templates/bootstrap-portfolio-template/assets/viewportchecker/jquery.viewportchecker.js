/*
    The MIT License (MIT)

    Copyright (c) 2014 Dirk Groenen

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
*/
!function(c){c.fn.viewportChecker=function(g){var e={classToAdd:"visible",classToRemove:"invisible",classToAddForFullView:"full-visible",removeClassAfterAnimation:!1,offset:100,repeat:!1,invertBottomOffset:!0,callbackFunction:function(c,e){},scrollHorizontal:!1,scrollBox:window};c.extend(e,g);var n=this,k=c(e.scrollBox).height(),p=c(e.scrollBox).width();return this.checkElements=function(){var f,h;e.scrollHorizontal?(f=Math.max(c("html").scrollLeft(),c("body").scrollLeft(),c(window).scrollLeft()),
h=f+p):(f=Math.max(c("html").scrollTop(),c("body").scrollTop(),c(window).scrollTop()),h=f+k);n.each(function(){var a=c(this),b={},d={};if(a.data("vp-add-class")&&(d.classToAdd=a.data("vp-add-class")),a.data("vp-remove-class")&&(d.classToRemove=a.data("vp-remove-class")),a.data("vp-add-class-full-view")&&(d.classToAddForFullView=a.data("vp-add-class-full-view")),a.data("vp-keep-add-class")&&(d.removeClassAfterAnimation=a.data("vp-remove-after-animation")),a.data("vp-offset")&&(d.offset=a.data("vp-offset")),
a.data("vp-repeat")&&(d.repeat=a.data("vp-repeat")),a.data("vp-scrollHorizontal")&&(d.scrollHorizontal=a.data("vp-scrollHorizontal")),a.data("vp-invertBottomOffset")&&(d.scrollHorizontal=a.data("vp-invertBottomOffset")),c.extend(b,e),c.extend(b,d),!a.data("vp-animated")||b.repeat){0<String(b.offset).indexOf("%")&&(b.offset=parseInt(b.offset)/100*k);var d=b.scrollHorizontal?a.offset().left:a.offset().top,g=b.scrollHorizontal?d+a.width():d+a.height(),l=Math.round(d)+b.offset,m=b.scrollHorizontal?l+
a.width():l+a.height();b.invertBottomOffset&&(m-=2*b.offset);l<h&&m>f?(a.removeClass(b.classToRemove),a.addClass(b.classToAdd),b.callbackFunction(a,"add"),g<=h&&d>=f?a.addClass(b.classToAddForFullView):a.removeClass(b.classToAddForFullView),a.data("vp-animated",!0),b.removeClassAfterAnimation&&a.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",function(){a.removeClass(b.classToAdd)})):a.hasClass(b.classToAdd)&&b.repeat&&(a.removeClass(b.classToAdd+" "+b.classToAddForFullView),
b.callbackFunction(a,"remove"),a.data("vp-animated",!1))}})},("ontouchstart"in window||"onmsgesturechange"in window)&&c(document).bind("touchmove MSPointerMove pointermove",this.checkElements),c(e.scrollBox).bind("load scroll",this.checkElements),c(window).resize(function(f){k=c(e.scrollBox).height();p=c(e.scrollBox).width();n.checkElements()}),this.checkElements(),this}}(jQuery);var isBuilder=$("html").hasClass("is-builder");
isBuilder||$(".counters").each(function(){$(this).viewportChecker({callbackFunction:function(c,g){$("#"+c.attr("id")+" .count").each(function(){$(this).prop("Counter",0).animate({Counter:$(this).text()},{duration:3E3,easing:"swing",step:function(c){$(this).text(Math.ceil(c))}})})}})});
