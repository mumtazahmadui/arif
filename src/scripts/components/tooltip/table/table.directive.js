(function() {
    angular.module('rfa.components').directive('rfaTooltipTable', ['$timeout', '$compile', function($timeout, $compile) {
        return {
            restrict: 'A',
            link: link,
            require: 'rfaTooltip'
        };

        function link(scope, element, attrs) {
            scope[attrs.rfaTooltip] = compileTooltipContent();
            scope.rows = scope.$eval(attrs.rfaTooltipTableData);

            function compileTooltipContent() {
                var nscope = scope.$new();
                var template = attrs.rfaTooltipTableTemplateUrl ? '<div><div ng-include="' + "'" + scope.$eval(attrs.rfaTooltipTableTemplateUrl) + "'" + '"></div></div>' : scope.$eval(attrs.rfaTooltipTableTemplate);
                return $compile(template || '<div></div>')(nscope);
            }
        }
    }]);


})();