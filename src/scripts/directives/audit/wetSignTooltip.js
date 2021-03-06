(function(){

    angular
        .module('ui.bootstrap.tooltip')
        .directive('wetsignTooltipCompile', wetsignTooltipCompile)
        .directive('wetsignTooltipCompilePopup',wetsignTooltipCompilePopup);


    // @ngInject
    function wetsignTooltipCompile($tooltip) {
        return $tooltip( 'wetsignTooltipCompile', 'tooltip', 'mouseenter' );
    }

    function wetsignTooltipCompilePopup(){
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
                    $scope.content = angular.fromJson($scope.content.replace(/'/g, '"'));
                    $scope.enable = false;
                    $scope.response = $scope.content.data;

                    if ($scope.response && $scope.response.length) {
                        $scope.lenght = $scope.response.length;
                        $scope.enable = true;
                    }
                }
            },
            link: function(scope) {
                scope.getContentUrl = function() {
                    return '/scripts/components/screener/tables/tooltips/wetSign.html';
                };
            }
        };
    }
})();