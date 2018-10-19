angular.module('partyABCreator').directive('exhibitLinked',[function() {
    return {
        restrict: 'EA',
        scope: {
            inputData: '='
        },
        templateUrl: '/views/partyABCreator/steps/exhibitLinked/exhibitLinked.html',
        controllerAs: 'el',
        controller: 'exhibitLinked.ctrl'
    };
}]);
