(function () {
    angular.module('rfa.masterlist.template')
        .directive('linkedMasterlistTooltip', linkedMasterlistTooltip);


    function linkedMasterlistTooltip() {
        return {
            scope: {
                linkedMasterlists: '='
            },
            templateUrl: '/scripts/pages/masterlist/masterlist-template-library/cells/linked-masterlist/linkedMasterlist.template.html',
            controller: 'linkedMasterlistTooltipCtrl'
        };
    }
})();
