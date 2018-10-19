angular.module('partyABCreator').directive('draftSaved',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/draftSaved/draftSaved.html',
        controllerAs: 'ds',
        controller: 'draftSaved.ctrl'
    };
}]);
