describe('amendmentReviewTable', function () {
    var scope,
        uut,
        placeholdersDataConnections,
        modalsService,
        item = {},
        value = {},
        placeholder = {};
    beforeEach(function () {
        placeholdersDataConnections = {
            changeChildrenValues: sinon.spy(),
            isChildResponseAvailable: sinon.spy()
        };
        modalsService = {
            alert: sinon.spy()
        };
        module('ui.router', 'app.directives');
        module(function ($provide) {
            $provide.value('placeholdersDataConnections', placeholdersDataConnections);
            $provide.value('modalsService', modalsService);
        });
    });
    beforeEach(inject(function($rootScope, $injector) {
        scope = $rootScope.$new();
        scope.row = {};
        uut = $injector.get('amendmentReviewTableDirective')[0];
    }));
    describe('setResponseValue: ', function () {
        it('if user unable to response, should do nothing', function () {
            uut.link(scope);
            scope.ableToResponse = function () {
                return false;
            };
            scope.setResponseValue(placeholder, item, value);
            expect(item).toEqual({});
            expect(placeholdersDataConnections.changeChildrenValues.called).toBeFalsy();
        });
        it('if user able to response, should clear sleeves and set response for item', function () {
            value = 'someVal';
            uut.link(scope);
            scope.ableToResponse = function () {
                return true;
            };
            scope.setResponseValue(placeholder, item, value);
            expect(item).toEqual({'Sell Side Response': 'someVal'});
            expect(placeholdersDataConnections.changeChildrenValues.called).toBeTruthy();
        });
        it('also, if user accepts, should clear reasons of rejecting', function () {
            value = 'Accepted';
            uut.link(scope);
            scope.ableToResponse = function () {
                return true;
            };
            scope.setResponseValue(placeholder, item, value);
            expect(item).toEqual({'Sell Side Response': 'Accepted', 'Reason for Rejection/Pending': ''});
            expect(placeholdersDataConnections.changeChildrenValues.called).toBeTruthy();
        });
        it('setSameValue: should set same value as for parent', function () {
            value = 'Rejected';
            uut.link(scope);
            scope.ableToResponse = function () {
                return true;
            };
            scope.setResponseValue(placeholder, item, value);
            var fn = placeholdersDataConnections.changeChildrenValues.args[0][2];
            var child = {};
            fn(child);
            expect(child['Sell Side Response']).toEqual('Rejected');
        });
        it('setSameValueAndClearReasons: should set same value as for parent and clear reasons', function () {
            value = 'Accepted';
            uut.link(scope);
            scope.ableToResponse = function () {
                return true;
            };
            scope.setResponseValue(placeholder, item, value);
            var fn = placeholdersDataConnections.changeChildrenValues.args[0][2];
            var child = {
                'Reason for Rejection/Pending': 'Some Val'
            };
            fn(child);
            expect(child['Sell Side Response']).toEqual('Accepted');
            expect(child['Reason for Rejection/Pending']).toEqual('');
        });
    });
    it('ableToResponse: should call placeholdersDataConnections.isAbleToResponseSleeve', function () {
        uut.link(scope);
        scope.ableToResponse(item, placeholder, 'Accepted');
        expect(placeholdersDataConnections.isChildResponseAvailable.called).toBeTruthy();
    });
    describe('isShowErrorMaxLength: ', function () {
        it('should return false, if there is no value, or no length in it', function () {
            uut.link(scope);
            expect(scope.isShowErrorMaxLength('', 25)).toBeFalsy();
        });
        it('should return is length of value is more, then max length', function () {
            uut.link(scope);
            expect(scope.isShowErrorMaxLength('six six', 5)).toBeTruthy();
        });
    });
    it('setChildrenReasons: should call changeChildrenValues', function () {
        uut.link(scope);
        scope.setChildrenReasons(placeholder, item);
        expect(placeholdersDataConnections.changeChildrenValues.called).toBeTruthy();
    });
    it('setChildrenReasons: should call changeChildrenValues', function () {
        item['Reason for Rejection/Pending'] = 'test value';
        uut.link(scope);
        scope.setChildrenReasons(placeholder, item);
        var fn = placeholdersDataConnections.changeChildrenValues.args[0][2];
        var child = {};
        fn(child);
        expect(child['Reason for Rejection/Pending']).toEqual('test value');
    });
    it('avoidAlign: should return left align style if column is sell side response', function () {
        uut.link(scope);
        expect(scope.avoidAlign ({name: 'test'})).toBeUndefined();
        expect(scope.avoidAlign ({name: 'Sell Side Response'})).toEqual({
            'text-align': 'left'
        });
    });
});