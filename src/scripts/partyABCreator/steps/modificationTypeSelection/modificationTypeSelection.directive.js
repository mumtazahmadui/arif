angular.module('partyABCreator').directive('modificationTypeSelection',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/modificationTypeSelection/modificationTypeSelection.html',
        controllerAs: 'ms',
        controller: 'modificationTypeSelection.ctrl'
    };
}]);
