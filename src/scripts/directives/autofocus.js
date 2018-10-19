// @ngInject
function autofocus($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element) {
            $timeout(function() {
                $element[0].focus();
            });
        }
    };
}

angular
    .module('app.directives')
    .directive('autofocus', autofocus);
