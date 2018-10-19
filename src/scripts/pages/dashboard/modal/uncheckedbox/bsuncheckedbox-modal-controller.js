// @ngInject
(function(){
	
	angular.module('app.controllers')
	    .controller('BsuncheckedboxModalController', bsuncheckedboxModalController);

	function bsuncheckedboxModalController($scope, $modalInstance, data,rfaGridSelection) {
	    /* jshint validthis: true */
        $scope.data = data;

	    $scope.ok = function() {
            if ($scope.data.data.tab == 'legal') {
                rfaGridSelection.toogleLegalEntityRow(
                    $scope.data.data.grid,
                    $scope.data.data.row,
                    $scope.data.data.index,
                    $scope.data.data.selected);
            }
            if ($scope.data.data.tab == 'manager') {
                rfaGridSelection.toogleManagerEntityRow(
                    $scope.data.data.grid,
                    $scope.data.data.row,
                    $scope.data.data.index,
                    $scope.data.data.selected);
            }
	        $modalInstance.close(data);
	    };
        
        $scope.cancel = function() {
            if ($scope.data.data.tab == 'legal') {
                $scope.data.data.row.deskStatus.deskOneStatus = !$scope.data.data.row.deskStatus.deskOneStatus
            }
            if ($scope.data.data.tab == 'manager') {
                $scope.data.data.row.deskStatus.deskTwoStatus = !$scope.data.data.row.deskStatus.deskTwoStatus;
            }
            $modalInstance.dismiss('cancel');
	    };
	}
})();
