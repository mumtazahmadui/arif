// @ngInject
(function(){
	
	angular.module('app.controllers')
	    .controller('LegalModalController', legalModalController);

	function legalModalController($scope, $modalInstance, data,rfaGridSelection,myStatusService) {
	    /* jshint validthis: true */
		$scope.data = data;
		var grid = $scope.data.data.grid;
		var index = $scope.data.data.index;
		var isFrom = true;

		$scope.index =  myStatusService.mystatus.getDesk1Index
		$scope.name =  myStatusService.mystatus.getDesk1Name

		var legalSelect = grid.dataList[index].amendmentDeskOneStatus;
		
		if (legalSelect) {
			$scope.title = 'Unchecking '+ $scope.index +' indicates that '+ $scope.name +' checks are not complete. Please confirm.';
		} else {
			$scope.title = 'Clicking on '+ $scope.index +' indicates that '+ $scope.name +' checks have been completed. Please confirm.';
		}

	    $scope.ok = function() {
			rfaGridSelection.toogleAllLegalEntity(grid,index,isFrom);
			$modalInstance.close(data);
	    };

	    $scope.cancel = function() {
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
