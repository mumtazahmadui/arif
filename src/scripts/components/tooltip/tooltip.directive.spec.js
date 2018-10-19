describe('Directive:rfaTooltip', function() {
    var $injector,
        $compile,
        compileElement,
        $rootScope,
        $document,
        scope,
        uut;
    beforeEach(module('templateCache', 'rfa.components'));
    beforeEach(inject(function(_$injector_, _$compile_, _$rootScope_, _$document_) {
        $injector = _$injector_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $document = _$document_;
    }));
    beforeEach(function() {
        uut = $injector.get('rfaTooltipDirective')[0];
        scope = $rootScope.$new();
        scope.tooltipContent = '<div>12</div>';
        compileElement = function(tooltipContent) {
            scope.tooltipContent = tooltipContent;
            return $compile(angular.element('<div id="tooltip" rfa-tooltip="tooltipContent" data-html="true"></div>'))(scope);
        };
    });
    describe('controller', function() {
        var controller, instance;
        beforeEach(function() {
            controller = uut.controller;
            instance = new controller(scope);
        });
        it('should extend itself via show,defineContent,setPopoverElement methods', function() {
            var instance = new controller(scope);
            ['show', 'defineContent', 'setPopoverElement'].forEach(function(methodName) {
                expect(angular.isFunction(instance[methodName])).toEqual(true);
            });
        });
        describe('setPopoverElement', function() {
            it('should call popover method', function() {
                var pel = { popover: jasmine.createSpy() };
                instance.setPopoverElement(pel);
                expect(pel.popover).toHaveBeenCalled();
                expect(pel.popover.calls.first().args[0].container).toEqual('body');
            });
        });
        describe('defineContent', function() {
            it('should append content that was passed as an argument', function() {
                var tooltipContent = angular.element('<div>12</div>');
                instance.pel = {
                    on: function() {
                        return instance.pel;
                    }
                };
                instance.defineContent(tooltipContent);
                expect(instance.container.html()).toContain('<div>12</div>');
            });
        });
        describe('show', function() {
            beforeEach(function() {
                instance.pel = {
                    popover: jasmine.createSpy()
                };
                spyOn($.fn, 'is').and.returnValue(false);
            });
            it('should show popover if state was false and value is true', function() {
                instance.show(true, false);
                expect(instance.pel.popover).toHaveBeenCalledWith('show');
            });
            xit('should close popover if value is false and clear hider', function() {
                instance.show(false, true);
                expect(instance.pel.popover).toHaveBeenCalledWith('hide');
                expect(instance.hider === null).toBe(true);
            });
            it('should clear hider if show was called with true value', function() {
                instance.hider = {};
                instance.state = true;
                instance.show(true, true);
                expect(instance.hider === null).toBe(true);
            });
            xit('should close popover in 1 sec if forse argument was false', function(done) {
                instance.show(true, false);
                expect(instance.pel.popover).toHaveBeenCalledWith('show');
                expect(!!instance.hider).toEqual(true);
                setTimeout(function() {
                    expect(instance.pel.popover).toHaveBeenCalledWith('hide');
                    done();
                }, 2000);
            });
            it('should not reassign hider if hider was setted', function() {
                var hider = {};
                instance.hider = hider;
                instance.show(false, false);
                expect(instance.hider).toBe(hider);
            });
        });
    });
    describe('link', function() {
        var link, elem, attr, ctrl;
        beforeEach(function() {
            link = uut.link;
            elem = angular.element('<div id="tooltip" dd-tooltip="tooltipContent" data-html="true"></div>');
            attr = {};
            ctrl = { setPopoverElement: jasmine.createSpy(), defineContent: jasmine.createSpy(), show: jasmine.createSpy() };
        });
        it('should call setPopoverElement of ctrl', function() {
            link(scope, elem, attr, ctrl);
            expect(ctrl.setPopoverElement).toHaveBeenCalled();
        });
        it('should watch tooltipAttribute', function() {
            attr.rfaTooltip = 'tooltipContent';
            spyOn(scope, '$watch');
            link(scope, elem, attr, ctrl);
            expect(scope.$watch).toHaveBeenCalled();
        });
        it('should call ctrl.defineContent if tooltip value was changed', function() {
            attr.rfaTooltip = 'tooltipContent';
            link(scope, elem, attr, ctrl);
            scope.tooltipContent = '<div>13</div>';
            scope.$digest();
            expect(ctrl.defineContent).toHaveBeenCalled();
        });
    });


});
