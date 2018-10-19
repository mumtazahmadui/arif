(function () {
    angular
        .module('app.controllers')
        .controller('masterlistCreateController', masterlistCreateController);

    function masterlistCreateController($scope, defaultMasterlistModel, modalsService, $timeout, $state) {
        var vm = this;
        var orderPattern = /^[1-5]$/;

        angular.extend(vm, {
            clearValuesOnHide: clearValuesOnHide,
            isDisabled: isDisabled,
            isInputRequired: isInputRequired,
            isOrderRequired: isOrderRequired,
            checkForInvalidOrder: checkForInvalidOrder,
            isShowHideRequired: isShowHideRequired,
            save: save,
            orderPattern: orderPattern,
            showWarning: showWarning,
            templateModel: angular.copy(defaultMasterlistModel)
        });

        function clearValuesOnHide(row) {
            if (!row.required) {
                row.fieldOrder = undefined;
                row.fieldLabel = undefined;
                $timeout(checkForInvalidOrder);
            }
        }

        function isInputRequired (row) {
            var dependency = row.labelDependency;
            if (dependency && $scope.masterlistForm[dependency + 'Label'] && !$scope.masterlistForm[dependency + 'Label'].$modelValue) {
                return true;
            }
            if (row.disabledShowHide && row.fieldVisibility === 0) {
                return false;
            }
            return row.required || row.fieldVisibility;
        }

        function isShowHideRequired (row) {
            var orderAvailableAndFilled = row.ableToOrder && !!row.fieldOrder;
            var labelAvailableAndFilled = row.showLabel && !!row.fieldLabel;
            return row.required || orderAvailableAndFilled || labelAvailableAndFilled;
        }

        function isOrderRequired (row) {
            var labelAvailableAndFilled = row.showLabel && !!row.fieldLabel;
            return labelAvailableAndFilled || row.fieldVisibility;
        }

        function isDisabled(row) {
            return !row.required && row.fieldVisibility === 0;
        }

        function checkForInvalidOrder () {
            var orderInputs = findOrderFields();
            orderInputs.forEach(function (input) {
                if (!input.$modelValue) {
                    input.$setValidity('sameOrder', true);
                } else {
                    findDuplications(input, orderInputs);
                }
            });
        }

        function findDuplications (input, inputs) {
            var sameOrders = inputs.filter(function (anotherInput) {
                return input.$modelValue && anotherInput.$modelValue === input.$modelValue;
            });
            var l = sameOrders.length;
            sameOrders.forEach(function (input) {
                if (l === 1) {
                    input.$setValidity('sameOrder', true);
                } else {
                    input.$setValidity('sameOrder', false);
                }
            });
        }

        function findOrderFields () {
            var orderInputs = [];
            angular.forEach($scope.masterlistForm, function (value, key) {
                if (key.lastIndexOf('Order') === key.length - 5) {
                    orderInputs.push(value);
                }
            });
            return orderInputs;
        }

        function save () {
            $scope.masterlistForm.$submitted = true;
            if ($scope.masterlistForm.$valid) {
                modalsService.open({
                    template: 'masterlist/masterlist-create/modal/masterlist-title/masterlistTitle.template',
                    controller: 'masterlistTitle',
                    controllerAs: 'mstTitleCtrl',
                    class: 'modal-mst-title',
                    templateModel: vm.templateModel,
                    backdrop: 'static'
                });
            } else {
                var errorArr = [];
                if ($scope.masterlistForm.$error.pattern || $scope.masterlistForm.$error.sameOrder) {
                    errorArr.push('Please correct the order');
                }
                if ($scope.masterlistForm.$error.required) {
                    errorArr.push('Please provide input');
                }
                showError(errorArr);
            }
        }

        function showWarning() {
            if (!$scope.masterlistForm.$dirty) {
                $state.go('rfa.dashboard');
                return;
            }
            modalsService.openWarningPopup({
                body: 'Unsaved information will be lost. Please confirm.',
                title: 'Warning'
            }).result.then(function () {
                $state.go('rfa.dashboard');
            }, function () {
            });
        }

        function showError(body) {
            modalsService.error({
                title: 'Error',
                body: body
            });
        }
    }
})();