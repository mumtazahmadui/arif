(function(){
	// @ngInject

	angular.module('app.controllers')
	    .controller('SSAmendmentLetterController', ssAmendmentLetterController);

	function ssAmendmentLetterController($scope, $state, TasksPendingService, taskPendingConfigs, DoughnutService, AmendmentLetterActions,ScreenerService,$rootScope,$timeout) {
	    /* jshint validthis: true */
	    var vm = this;
	    vm.data = {};
		vm.data.tasks = {};
		vm.init = true;

	    $scope.isSellSidePendingTask = function(task) {
	        return _.contains(taskPendingConfigs.allowedTasks.sellSide, task.id);
	    };

	    activate();
        $scope.$on('bulkAction', function(event, data){
            var action = AmendmentLetterActions[data.action.method](data.rows);

            if (action && action.then) {
                vm.processing = true;
                action.then(function() {
                    vm.processing = false;
                    $state.go('rfa.dashboard', {}, {reload: true});
                }, function() {
                    vm.processing = false;
                });
            }
		});

		$scope.$on('activatedTabs',function(event,index) {
			if (promise) $timeout.cancel(promise);
			var promise = $timeout( function(){
				vm.data.tabs[index].active = true
				promise = null;
			}, 500);
		})

		$scope.tabSelection = function (index) {
			if (index === 1) ScreenerService.onCompletedTabs = true;
			if (index === 0) ScreenerService.onCompletedTabs = false;
			if (!vm.init) {
				$rootScope.$broadcast('updatedTabs');
			}
			vm.init = false;
			return
		}

		$scope.tabDeSelection = function (index) {
			// $rootScope.$broadcast('handleClosed');
		}

	    function activate() {
	        vm.data.tabs = [
				{
					id: 'rfa',
					templateURL: '/scripts/pages/dashboard/tabs/ss-rfa.html',
					title: 'Request for Amendment',
					active: true,
					disabled: false
				},
				{
					id: 'completedRfa',
					templateURL: '/scripts/pages/dashboard/tabs/ss-completed-rfa.html',
					slug: 'completeRfa',
					title: 'Completed RFA',
					active: false,
					disabled: false
				}];
	        return getTasksPending()
	            .then(function() {});
	    }

	    function doughnutUpdate() {
	        getTasksPending()
	            .then(function() {
	                DoughnutService.updated(vm.data.tasks.request);
	            });
	    }
	    $scope.$on('doughnutUpdate', doughnutUpdate);

	    function getTasksPending() {
	        return TasksPendingService.get({'companyId': 1})
	            .success(function(data) {
	                vm.data.tasks.pending = parseTasksObject(data.data, 'pendingTasks');
	                vm.data.tasks.request = parseTasksObject(data.data, 'requestStatus');

	                return vm.data.tasks;
	            })
	            .error(function() {
	            });
	    }

	    function parseTasksObject(data, obj) {
	        var keys = Object.keys(data[obj]);
	        var regexp = /[A-Z]/g;
	        var separator = ' ';

	        var result = keys.map(function(title) {
	            if ((['completed', 'partiallyCompleted', 'recalled', 'received', 'rejected','deleted'].indexOf(title) > -1 && obj === 'requestStatus') ||
	                 (obj === 'pendingTasks')) {
	                var item = {};
	                item.id = title;

	                item.title = title.replace(regexp, function(letter, pos) {
	                    return (pos ? separator : '') + letter.toUpperCase();
	                });

	                item.value = data[obj][title];

	                return item;
	            }
	        });

	        return result.filter(function(n) { return n !== undefined; });

	    }
	}

})();
