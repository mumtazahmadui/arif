// @ngInject
(function(){
	
	angular.module('app.controllers')
	    .controller('ConfirmRecallModalController', confirmRecallModalController);

	function confirmRecallModalController($scope, $modalInstance, data) {
	    /* jshint validthis: true */
	    $scope.data = data;

	    $scope.ok = function() {
	        $modalInstance.close(data);
	    };

	    $scope.cancel = function() {
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
