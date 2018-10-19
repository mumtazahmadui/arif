// @ngInject
(function(){
	angular.module('app.controllers')
	    .controller('PartyBRequestedModalController', partyBRequestedModalController);

	function partyBRequestedModalController($scope, toastr, $modalInstance, data, PartyBRequestedService) {
	    /* jshint validthis: true */
	    $scope.data = data;
	    $scope.ok = ok;
	    $scope.cancel = cancel;

	    activate();

	    function activate() {

	        return getPartyBRequested(data.type, data.id)
	            .then(function() {

	            });
	    };

	    function getPartyBRequested(type, id) {
	        return PartyBRequestedService.get({type: type, id: id})
	            .success(function(data) {
	                $scope.data.vm = data.requests;
	                return $scope.data.vm;
	            })
	            .error(function() {
	            });
	    };

	    function ok(data) {
	        $modalInstance.close(data);
	    };
	    function cancel() {
	        $modalInstance.dismiss("cancel");
	    };
	}
})();
