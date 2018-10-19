(function(){

    angular.module('app.controllers')
        .controller('CreateNewRFAModalController', createNewRFAModalController);

    // @ngInject
    function createNewRFAModalController($scope, toastr, $modalInstance, partyABCreator, data) {
        /* jshint validthis: true */
        $scope.data = data;
        $scope.partyA = partyA;
        $scope.partyB = partyB;
        $scope.sleeves = sleeves;
        $scope.cancel = cancel;
        $scope.partyABModal = partyABModal;

        function partyABModal() {
            partyABModal.result.then(function() {}, function() {});
        }

        activate();

        function activate() {

        }

        function partyA(data) {
            $modalInstance.close(data);
            partyABCreator.openModal({flow: 'a'}).then(function() {}, function() {});
        }

        function partyB(data) {
            $modalInstance.close(data);
            partyABCreator.openModal({flow: 'b'}).then(function() {}, function() {});
        }
        
        function sleeves(data){
            $modalInstance.close(data);
            partyABCreator.openModal({flow: 'sleeves'}).then(function() {}, function() {});
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();
