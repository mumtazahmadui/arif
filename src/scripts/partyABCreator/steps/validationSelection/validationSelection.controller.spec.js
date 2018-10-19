describe('controller: validationSelection.ctrl', function () {
    var $scope,
        ctrl,
        modificationFilter,
        validationSelection,
        appConfig,
        CredentialsService;
    beforeEach(function () {
        module('partyABCreator');
    });
    beforeEach(inject(function ($rootScope, $controller, $q) {
        $scope = $rootScope.$new();
        $scope.inputData = {
            flow: 'sleeves',
            selectedPartyA: [{
                id: '10101010'
            }],
            selectPartyB: [{
                entity: {
                    id: '101010101'
                },
                isAdded: true
            }, {
                entity: {
                    id: '101010100'
                },
                isAdded: false
            }],
            selectedSleeves: [{
                entity: {
                    id: '1010101010'
                },
                isAdded: true
            }, {
                entity: {
                    id: '1010101011'
                },
                isAdded: false
            }]
        };
        modificationFilter = {
            filter: sinon.spy()
        };
        validationSelection = {
            transformOut: sinon.spy(function (data) {
                return {
                    data: data
                };
            }),
            validateRFA: sinon.spy($q.when)
        };
        appConfig = {
            api_host: 'rest-api-host'
        };
        CredentialsService = {
            companyId: function () {
                return 'company-id';
            }
        };
        $controller('validationSelection.ctrl as ctrl', {
            $scope: $scope,
            ContenAdapter: {},
            modificationFilter: modificationFilter,
            'partyABCreator.validationSelection': validationSelection,
            appConfig: appConfig,
            CredentialsService: CredentialsService
        });
        ctrl = $scope.ctrl;
    }));
    describe('method: getAdditionEntities', function () {
        it('should return selected for addition party B entities concatenated with sleeves', function () {
            var result = ctrl.getAdditionEntities();
            expect(result[0]).toEqual($scope.inputData.selectPartyB[0]);
            expect(result[1]).toEqual($scope.inputData.selectedSleeves[0]);
        });
    });
    describe('method: getRemovalEntities', function () {
        it('should return selected for removal party B entities concatenated with sleeves', function () {
            var result = ctrl.getRemovalEntities();
            expect(result[0]).toEqual($scope.inputData.selectPartyB[1]);
            expect(result[1]).toEqual($scope.inputData.selectedSleeves[1]);
        });
    });
    describe('unableToSave: ', function () {
        it('should return true, if no party B selected', function () {
            $scope.inputData.selectPartyB = [];
            expect($scope.unableToSave()).toBeTruthy();
        });
        it('should return true, if selected parties B have deleted flag', function () {
            $scope.inputData.selectPartyB = [{
                entity: {
                    deleted: 1
                }
            }, {
                entity: {
                    deleted: 1
                }
            }];
            expect($scope.unableToSave()).toBeTruthy();
        });
        it('should return false, if selected parties B have deleted flag', function () {
            $scope.inputData.selectPartyB = [{
                entity: {
                    deleted: 0
                }
            }, {
                entity: {
                    deleted: 1
                }
            }];
            expect($scope.unableToSave()).toBeFalsy();
        });
        it('should return true, if sleeve flow, but no sleeve or party b selected', function () {
            $scope.inputData.selectPartyB = [];
            $scope.inputData.selectedSleeves = [];
            expect($scope.unableToSave()).toBeTruthy();
        });
        it('should return false, if any sleeve or party b selected', function () {
            $scope.inputData.flow = 'sleeves';
            $scope.inputData.selectPartyB = [];
            $scope.inputData.selectedSleeves = [{
                entity: {
                    deleted: 0
                }
            }];
            expect($scope.unableToSave()).toBeFalsy();
        });
    });
});