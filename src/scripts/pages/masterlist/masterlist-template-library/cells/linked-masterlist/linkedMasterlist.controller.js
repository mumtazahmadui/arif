(function() {
    angular.module('rfa.masterlist.template')
        .controller('linkedMasterlistTooltipCtrl', linkedMasterlistTooltipCtrl);

    function linkedMasterlistTooltipCtrl($scope) {
        $scope.templateUrl = '/scripts/pages/masterlist/masterlist-template-library/cells/linked-masterlist/template/linkedMasterlistTable.template.html';
    }
})();