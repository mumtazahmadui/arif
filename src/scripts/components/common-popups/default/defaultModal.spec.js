describe('defaultModalController', function () {
    var createController,
        scope,
        modalInstance,
        data;
    beforeEach(function () {
        module('app.controllers');
    });
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        modalInstance = {
            close: sinon.spy(),
            dismiss: sinon.spy()
        };
        data = {
            foo: 'bar'
        };
        createController = function () {
            return $controller('defaultModalController', {
                $scope: scope,
                $modalInstance: modalInstance,
                data: data
            });
        };
    }));
    it('should assign data to scope', function () {
        createController();
        expect(scope.data).toEqual(data);
    });
    it('ok: should close popup with data', function () {
        createController();
        scope.ok(data);
        expect(modalInstance.close.called).toBeTruthy();
        expect(modalInstance.close.args[0][0]).toEqual(data);
    });
    it('cancel: should dismiss popup with message', function () {
        createController();
        scope.cancel();
        expect(modalInstance.dismiss.called).toBeTruthy();
        expect(modalInstance.dismiss.args[0][0]).toEqual('cancel');
    });
});
