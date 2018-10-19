(function() {

    function datePinned() {
        return {
            restrict: 'EAC',
            replace: true,
            templateUrl: '/views/directives/reviewEditor/datePinned.html',
            controller: 'datePinnedCtrl'
        };
    }

    angular.module('app.directives')
        .directive('datePinned', datePinned);
})();
