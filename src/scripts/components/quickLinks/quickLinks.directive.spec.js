describe('quickLinks', function () {
    var uut,
        scope,
        CredentialsService,
        location;

    beforeEach(function () {
        CredentialsService = {
            hasPermission: sinon.spy(),
            companyType: sinon.spy()
        };
        location = {
            path: sinon.spy()
        };
        module('rfa.components');
        module(function ($provide) {
            $provide.value('CredentialsService', CredentialsService);
            $provide.value('$location', location);
        });
    });

    beforeEach(inject(function ($injector, $rootScope) {
        scope = $rootScope.$new();
        uut = $injector.get('quickLinksDirective')[0];
    }));

    describe('linkTo: ', function () {
        it('if passed function, should run it', function () {
            var spy = sinon.spy();
            uut.controller(scope, {});
            scope.linkTo(spy);
            expect(spy.called).toBeTruthy();
            expect(location.path.calledTwice).toBeFalsy();
        });
        it('if passed string, should change location to this link', function () {
            var str = 'test.html';
            uut.controller(scope, {});
            scope.linkTo(str);
            expect(location.path.calledTwice).toBeTruthy();
            expect(location.path.args[1][0]).toBe('test.html');
        });
    });
});