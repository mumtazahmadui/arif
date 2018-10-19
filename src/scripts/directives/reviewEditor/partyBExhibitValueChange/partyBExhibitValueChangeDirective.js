(function() {

    function partyBExhibitValueChange() {
        return {
            restrict: 'EAC',
            replace: true,
            templateUrl: '/views/directives/reviewEditor/partyBExhibitValueChange.html',
            controller: 'partyBExhibitValueChangeCtrl'
        };
    }

    angular.module('app.directives')
        .directive('partyBExhibitValueChange', partyBExhibitValueChange);
})();
