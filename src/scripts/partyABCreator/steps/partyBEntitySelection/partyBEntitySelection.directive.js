angular.module('partyABCreator').directive('partyBEntitySelection',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/partyBEntitySelection/partyBEntitySelection.html',
        controllerAs: 'es',
        controller: 'partyBEntitySelection.ctrl'
    };
}]);
