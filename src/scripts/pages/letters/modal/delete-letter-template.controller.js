(function(){
	angular.module('rfa.letters')
	    .controller('DeleteLetterTemplateModalController', deleteLetterTemplateModalController);

	// @ngInject
	function deleteLetterTemplateModalController($scope, toastr, $modalInstance, data) {
	    /* jshint validthis: true */
	    $scope.data = data;
	    $scope.ok = ok;
	    $scope.cancel = cancel;

	    activate();

	    function activate() {

	    };

	    function ok(data) {
	        $modalInstance.close(data);
	    };
	    function cancel() {
	        $modalInstance.dismiss('cancel');
	    };
	}
})();

