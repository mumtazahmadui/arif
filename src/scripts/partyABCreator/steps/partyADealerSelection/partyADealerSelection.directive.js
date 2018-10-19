angular.module('partyABCreator').directive('partyADealerSelection',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/partyADealerSelection/partyADealerSelection.html',
        controllerAs: 'ds',
        controller: 'partyADealerSelection.ctrl'
    };
}]);
