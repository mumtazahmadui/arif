(function() {
    angular.module('app.directives')
        .directive('mcPartyARelationsPl', partyARelationsDirective);

    function partyARelationsDirective() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/views/directives/placeholders/relationPlaceholder.html',
            scope: {
                data: '='
            }
        };
    }
})();
