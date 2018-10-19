describe('partyADealerSelection.ctrl: ', function () {
    var scope,
        createController,
        masterAgreementService,
        modalsService;
    beforeEach(function () {
        module('ui.router');
        module('partyABCreator');
    });
    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        scope.inputData = {};
        masterAgreementService = {
            put: sinon.stub().returns({
                success: sinon.stub().returns({
                    error: sinon.spy()
                })
            })
        };
        modalsService = {
            open: sinon.spy()
        };
        createController = function () {
            return $controller('partyADealerSelection.ctrl', {
                $scope: scope,
                masterAgreementService: masterAgreementService,
                modalsService: modalsService
            });
        };
    }));
    it('selectAll: should set all entities as selected ', function () {
        scope.inputData.masterAgreements = [{selected: false}, {selected: false}];
        var vm = createController();
        vm.selectAll();
        expect(scope.inputData.masterAgreements).toEqual([{selected: true}, {selected: true}]);
        expect(scope.inputData.selectedPartyA).toEqual([{selected: true}, {selected: true}]);
    });
});