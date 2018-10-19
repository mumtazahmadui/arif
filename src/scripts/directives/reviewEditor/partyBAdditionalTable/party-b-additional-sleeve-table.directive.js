(function(){
    'use strict';

    angular.module('app.directives')
        .directive('partyBAdditionalSleeveTable', 
            function(){
                return {
                    restrict: 'EAC',
                    templateUrl: '/scripts/directives/reviewEditor/partyBAdditionalTable/sleeve-additional-table.html',
                    replace: true,
                    scope: true,
                    controller: 'SleeveAdditionalTableController'
                }
            }
    )
})();
