angular.module('partyABCreator').controller('partyADealerSelection.ctrl',[
    '$scope',
    'masterAgreementService',
    'modalsService',
    function(
        $scope,
        masterAgreementService,
        modalsService
    ) {
        var vm = this;
        vm.loaded = false;
        var extendedData = $scope.inputData;
        extendedData.masterAgreements = extendedData.masterAgreements || [];
        extendedData.selectedPartyA = extendedData.selectedPartyA || [];

        this.selectPartyA = selectPartyA;
        this.selectAll = selectAll;
        this.deselectAll = deselectAll;
        this.showDeselect = showDeselect;
        this.back = function() {
            if ($scope.inputData.flow === 'a' || 
                    $scope.inputData.flow === 'sleeves'
            ) {
                modalsService.open({
                    'backdrop': 'static',
                    'template': 'modal/CreateNewRFA',
                    'controller': 'CreateNewRFA',
                    'class': 'modal-rfa'
                });
            }
            $scope.$emit('step.back',{data: $scope.inputData});
        };
        this.next = function() {
            $scope.$emit('step.next',{data: $scope.inputData});
        };
        //Checking scope for masterAgreements
        if (!$scope.inputData.masterAgreements.length) {
            masterAgreementService.put({
                'pageSize': 1000,
                'offSet': 1
            })
                .success(function(data) {
                    extendedData.masterAgreements = data.data;
                    vm.loaded = true;
                })
                .error(function() {
                });
        } else {
            vm.loaded = true;
        }

        function selectPartyA() {
            extendedData.selectedPartyA = extendedData.masterAgreements.filter(function(entity) {
                return entity.selected === true;
            });
        }

        function selectAll() {
            extendedData.selectedPartyA = [];
            extendedData.masterAgreements.forEach(function (entity) {
                entity.selected = true;
                extendedData.selectedPartyA.push(entity);
            });
        }

        function deselectAll() {
            extendedData.masterAgreements.forEach(function (entity) {
                entity.selected = false;
            });
            extendedData.selectedPartyA = [];
        }

        function showDeselect() {
            return !extendedData.masterAgreements.some(function (entity) {
                return entity.selected !== true;
            });
        }
    }
]);
