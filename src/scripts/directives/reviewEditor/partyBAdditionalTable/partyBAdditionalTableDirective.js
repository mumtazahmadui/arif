(function() {

    function partyAdditionalTable() {
        return {
            restrict: 'EAC',
            replace: true,
            templateUrl: '/views/directives/reviewEditor/partyBAdditionalTable.html',
            controller: 'partyBAdditionalTableCtrl'
        };
    }

    angular.module('app.directives')
        .directive('partyBAdditionalTable', partyAdditionalTable);
})();
