(function(){

	angular.module('app.controllers')
	    .controller('WithdrawnModalController', withdrawnModalController);

	// @ngInject

	function withdrawnModalController($scope, toastr, $modalInstance, data, $timeout) {
	    /* jshint validthis: true */
	    $scope.data = data;
	    $scope.isIE = navigator.appName === 'Microsoft Internet Explorer';

	    $timeout(fixScroll, 100);

	    $scope.ok = function() {
	        data.selected = [];

	        angular.forEach(data.data, function(item) {
	             if (item.selected === true) {
	                 delete item.selected;
	                 data.selected.push(item);
	             }
	         });

	        if (data.selected.length !== 0) {
	            $modalInstance.close(data);
	        }
	    };

	    $scope.cancel = function() {
	        $modalInstance.dismiss('cancel');
	    };

	    function fixScroll() {
	        if ($scope.isIE) {
	            $('.dropdown-menu').css({
	                position: 'absolute'
	            });
	        }

	        $('.scroll-area-blue').slimScroll({
	            alwaysVisible: true,
	            height: 'auto',
	            color: '#02A9D1',
	            opacity: '1'
	        });

	        $('.scroll-area').slimScroll({
	            alwaysVisible: true,
	            height: 'auto',
	            color: '#B4C9DA'
	        }).css('width', '98%');

	        $('.scroll-area-small').slimScroll({
	            alwaysVisible: true,
	            height: 'auto',
	            color: '#4C525A'
	        });
	    }
	}

})();

