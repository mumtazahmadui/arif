describe('editAgreementModalController: ', function () {
    var scope,
        modalInstance,
        data,
        rfaApiMasterlist,
        deffered,
        createController;
    beforeEach(function () {
        module('app.controllers');
    });
    beforeEach(inject(function ($controller, $q, $rootScope) {
        scope = $rootScope.$new();
        deffered = {
            getAgreementTypes: $q.defer(),
            putAgreementType: $q.defer()
        };
        modalInstance = {
            close: sinon.spy(),
            dismiss: sinon.spy()
        };
        data = {};
        rfaApiMasterlist = {
            getAgreementTypes: sinon.stub().returns({
                $promise: deffered.getAgreementTypes.promise
            }),
            putAgreementType: sinon.stub().returns({
                $promise: deffered.putAgreementType.promise
            })
        };
        createController = function () {
            return $controller('editAgreementModalController', {
                $modalInstance: modalInstance,
                data: data,
                rfaApiMasterlist: rfaApiMasterlist,
                scope: scope
            });
        };
    }));

    it('cancel: should close popup', function () {
        var vm = createController();
        vm.cancel();
        expect(modalInstance.dismiss.called).toBeTruthy();
    });
    it('getData: should get agreement types', function () {
        var vm = createController();
        vm.getData();
        expect(rfaApiMasterlist.getAgreementTypes.called).toBeTruthy();
        deffered.getAgreementTypes.resolve({});
        scope.$digest();
        expect(vm.typesLoaded).toBeTruthy();
        vm.getData();
    });
    it('getData: if rejected, should do nothing', function () {
        var vm = createController();
        vm.getData();
        expect(rfaApiMasterlist.getAgreementTypes.called).toBeTruthy();
        deffered.getAgreementTypes.reject({});
        scope.$digest();
        expect(vm.typesLoaded).toBeFalsy();
    });
    it('select: should do nothing if user picked already selected type', function () {
        var vm  = createController();
        vm.agreementType = {
            value: 'One'
        };
        vm.select({value: 'One'});
        expect(vm.changedType).toBeFalsy();
    });
    it('select: should change picked type', function () {
        var vm  = createController();
        vm.agreementType = {
            value: 'One'
        };
        vm.select({value: 'Two'});
        expect(vm.changedType).toBeTruthy();
        expect(vm.agreementType.value).toBe('Two');
    });
    it('save: should close popop on success', function () {
        var vm = createController();
        vm.save();
        deffered.putAgreementType.resolve();
        scope.$digest();
        expect(modalInstance.close.called).toBeTruthy();
        expect(vm.errorOccurred).toBeFalsy();
    });
    it('save: should show error popop on error', function () {
        var vm = createController();
        vm.save();
        deffered.putAgreementType.reject();
        scope.$digest();
        expect(modalInstance.close.called).toBeFalsy();
        expect(vm.errorOccurred).toBeTruthy();
    });
});
