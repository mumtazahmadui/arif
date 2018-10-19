(function() {

    function exhibitTable() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
                queueService: '='
            },
            templateUrl: '/views/directives/reviewEditor/exhibitTable.html',
            controller: 'exhibitTableController'
        };
    }

    angular.module('app.directives')
        .directive('exhibitTable', exhibitTable);
})();
