describe('Directive: rfaDashboardTab', function () {
    var scope,
        expect = chai.expect,
        uut;
    beforeEach(function() {
        module('ui.router');
        module('rfa.components');
        module(function ($provide) {
            $provide.value('CredentialsService', {
                hasPermission: sinon.spy()
            });
        });
    });
    beforeEach(inject(function($rootScope, $injector){
        scope = $rootScope.$new();
        uut = $injector.get('rfaDashboardTabDirective')[0];
    }));
    it('controller: should look through all tabs and set active', function () {
        var scope = {
            tabsConfig: [{
                href: 'some.state.one'
            }, {
                href: 'some.state.two'
            }]
        };
        var state = {
            current: {
                name: 'some.state.one'
            }
        };
        uut.controller(scope, state);
        expect(scope.tabsConfig).to.deep.equal([{
            href: 'some.state.one',
            active: true
        }, {
            href: 'some.state.two',
            active: false
        }]);
    });
    it('toggleTab: should toggle tab', function () {
        var scope = {
            tabsConfig: [{
                href: 'some.state.one'
            }, {
                href: 'some.state.two'
            }]
        };
        var state = {
            current: {
                name: 'some.state.one'
            }
        };
        uut.controller(scope, state);
        scope.tab = {
            active: false
        };
        scope.toggleTab();
        expect(scope.tabsConfig).to.deep.equal([{
            href: 'some.state.one',
            active: false
        }, {
            href: 'some.state.two',
            active: false
        }]);
        expect(scope.tab.active).to.be.true;
    });
});