// @ngInject
(function(){
	
	angular.module('app.controllers')
	    .controller('ManagerModalController', managerModalController);

	function managerModalController($scope, $modalInstance, data,rfaGridSelection, myStatusService) {
		$scope.data = data;
		var grid = $scope.data.data.grid;
		var index = $scope.data.data.index;
		var isFrom = true;

		$scope.index =  myStatusService.mystatus.getDesk2Index
		$scope.name =  myStatusService.mystatus.getDesk2Name

		var managerSelect = grid.dataList[index].amendmentDeskTwoStatus;
		if (managerSelect) {
			$scope.title = 'Unchecking '+ $scope.index +' indicates that '+ $scope.name +' checks are not complete. Please confirm.';
		} else {
			$scope.title = 'Clicking on  '+ $scope.index +' indicates that '+ $scope.name +' checks have been completed. Please confirm.';			
		}

	    $scope.ok = function() {
			rfaGridSelection.toogleAllManagerEntity(grid,index,isFrom);
			$modalInstance.close(data);
	    };

	    $scope.cancel = function() {
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
