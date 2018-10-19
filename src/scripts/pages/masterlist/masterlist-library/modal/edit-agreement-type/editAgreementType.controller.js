(function () {
    angular.module('app.controllers')
        .controller('editAgreementModalController', editAgreementModalController);

    function editAgreementModalController($modalInstance, data, rfaApiMasterlist) {
        var vm = this;

        angular.extend(vm, {
            agreementType: data.agreementType,
            getData: getData,
            cancel: cancel,
            select: select,
            save: save,
            typesLoaded: false
        });

        function getData() {
            rfaApiMasterlist.getAgreementTypes().$promise.then(function (data) {
                vm.types = data.data;
                vm.typesLoaded = true;
                vm.getData = function () {
                };
            }, function () {
            });
        }

        function select(choice) {
            if (vm.agreementType && choice.value !== vm.agreementType.value) {
                vm.changedType = true;
                vm.agreementType = choice;
            }
        }

        function save() {
            vm.loading = true;
            rfaApiMasterlist.putAgreementType({id: data.id}, vm.agreementType).$promise.then(function (data) {
                if (data && data.data && data.data.errorCode) {
                    vm.errorOccurred = true;
                    vm.errorMsg = data.data.message;
                } else {
                    $modalInstance.close();
                }
                vm.loading = false;
            }, function () {
                vm.loading = false;
                vm.errorMsg = 'Error occurred while processing your request, please try again.';
                vm.errorOccurred = true;
            });
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }
    }
})();
