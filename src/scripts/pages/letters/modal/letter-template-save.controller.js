(function(){

	angular.module('rfa.letters')
	    .controller('LetterTemplateSaveModalController', letterTemplateSaveModalController);

	// @ngInject
	function letterTemplateSaveModalController($scope, toastr, $modalInstance, data) {
	    /* jshint validthis: true */
	    $scope.data = data.data;
	    $scope.ok = ok;
	    $scope.cancel = cancel;

	    activate();

	    function activate() {

	    };

	    function ok() {
	        $modalInstance.close($scope.data);
	    };

	    function cancel() {
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
