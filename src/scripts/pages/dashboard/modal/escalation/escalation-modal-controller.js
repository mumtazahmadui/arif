// @ngInject
(function(){

	angular.module('app.controllers')
	    .controller('EscalationModalController', escalationModalController);

	function escalationModalController($scope, $modalInstance, data,rfaGridSelection,CredentialsService,EscalationService,$window) {
		/* jshint validthis: true */
		$scope.data = data;
		$scope.isAllSelected = false
		var grid,request,role
		grid = $scope.data.data.grid;
		request = $scope.data.data.request;

		$scope.config = {
            loaded:false,
            message:null,
            waiting:false,
			preveiwWaiting:false,
			unAuthorized:false,
			errorMsg:null,
			users:[],
			maxlength:2000
        }

		$scope.deskCode = $scope.data.data.deskCode;
		$scope.row = $scope.data.data.item;
		$scope.index = $scope.data.data.index;
		$scope.amendmentId = grid.dataList[$scope.index].id
		$scope.UserId = [];
		$scope.userSelectedIds = [];
		var destTypeObj = {
			'onboarding':'Onboarding',
			'kyc':'KYC',
			'tax':'Tax',
			'credit':'Credit',
			'legal':'Legal',
			'operations':'Operations',
			'manager':'Manager'
		}

		$scope.checked = $scope.data.data.item.deskStatus[$scope.deskCode.replace (/_/g, "")];
		init().then(function(resp) {
			$scope.deskType = destTypeObj[role];
			$scope.users = resp;
			if ($scope.users.length) {
				angular.forEach($scope.users, function(value) {
					value.selected = false;
				});
			}
			$scope.config.loaded = true;
			$scope.$apply();
		}).catch(function() {
			role = '';
			$scope.config.loaded = true;
            $scope.$apply();
		})

		function init() {
			return new Promise(function(reslove,reject) {
				role = rfaGridSelection.onRequestType($scope.deskCode)['type'];
				var getUser = CredentialsService.getEscalation();
				getUser.then(function(data) {
					reslove(data.data.data);
				}).catch(function(error) {
					reject(error);
				})
			})
		}

		$scope.preveiwEmail = function(row,index) {
			$scope.config.preveiwWaiting = true;
			var id = grid.dataList[index].id
			var deskCode = rfaGridSelection.deskCode($scope.deskCode);

			var options = {
				"message": $scope.config.message,
				"amendmentIds": [id],
				"partyBIds" : [row.id],
				"deskCode": deskCode,
			}

			EscalationService.previewEmail($scope.deskType,options).then(function(resp) {
				$scope.config.preveiwWaiting = false;
				var html = resp.data;
				var newWindow = $window.open();
				newWindow.document.write(html);
			}).catch(function(error) {
				$scope.config.preveiwWaiting = false;
			})
		}

		$scope.escalation = function() {
			var deskCodeFiled = $scope.deskCode.replace (/_/g, "");
			var deskCode = rfaGridSelection.deskCode($scope.deskCode);
			var id = grid.dataList[$scope.index].id
			var partyBid = $scope.row.id;
			$scope.data.data.item.deskStatus[deskCodeFiled] = !$scope.data.data.item.deskStatus[deskCodeFiled];

			var options = {
				"reviewed": true,
				"message": $scope.config.message,
				"deskCode": deskCode,
				"userIds": $scope.userSelectedIds,
				"amendmentId": id
			}

			EscalationService.escalate(partyBid,$scope.deskType,options)
			.then(function() {
				$scope.config.waiting = false;
				$modalInstance.close(data);
			})
			.catch(function(error) {
				$scope.config.waiting = false;
				$scope.config.unAuthorized = true
				$scope.config.errorMsg = error.statusText
			})
		}

		$scope.deEscalation = function() {
			var deskCodeFiled = $scope.deskCode.replace (/_/g, "");
			var deskCode = rfaGridSelection.deskCode($scope.deskCode);
			var id = grid.dataList[$scope.index].id
			var partyBid = $scope.row.id;
			$scope.data.data.item.deskStatus[deskCodeFiled] = !$scope.data.data.item.deskStatus[deskCodeFiled];

			var options = {
				"reviewed": false,
				"message": '',
				"deskCode": deskCode,
				"userIds": [],
				"amendmentId": id
			}

			EscalationService.escalate(partyBid,$scope.deskType,options)
			.then(function() {
				$scope.config.waiting = false;
				$modalInstance.close(data);
			})
			.catch(function(error) {
				$scope.config.waiting = false;
				$scope.config.unAuthorized = true
				$scope.config.errorMsg = error.statusText

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

		$scope.selectedAll = function() {
			if (!$scope.users.length) return
			angular.forEach($scope.users, function(user) {
				if($scope.config.users.indexOf(user) === -1) {
					$scope.config.users.push(user);
					$scope.addUser(user);
				}
			});
		}

		$scope.deSelectedAll = function() {
			if (!$scope.config.users.length) return
			var users = Object.assign({},$scope.config.users);
			angular.forEach(users, function(user) {
				var index = $scope.config.users.indexOf(user);
				if(index != -1) {
					$scope.config.users.splice(index, 1);
					$scope.addUser(user);
				}
			});
		}

		$scope.unSelectedUser = function (user) {
			if(!user.userId) return;
			var index = $scope.config.users.indexOf(user);
			if(index != -1) {
				$scope.config.users.splice(index, 1);
				$scope.addUser(user);
			}
		}

		$scope.selectedUser = function(user) {
			var index = _.indexOf($scope.config.users, user);
			if(index === -1) {
				$scope.config.users.push(user);
				$scope.addUser(user)
			}
		}

		$scope.unchecked = function () {
			$scope.config.unAuthorized = false;
			$scope.config.waiting = true;
			$scope.deEscalation();
		}

	    $scope.save = function() {
			$scope.config.unAuthorized = false
			$scope.config.waiting = true;
			$scope.escalation();
	    };

	    $scope.cancel = function(row) {
			$scope.config.unAuthorized = false;
			row[$scope.deskCode] = !row[$scope.deskCode];
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
