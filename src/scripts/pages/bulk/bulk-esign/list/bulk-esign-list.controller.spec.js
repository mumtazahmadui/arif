describe('controller: BulkEsignListController', function () {
    var $scope,
        $q,
        $modal,
        $state,
        side,
        BulkEsignService,
        amendments,
        modalsService;
    beforeEach(function () {
        module('ui.router');
        module('app.bulk.esign');
    });
    beforeEach(inject(function ($rootScope, $controller, _$q_) {
        $q = _$q_;
        $scope = $rootScope.$new();
        $modal = {
            open: sinon.spy()
        };
        $state = {
            go: sinon.spy(),
            params: {
                rfaIds: '101,102,103'
            }
        };
        side = 'Buyside';
        amendments = {
            headers: sinon.spy(),
            data: {
                data: {
                    rows: [{
                        validRfaId: '101'
                    }, {
                        validRfaId: '102'
                    }]
                }
            }
        };
        BulkEsignService = {
            getSignatureDetails: sinon.spy(function () {
                return $q.when(amendments);
            })
        };
        modalsService = {
            open: sinon.spy(),
            setPopupPosition: sinon.spy()
        };
        $controller('BulkEsignListController', {
            $scope: $scope,
            $modal: $modal,
            $state: $state,
            side: side,
            appConfig: {},
            rfaFileDownload: {},
            BulkEsignService: BulkEsignService,
            modalsService: modalsService
        });
    }));
    it('should set side field based on dependency, call BulkEsignService.getSignatureDetails and then set scope fields based on response', function () {
        expect($scope.side).toEqual(side);
        $scope.$broadcast('$viewContentLoaded');
        expect(BulkEsignService.getSignatureDetails.calledOnce).toBe(true);
        expect(BulkEsignService.getSignatureDetails.args[0][0]).toEqual($scope.selectedRFAs);
        $scope.$digest();
        expect($scope.amendments).toBe(amendments.data.data.rows);
    });
    describe('scope method: showTermsOfUse', function () {
        it('should open terms of use modal', function () {
            $scope.showTermsOfUse();
            expect(modalsService.open.calledOnce).toBe(true);
        });
    });
    describe('scope method: viewDocument', function () {
        it('should open viewer modal', function () {
            $scope.$broadcast('$viewContentLoaded');
            $scope.$digest();
            $scope.viewDocument('101');
            expect($modal.open.calledOnce).toBe(true);
            expect($modal.open.args[0][0].resolve.rfaId()).toEqual('101');
            expect($modal.open.args[0][0].resolve.rfaIdsList()[1]).toEqual('102');
        });
    });
    describe('scope method: confirmAll', function () {
        it('should set selected field to value of allConfirmed field for all amendments', function () {
            $scope.$broadcast('$viewContentLoaded');
            $scope.$digest();
            $scope.allConfirmed.checked = true;
            $scope.confirmAll();
            expect(amendments.data.data.rows[0].selected && amendments.data.data.rows[1].selected).toEqual(true);
        });
    });
    describe('scope method: proceed', function () {
        it('should go to rfa.bulk.esign-sign state passing to it the list of selected RFAs', function () {
            $scope.$broadcast('$viewContentLoaded');
            $scope.$digest();
            amendments.data.data.rows[0].selected = true;
            $scope.proceed();
            expect($state.go.calledOnce).toBe(true);
            expect($state.go.args[0][0]).toEqual('rfa.bulk.esign-sign');
            expect($state.go.args[0][1].rfas.length).toEqual(1);
        });
    });
});