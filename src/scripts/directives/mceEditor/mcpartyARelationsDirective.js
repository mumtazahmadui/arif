(function() {
    angular.module('app.directives')
        .directive('mcPartyARelations', partyARelationsDirective);

    function partyARelationsDirective() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class=\'tiny-mce tiny-editor\'></div>',
            scope: {
                model: '='
            },
            link: function(scope, element) {
                if (scope.model) {
                    element.html(scope.model.getData().partyAText);
                    scope.model.onSave(function() {
                        return element.clone();
                    });
                }
            }
        };
    }
})();
