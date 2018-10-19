angular.module('partyABCreator').directive('exhibitSelection',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/exhibitSelection/exhibitSelection.html',
        controllerAs: 'es',
        controller: 'exhibitSelection.ctrl'
    };
}]);
