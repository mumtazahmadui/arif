(function(){
    angular.module('app.controllers')
        .controller('removeModalController', removeModalController);

    function removeModalController($scope, $modalInstance, data) {
        $scope.data = data;
        $scope.ok = ok;
        $scope.cancel = cancel;

        function ok(data) {
            $modalInstance.close(data);
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();