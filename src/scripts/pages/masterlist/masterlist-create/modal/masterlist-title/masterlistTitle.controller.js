(function () {
    angular
        .module('app.controllers')
        .controller('masterlistTitleModalController', masterlistTitleModalController);

    function masterlistTitleModalController(data, rfaApiMasterlist, $state) {
        var vm = this;

        angular.extend(vm, {
            masterlistModel: data.templateModel,
            save: save
        });

        function save() {
            vm.loading = true;
            var dataToSend = prepareToSend(vm.templateName, vm.masterlistModel);
            rfaApiMasterlist.createTemplate(dataToSend).$promise.then(function (data) {
                if (data && data.data && data.data.errorCode) {
                    vm.errorOccurred = true;
                    vm.errorMsg = data.data.message;
                } else {
                    $state.go('rfa.masterlist.template');
                }
                vm.loading = false;
            }, function () {
                vm.errorMsg = 'Error occurred while processing your request, please try again.';
                vm.errorOccurred = true;
                vm.loading = false;
            });
        }

        function removeUsedOrder(orderArr) {
            vm.masterlistModel.forEach(function (row) {
                var index = orderArr.indexOf(row.fieldOrder);
                if (index > -1) {
                    orderArr.splice(index, 1);
                }
            });
        }

        function prepareToSend(tmplName, fields) {
            var orderArr = ['1', '2', '3', '4', '5'];
            removeUsedOrder(orderArr);
            var dataToSend = {};
            dataToSend.templateName = tmplName;
            dataToSend.templateFields = fields.filter(function (row) {
                return !row.category;
            }).map(function (row) {
                var data = {};
                data.fieldIdentifier = row.fieldIdentifier;
                data.fieldLabel = row.fieldLabel ? row.fieldLabel : row.fieldIdentifier;
                data.fieldVisibility = typeof row.fieldVisibility === 'undefined' ? 1 : row.fieldVisibility;

                /*
                 If user unable to order, we are sending null.
                 If user able to set order, we are checking, if there any order - we placing it
                 if no - just put first available order
                 */

                if (row.ableToOrder && row.fieldVisibility !== 0) {
                    if (!!row.fieldOrder) {
                        data.fieldOrder = row.fieldOrder;
                    } else {
                        data.fieldOrder = orderArr[0];
                        orderArr.splice(0, 1);
                    }
                } else {
                    data.fieldOrder = null;
                }
                return data;
            });
            return dataToSend;
        }
    }
})();