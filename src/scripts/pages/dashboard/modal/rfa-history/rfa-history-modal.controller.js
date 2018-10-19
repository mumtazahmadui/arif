// @ngInject
(function(){
	angular.module('rfa.dashboard')
	    .controller('RFAHistoryModalController', rfaHistoryModalController);

	function rfaHistoryModalController(
	    $scope, toastr, $modalInstance, data, AmendmentLetter, $window, CredentialsService, appConfig, $timeout
	) {
	    /* jshint validthis: true */
	    $scope.data = data;
	    $scope.date_format = appConfig.date_format;
	    $scope.isIE = navigator.appName === 'Microsoft Internet Explorer';

	    $scope.openFile = function(id) {
	        $window.open(
	            appConfig.api_host + 'company/' +
	            CredentialsService.companyId() +
	            '/files/open_file/' + id
	        );
	    };

	    $scope.ok = function(data) {
	        $modalInstance.close(data);
	    };

	    $scope.cancel = function() {
	        $modalInstance.dismiss('cancel');
	    };

	    (function() {
	        function fixScroll() {
	            if ($scope.isIE) {
	                $('.dropdown-menu').css({
	                    'position': 'absolute'
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

	        function getRFAHistory() {
	            return AmendmentLetter.getHistory({
	                id: data.id
	            }).success(function(data) {
	                $scope.data.vm = data;
	                $scope.data.vm.rows && $scope.data.vm.rows.forEach(function(item) {
	                    if (item.TRANSITION_DATE) {
	                        var pts = item.TRANSITION_DATE.split(' '), dts = pts[1].split('.');
	                        pts[1] = dts[0];
	                        while (dts[1].length < 3) {
	                            dts[1] += '0';
	                        }
	                        pts[1] = dts.join('.');
	                        item.TRANSITION_DATE = new Date(pts.join('T'));
	                    }
	                });

	                return $scope.data.vm;
	            }).error(function() {
	            });
	        }

	        getRFAHistory().then(function() {
	            $timeout(fixScroll, 100);
	        });
	    })();
	}
})();
