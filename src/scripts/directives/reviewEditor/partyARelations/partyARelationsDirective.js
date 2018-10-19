(function() {

    function partyARelations() {
        return {
            restrict: 'EAC',
            replace: true,
            templateUrl: '/views/directives/reviewEditor/partyARelations.html',
            controller: 'partyARelationsCtrl'
        };
    }

    angular.module('app.directives')
        .directive('partyARelations', partyARelations);
})();
