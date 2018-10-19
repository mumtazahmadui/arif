// @ngInject
(function(){

	angular.module('app.controllers')
	    .controller('legalModalController', legalModalController);

	function legalModalController($scope, $modalInstance, data,rfaGridSelection,CredentialsService,legalService,$window) {
        /* jshint validthis: true */
        $scope.config = {
            loaded:false,
            message:null,
            waiting:false,
            preveiwWaiting:false,
            maxlength:2000
        }

        $scope.isAllSelected = false;
        $scope.rows = data.data.rows;
        $scope.userSelectedIds = [];

        init().then(function(response){
            $scope.users = response;
            if ($scope.users.length) {
                angular.forEach($scope.users, function(element) {
                    element.selected = false;
                });
            }
            $scope.config.loaded = true;
            $scope.$apply();
        }).catch(function() {
            $scope.config.loaded = true;
            $scope.$apply();
        })

        function init() {
            return new Promise(function(reslove,reject) {
                var getUser = CredentialsService.getUserNotification('legal');
                getUser.then(function(data) {
                    reslove(data.data.data);
                }).catch(function(error) {
                    reject(error);
                })
            })
        }

        $scope.removeDuplicates = function(arr){
            var unique_array = []
            for(var i = 0;i < arr.length; i++){
                if(unique_array.indexOf(arr[i]) == -1){
                    unique_array.push(arr[i])
                }
            }
            return unique_array
        }

		$scope.preveiwEmail = function(rows) {
            $scope.config.preveiwWaiting = true;
            var partyBid = [];
            var amendmentIds = [];

            if(rows.length) {
                _.forEach(rows, function(value) {
                    partyBid.push(value.id);
                    amendmentIds.push(value.amendmentId);
                  });
            }

            amendmentIds = $scope.removeDuplicates(amendmentIds);

			var options = {
				"message": $scope.config.message,
				"partyBIds" : partyBid
			}

			legalService.previewEmail('Legal',options).then(function(resp) {
                $scope.config.preveiwWaiting = false;
				var html = resp.data;
				var newWindow = $window.open();
				newWindow.document.write(html);
			}).catch(function(error) {
                $scope.config.preveiwWaiting = false;
			})
		}

		$scope.notification = function(rows) {
			var partyBid = [];
            var amendmentIds = [];

            if(rows.length) {
                _.forEach(rows, function(value) {
                    partyBid.push(value.id);
                    amendmentIds.push(value.amendmentId);
                  });
            }

            amendmentIds = $scope.removeDuplicates(amendmentIds);

			var options = {
                "message": $scope.config.message,
                "userIds": $scope.userSelectedIds,
                "amendmentIds": amendmentIds,
                "partyBIds" : partyBid
           }

           legalService.notify('Legal',options)
            .then(function(resp) {
                $scope.config.waiting = false;
                $modalInstance.close(data);
            })
            .catch(function(error) {
                $scope.config.waiting = false;
			})
		}

		$scope.addUser = function(item) {
			item.selected = !item.selected;
			if(item.selected) {
				$scope.add(item.userId);
			} else {
				$scope.remove(item.userId);
			}
		}

		$scope.add = function(userId) {
			$scope.userSelectedIds.push(userId);
			$scope.holdToggleAll();
		}

		$scope.remove = function(userId) {
			var index = $scope.userSelectedIds.indexOf(userId);
			$scope.userSelectedIds.splice(index, 1);
			$scope.holdToggleAll();
		}

		$scope.holdToggleAll = function() {
			if ($scope.userSelectedIds.length) {
				if ($scope.userSelectedIds.length === $scope.users.length) {
					$scope.isAllSelected = true;
				} else {
                    $scope.isAllSelected = false;
                }
			} else {
				$scope.isAllSelected = false;
            }
		}

		$scope.toggleAll = function() {
			if ($scope.isAllSelected) {
				if ($scope.users.length) {
					$scope.userSelectedIds = [];
					angular.forEach($scope.users, function(value) {
						value.selected = false;
						$scope.remove(value.userId);
					});
					$scope.users.selected = false;
					$scope.isAllSelected = false
				}
			} else {
				if ($scope.users.length) {
					$scope.userSelectedIds = [];
					angular.forEach($scope.users, function(value) {
						value.selected = true;
						$scope.add(value.userId);
					});
					$scope.users.selected = true;
					$scope.isAllSelected = true
				}
			}
		}

	    $scope.save = function(rows) {
            $scope.config.waiting = true;
			$scope.notification(rows);
	    };

	    $scope.close = function() {
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
