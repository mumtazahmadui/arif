// @ngInject
(function(){
	
	angular.module('app.controllers')
	    .controller('MultiuncheckedboxModalController', multiuncheckedboxModalController);

	function multiuncheckedboxModalController($scope, $modalInstance, data,rfaGridSelection) {
	    /* jshint validthis: true */
        $scope.data = data.data;
        var indexValue = $scope.data.xtype + "_" + $scope.data.xSubtype;

	    $scope.ok = function() {
			rfaGridSelection.updateToggleSalesAuditClicked($scope.data.grid,$scope.data.index,$scope.data.xtype,$scope.data.xSubtype,$scope.data.requestStatus);
	        $modalInstance.close(data);
	    };
        
        $scope.cancel = function() {
			$scope.data.grid.dataList[$scope.data.index]["partyBEntities"][indexValue] = !$scope.data.grid.dataList[$scope.data.index]["partyBEntities"][indexValue];
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
