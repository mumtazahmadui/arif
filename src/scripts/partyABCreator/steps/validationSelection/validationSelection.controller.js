angular.module('partyABCreator').controller('validationSelection.ctrl',[
    '$scope',
    'partyABCreator.validationSelection',
    'appConfig',
    'CredentialsService',
    'modificationFilter',
    function(
        $scope,
        validationSelection,
        appConfig,
        CredentialsService,
        modificationFilter
    ) {
        var vm = this;
        vm.loaded = true;
        vm.validationFailed = false;
        var extendedData = $scope.inputData;
        //remove cached data from previous steps
        delete extendedData.preparedData;

        this.back = function(stepName) {
            $scope.$emit('step.back',{stepName: stepName});
        };
        this.next = function() {
            $scope.$emit('step.next',{data: $scope.inputData});
        };
        this.close  = function() {
            $scope.$emit('step.finish',{data: $scope.inputData});
        };
        this.finish = function() {
            $scope.$emit('step.finish',{data: $scope.inputData});
        };
        this.validateRFA = validateRFA;
        
        this.getAdditionEntities = function() {
            return _.filter(extendedData.selectPartyB, filterAddition)
                .concat(_.filter(extendedData.selectedSleeves, filterAddition));
        };

        this.getRemovalEntities = function() {
            return _.filter(extendedData.selectPartyB, filterRemoval)
                .concat(_.filter(extendedData.selectedSleeves, filterRemoval));
        };
        
        this.filterModification = modificationFilter.filter;

        function filterAddition(item) {
            return !item.isModified && !item.deleted && item.isAdded;
        }

        function addFlowProp(obj, flow) {
            var flowMap = {
                a: 'Party A',
                b: 'Party B',
                sleeves: 'Sleeve'
            };
            if (obj.data && obj.data.length === 1 && flowMap[flow]) {
                obj.data[0].creationFlow = flowMap[flow];
            }
        }

        $scope.unableToSave = function () {
            var selectedPartyB = $scope.inputData.selectPartyB.filter(function (partyB) {
                return partyB.entity && partyB.entity.deleted === 0;
            });

            var invalidPartyB = selectedPartyB.length === 0;

            if ($scope.inputData.flow === 'sleeves' || $scope.inputData.flow === 'editSleeve') {
                var selectedSleeves = $scope.inputData.selectedSleeves.filter(function (sleeve) {
                    return sleeve.entity && sleeve.entity.deleted === 0;
                });

                var invalidSleeves = selectedSleeves.length === 0;
                return invalidPartyB && invalidSleeves;
            }

            return invalidPartyB;
        };

        function filterRemoval(item) {
            return !item.deleted && !item.isAdded && !item.isModified;
        }

        function validateRFA() {
            vm.loaded = false;
            var preparedData  =  validationSelection.transformOut(extendedData);
            validationSelection.validateRFA(preparedData).then(function(data) {
                    vm.loaded = true;
                    if (data.message === 'Failed') {
                        vm.validationFailed = true;
                        vm.validationErrorFile = appConfig.api_host + 'company/' + CredentialsService.companyId() + '/files/download_file/' + data.data.fileId;
                    } else {
                        extendedData.preparedData = preparedData;
                        if (extendedData.flow === 'editB' || extendedData.flow === 'editSleeve') {
                            vm.finish();
                        } else {
                            addFlowProp(extendedData.preparedData, extendedData.flow);
                            vm.next();
                        }
                    }
                },
                function() {

                });
        }

    }
]);
