/**
 * Screener with wide functionality
 * @author IvanPanarin <ipanarin@luxoft.com>
 */

// @ngInject
function screener() {
    return {
        restrict: 'E',
        templateUrl: '/scripts/components/screener/main.html',
        controller: function() {},
        scope: {},
        link: function() {}
    };
}

angular
    .module("app.directives")
    .directive("screener", screener);