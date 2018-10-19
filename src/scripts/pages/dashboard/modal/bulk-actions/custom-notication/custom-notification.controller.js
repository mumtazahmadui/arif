// @ngInject
(function(){

	angular.module('app.controllers')
        .controller('notificationModalController', notificationModalController);

    function notificationModalController($scope, $modalInstance, data, rfaGridSelection, CredentialsService, customNotificationService, $window) {
        /* jshint validthis: true */
        $scope.config = {
            loaded: false,
            message: null,
            waiting: false,
            preveiwWaiting: false,
            maxlength: 2000,
            maxlengthsub: 150,
            subject : null,
            emailtext: null
        }
        $scope.rows = data.data.rows;
        if ($scope.rows.length < 3) {
            $scope.slmHeight = 100;
        } else if ($scope.rows.length > 2 && $scope.rows.length < 6) {
            $scope.slmHeight = 150;
        } else if ($scope.rows.length < 11) {
            $scope.slmHeight = 200;
        } else {
            $scope.slmHeight = 310;
        }
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
                var getUser = CredentialsService.getUserNotification('operations');
                getUser.then(function(data) {
                    reslove(data.data.data);
                }).catch(function(error) {
                    reject(error);
                })
            })
        }

        $scope.preveiwEmail = function (rows) {
            $scope.config.preveiwWaiting = true;
            var partyBid = [];
            var amendmentIds = [];

            if (rows.length) {
                _.forEach(rows, function (value) {
                    partyBid.push(value.id);
                    amendmentIds.push(value.amendmentId);
                });
            }

            amendmentIds = $scope.removeDuplicates(amendmentIds);

            var options = {
                "message": $scope.config.message,
                "emailIds": [$scope.config.emailtext],
                "subject": $scope.config.subject,
                "partyBIds": partyBid,
            }

            customNotificationService.previewEmail(options).then(function (resp) {
                $scope.config.preveiwWaiting = false;
                var html = resp.data;
                var newWindow = $window.open();
                newWindow.document.write(html);
            }).catch(function (error) {
                $scope.config.preveiwWaiting = false;
            })
        }

		$scope.customNotification = function(rows) {
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
                "emailIds": [$scope.config.emailtext],
                "subject": $scope.config.subject,
                "partyBIds": partyBid,
            }


            customNotificationService.customNotify(options)
            .then(function(resp) {
                $scope.config.waiting = false;
                $modalInstance.close(data);
            })
            .catch(function(error) {
                $scope.config.waiting = false;
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


	    $scope.save = function(rows) {
            $scope.config.waiting = true;
			$scope.customNotification(rows);
	    };

	    $scope.close = function() {
	        $modalInstance.dismiss('cancel');
	    };
	}
})();
