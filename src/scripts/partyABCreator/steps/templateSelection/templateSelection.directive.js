angular.module('partyABCreator').directive('templateSelection',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/templateSelection/templateSelection.html',
        controller: 'templateSelection.ctrl',
        controllerAs: 'ts'
    };
}]);
