(function(){

    angular
        .module('ui.bootstrap.tooltip')
        .directive('readyExecuteTooltipCompile', readyExecuteTooltipCompile)
        .directive('readyExecuteTooltipCompilePopup',readyExecuteTooltipCompilePopup);


    // @ngInject
    function readyExecuteTooltipCompile($tooltip) {
        return $tooltip( 'readyExecuteTooltipCompile', 'tooltip', 'mouseenter' );
    }

    function readyExecuteTooltipCompilePopup(){
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
            '<div class="audit-tooltip tooltip {{placement}}" ng-class="{ in: (enable && isOpen()), fade: animation()}">' +
            '  <div class="audit-tooltip-arrow tooltip-arrow"></div>' +
            '  <div class="audit-tooltip-inner tooltip-inner"><div ng-include="getContentUrl(content.template)"></div></div>' +
            '</div>',
            controller : function($scope) {
                if (typeof $scope.content === 'string') {
                    $scope.enable = false;
                    $scope.response = $scope.content;
                    $scope.enable = true;
                }
            },
            link: function(scope) {
                scope.getContentUrl = function() {
                    return '/scripts/components/screener/tables/tooltips/readyExecute.html';
                };
            }
        };
    }
})();