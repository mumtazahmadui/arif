/**
 * Progress/Left Steps indicator
 * ### Used for:
 *
 *     GLOBAL, RFA flow
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

angular.module('app.directives').directive('progressIndicator', progressIndicator);

function progressIndicator() {
    return {
        restrict: 'E',
        scope: {
            state: '='
        },
        templateUrl: '/views/directives/ProgressIndicator.html',
        link: function(scope, element, attributes) {
            init();
            attributes.$observe('labels',function() {
                init();
            });
            function init() {
                scope.labels = attributes.labels.split(',');
            }
        }
    };
}
