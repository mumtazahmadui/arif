(function(){

    angular
        .module('ui.bootstrap.tooltip')
        .directive('auditLegalTooltipCompile', auditLegalTooltipCompile)
        .directive('auditLegalTooltipCompilePopup',auditLegalTooltipCompilePopup);


    // @ngInject
    function auditLegalTooltipCompile($tooltip) {
        return $tooltip( 'auditLegalTooltipCompile', 'tooltip', 'mouseenter' );
    }

    function auditLegalTooltipCompilePopup(auditLegalManger){
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
            '<div class="audit-tooltip tooltip {{placement}}" ng-class="{ in: (enable && isOpen())}">' +
            '  <div class="audit-tooltip-arrow tooltip-arrow"></div>' +
            '  <div class="audit-tooltip-inner tooltip-inner"><div ng-include="getContentUrl(content.template)"></div></div>' +
            '</div>',
            controller : function($scope) {
                $scope.enable = false;
                if(typeof $scope.content === 'string'){
                    $scope.content = angular.fromJson($scope.content.replace(/'/g, '"'));
                }
                var deskCode = $scope.content.deskCode;
                var id = $scope.content.data;

                var legal = auditLegalManger.getRfaLevelAudit(id,deskCode);
                return legal.then(function(resp) {
                    if(resp.data.length > 0) {
                        $scope.auditData = resp;
                        $scope.enable = true;
                    }
                });

            },
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