(function() {
    angular.module('rfa.components').directive('rfaIframeDoubleScroll', function($timeout) {
        return {
            restrict: 'A',
            controller: function(){
                function setMinHeight(height){
                    this.minHeight = height;
                }

                this.setMinHeight = setMinHeight;
            },
            link: function(scope, element, attrs, ctrl) {
                var iframeSelector = scope.$eval(attrs.iframeSelector),
                    iframe = $(window.parent.document).find(iframeSelector || attrs.iframeSelector)
                ;
                if (!iframe || !iframe[0]) {
                    // throw Error('ddIframeDoubleScroll:wrong iframe selector');
                }

                //shortly, we have set iframe margin-bottom for -10px and external scroller will dissapear
                iframe.css('margin-bottom', '-10px');

                /*if (window.self !== window.parent) {
                    $('body').css("overflow", "hidden");
                    $('html').css("overflow", "hidden");
                    var iframe,
                        iframeOffset;

                    iframe = $(window.parent.document).find(iframeSelector || attrs.iframeSelector);
                    if (!iframe || !iframe[0]) {
                        throw Error('iframeDoubleScroll:wrong iframe selector');
                    }
                    iframeOffset = iframe.offset().top;
                    iframe.attr("scrolling", "no");

                    $(window.parent.document.body).css("overflow", "auto");

                    scope.$watch(function() {
                        return $(element).outerHeight();
                    }, function() {
                        $timeout(setIframeHeight);
                    });
                }

                function setIframeHeight () {
                    var appHeight = $(element).outerHeight(true);
                    if(ctrl.minHeight && appHeight < ctrl.minHeight) {
                        appHeight = ctrl.minHeight;
                    }

                    if (appHeight + iframeOffset > getParentViewportHeight()) {
                        iframe.height(appHeight);
                    } else {
                        iframe.height(getParentViewportHeight() - iframeOffset);
                    }
                    var realHeight = (appHeight + iframeOffset > getParentViewportHeight()) ? appHeight : (getParentViewportHeight() - iframeOffset);
                    iframe.height(realHeight);
                    $('body').height(realHeight);
                    $('html').height(realHeight);
                }

                function getParentViewportHeight() {
                    return window.parent.innerHeight;
                }*/
            }
        };
    });
})();
