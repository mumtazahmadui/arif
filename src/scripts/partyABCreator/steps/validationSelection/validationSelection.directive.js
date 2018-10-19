angular.module('partyABCreator').directive('validationSelection',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/validationSelection/validationSelection.html',
        controller: 'validationSelection.ctrl',
        controllerAs: 'vs'
    };
}]);
