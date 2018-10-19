// @ngInject
(function(){
	angular.module('app.controllers')
	    .controller('ExhibitMasterAgreementModalController', exhibitMasterAgreementModalController);

	function exhibitMasterAgreementModalController($scope, toastr, $modalInstance, data,$location) {
	    $scope.data = data;
	    $scope.selected = false;

	    $scope.ok = function(){
	        $modalInstance.close($scope.selected);
	    };
	    $scope.setSelected = function(result) {
	        $scope.selected = result;
	    };

	    $scope.cancel = function(){
	        $modalInstance.dismiss("cancel");
	        $location.path('/rfa/company/exhibitTemplate/');
	    };
	}
})();