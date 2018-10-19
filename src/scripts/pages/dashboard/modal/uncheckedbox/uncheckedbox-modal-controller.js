// @ngInject
(function(){
	
	angular.module('app.controllers')
	    .controller('UncheckedboxModalController', uncheckedboxModalController);

	function uncheckedboxModalController($scope, $modalInstance, data,rfaGridSelection) {
	    /* jshint validthis: true */
        $scope.data = data.data;
        var indexValue = $scope.data.xtype + "_" + $scope.data.xSubtype;

	    $scope.ok = function() {
            rfaGridSelection.updateSalesAuditClicked($scope.data.grid,$scope.data.row,$scope.data.index,$scope.data.xtype,$scope.data.xSubtype,$scope.data.requestStatus);
	        $modalInstance.close(data);
	    };
        
        $scope.cancel = function() {
			$scope.data.row[indexValue] = !$scope.data.row[indexValue];
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
