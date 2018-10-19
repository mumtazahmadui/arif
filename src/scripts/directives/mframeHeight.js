(function() {
    angular
        .module('app.services')
        .directive('mframeHeight', ['$window', function($window) {
            return {
                restrict: 'A',
                link: function(scope, element) {
                    if ($window.self === $window.parent) {
                        return;
                    }
                    $('body').css({
                        'overflow': 'hidden'
                    });

                    var iframe = $($window.parent.document).find('iframe.MFrame');
                    var iframeOffset = iframe.offset().top;

                    scope.$watch(function() {
                        return element.outerHeight();
                    }, function() {
                        var appHeight = element.outerHeight(true);
                        var parentHeight = $window.parent.innerHeight;
                        iframe.height(
                            (appHeight + iframeOffset !== parentHeight) ?
                                appHeight
                                : (parentHeight - iframeOffset)
                        );
                    });
                }
            };
        }]);
})();
