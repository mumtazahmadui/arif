// @ngInject
(function () {
	angular.module('rfa.dashboard')
		.controller('RFADeleteModalController', rfaDeleteModalController);

	function rfaDeleteModalController(
		$scope, $modalInstance, data, AmendmentLetter, appConfig,$rootScope
	) {
		/* jshint validthis: true */
		$scope.data = data;
		$scope.data.reason = "";
        $scope.confirm=false;
		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.callDeleteRfa = function (data) {
			$scope.confirm=true;
			return AmendmentLetter.deleteRfa(data)
				.success(function (data) {
					$modalInstance.dismiss('cancel');
					$rootScope.$broadcast("screenerUpdate" ,true);
					$scope.confirm=false;
				}).error(function () {
					$scope.confirm=false;
				});
		}
	}
})();
