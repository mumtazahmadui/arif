angular.module('app.directives').directive('slimScroll', [
    '$parse',
    function($parse) {
        return {
        restrict: 'AC',
        link: function(scope, element, attrs) {
            var defaultSetttings = {
                alwaysVisible: true,
                height: 'auto',
                color: '#02A9D1'
            };
            attrs.$observe('settings', function() {
                draw();
            });
            function draw() {
                var settings = $parse(attrs.settings)(scope);

                if (settings) {
                    angular.extend(defaultSetttings, settings);
                }
                if (attrs.showScroll) {
                    var isShow = $parse(attrs.showScroll)(scope);
                    if (isShow) {
                        $(element).slimScroll(defaultSetttings);
                    }
                } else {
                    $(element).slimScroll(defaultSetttings);
                }
            }
            draw();
        }
    };
    }]);
