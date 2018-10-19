(function(){

    angular
        .module('ui.bootstrap.tooltip')
        .directive('tooltipCompile', tooltipCompile)
        .directive('tooltipCompilePopup', tooltipCompilePopup);


    // @ngInject
    function tooltipCompile($tooltip) {
        return $tooltip( 'tooltipCompile', 'tooltip', 'mouseenter' );
    }

    function tooltipCompilePopup(){
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                content: '@',
                placement: '@',
                animation: '&',
                isOpen: '&'
            },
            template:
            '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">' +
            '  <div class="tooltip-arrow"></div>' +
            '  <div class="tooltip-inner"><div ng-include="getContentUrl(content.template)"></div></div>' +
            '</div>',
            link: function(scope) {
                scope.getContentUrl = function() {
                    if(typeof scope.content === 'string'){
                        scope.content = angular.fromJson(scope.content.replace(/'/g, '"'));
                    }
                    return '/scripts/components/screener/tables/' + scope.content.template + '.html';
                };
            }
        };
    }
})();