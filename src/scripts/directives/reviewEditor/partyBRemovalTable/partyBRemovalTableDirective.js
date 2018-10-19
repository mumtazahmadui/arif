(function() {

    function partyBRemovalTable() {
        return {
            restrict: 'EAC',
            replace: true,
            templateUrl: '/views/directives/reviewEditor/partyBRemovalTable.html',
            controller: 'partyBRemovalTableController'
        };
    }

    angular.module('app.directives')
        .directive('partyBRemovalTable', partyBRemovalTable);
})();
