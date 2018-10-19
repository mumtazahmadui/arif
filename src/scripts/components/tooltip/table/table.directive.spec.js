describe('Directive:rfaTooltipTable', function() {
    var $injector,
        $compile,
        element,
        attrs,
        $rootScope,
        tooltipContent,
        scope,
        uut;
    beforeEach(module('templateCache', 'rfa.components'));
    beforeEach(inject(function($templateCache) {
        tooltipContent = '<div class="ng-scope">Table Template</div>';
        $templateCache.put('/views/table-template-for-tooltip.html', tooltipContent);
    }));
    beforeEach(inject(function(_$injector_, _$compile_, _$rootScope_) {
        $injector = _$injector_;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    beforeEach(function() {
        uut = $injector.get('rfaTooltipTableDirective')[0];
        scope = $rootScope.$new();
        scope.templateUrl = '/views/table-template-for-tooltip.html';
        attrs = { ddTooltip: 'tooltipContent', rfaTooltipTableTemplateUrl: 'templateUrl', rfaTooltipTableData: 'getDataPromise' };
        scope.getDataPromise = [{}, {}];
        element = angular.element('<div rfa-tooltip="tooltipContent" rfa-tooltip-table rfa-tooltip-table-data="getDataPromise" ' +
            'rfa-tooltip-table-template-url="templateUrl"></div>');
    });
    describe('link', function() {
        beforeEach(function() {
            uut.link(scope, element, attrs);
        });
        it('should set scope rows', function() {
            scope.$digest();
            expect(scope.rows).toEqual([{}, {}]);
        });
    });

});
