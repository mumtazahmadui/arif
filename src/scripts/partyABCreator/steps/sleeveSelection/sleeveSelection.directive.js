angular.module('partyABCreator').directive('sleeveSelection',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/sleeveSelection/sleeveSelection.html',
        controllerAs: 'ss',
        controller: 'sleeveSelection.ctrl'
    };
}]);