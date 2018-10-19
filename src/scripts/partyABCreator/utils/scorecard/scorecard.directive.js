angular.module('partyABCreator.utils').directive('utilsScorecard',[
    function() {
        return {
            restrict: 'E',
            scope: {
                steps: '='
            },
            templateUrl: '/views/partyABCreator/utils/scorecard/scorecard.html',
            link: function() {

            }
        };
    }
]);
