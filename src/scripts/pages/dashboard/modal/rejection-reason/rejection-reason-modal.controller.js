(function(){
	angular
	    .module('app.controllers')
	    .controller('RejectionReasonModalController', [
	    '$scope', 'toastr', '$modalInstance', '$timeout',
	    function($scope, toastr, $modalInstance, $timeout) {
	        /* jshint validthis: true */
	        $scope.reason = '';
	        $scope.isShowErrors = true;
	        $scope.isDisabled = true;
	        $scope.isIE = navigator.appName === 'Microsoft Internet Explorer';

	        //check first changes
	        $scope.$watch('reason', function(newValue, oldValue) {
	            if (newValue !== oldValue) {
	                $scope.isShowErrors = true;
	                $scope.isDisabled = true;
	            }
	            $scope.isDisabled = !newValue || !newValue.length;
	        });

	        $scope.confirm = function() {
	            if (!$scope.saveDialog.$valid) {
	                return;
	            }
	            $scope.isShowErrors = true;

	            $modalInstance.close({
	                reason: $scope.reason
	            });
	        };

	        $scope.exit = function() {
	            $modalInstance.dismiss('cancel');
	        };

	        (function() {
	            function fixScroll() {
	                if ($scope.isIE) {
	                    $(".dropdown-menu").css({
	                        'position': 'absolute'
	                    });
	                }

	                $('.scroll-area-blue').slimScroll({
	                    alwaysVisible: true,
	                    height: "auto",
	                    color: "#02A9D1",
	                    opacity: "1"
	                });

	                $('.scroll-area').slimScroll({
	                    alwaysVisible: true,
	                    height: "auto",
	                    color: "#B4C9DA"
	                }).css('width', '98%');

	                $('.scroll-area-small').slimScroll({
	                    alwaysVisible: true,
	                    height: "auto",
	                    color: "#4C525A"
	                });
	            }

	            $timeout(fixScroll, 100);
	        })();
	    }]);
})();
