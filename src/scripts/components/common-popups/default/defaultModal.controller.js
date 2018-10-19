(function () {
    angular
        .module('app.controllers')
        .controller('defaultModalController', defaultModalController);

    function defaultModalController($scope, $modalInstance, data) {

        $scope.data = data;
        $scope.ok = function(data) {
            $modalInstance.close(data);
        };
        $scope.cancel = function() {
            $modalInstance.dismiss(data.msg = 'cancel');
        };

    }
})();
