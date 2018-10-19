(function(){
    'use strict';

    angular.module('app.directives')
        .directive('partyBRemovalSleeveTable', function(){
                return {
                    restrict: 'EAC',
                    templateUrl: '/scripts/directives/reviewEditor/partyBRemovalTable/sleeve-removal-table.html',
                    replace: true,
                    scope: true,
                    controller: 'SleeveRemovalTableController'
                }
        })
})();
