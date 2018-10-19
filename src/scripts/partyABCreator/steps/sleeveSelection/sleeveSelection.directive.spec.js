describe('Directive:sleeveSelection', function () {
    var uut;
    beforeEach(function () {
        module('ui.router');
        module('partyABCreator');
    });
    beforeEach(inject(function ($injector) {
        uut = $injector.get('sleeveSelectionDirective')[0];
    }));
    it('controller', function () {
        expect(uut.controller).toBe('sleeveSelection.ctrl');
    });
});
