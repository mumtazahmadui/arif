(function() {

    function partyBFundNameChange() {
        return {
            restrict: 'EAC',
            replace: true,
            templateUrl: '/views/directives/reviewEditor/partyBFundNameChange.html',
            controller: 'partyBFundNameChangeCtrl'
        };
    }

    angular.module('app.directives')
        .directive('partyBFundNameChange', partyBFundNameChange);
})();
