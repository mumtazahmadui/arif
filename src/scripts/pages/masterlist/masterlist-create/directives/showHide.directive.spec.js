describe('ddCellPrActionNeeded', function () {
    var scope,
        uut;
    beforeEach(function () {
        module('ui.router');
        module('rfa.components');
    });
    beforeEach(inject(function($rootScope, $injector) {
        scope = $rootScope.$new();
        scope.row = {};
        uut = $injector.get('showHideDirective')[0];
    }));
    it('toggle: should assign value on toggle and make assign valid class', function () {
        uut.link(scope);
        scope.toggle(1);
        expect(scope.ngModel).toBe(1);
    });
    it('toggle: should use onHide function, when toggling to hide', function () {
        scope.onHide = sinon.spy();
        uut.link(scope);
        scope.toggle(0);
        expect(scope.ngModel).toBe(0);
        expect(scope.onHide.called).toBeTruthy();
    });
    it('toggle: if field is disabled, should do nothing', function () {
        uut.link(scope);
        scope.ngDisabled = true;
        scope.toggle(1);
        expect(scope.ngModel).toBeUndefined();
    });
});