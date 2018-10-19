(function(){

    angular
        .module('ui.bootstrap.tooltip')
        .directive('auditTooltipCompile', auditTooltipCompile)
        .directive('auditTooltipCompilePopup',auditTooltipCompilePopup);


    // @ngInject
    function auditTooltipCompile($tooltip) {
        return $tooltip( 'auditTooltipCompile', 'tooltip', 'mouseenter' );
    }

    function auditTooltipCompilePopup(auditService){
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
                $scope.auditData = null;
                $scope.enable = false;
                $scope.tooltipsTitle = '';

                if(typeof $scope.content === 'string'){
                    $scope.content = angular.fromJson($scope.content.replace(/'/g, '"'));
                }
                var id = $scope.content.data;
                var deskCode = auditService.getDeskCode($scope.content.deskCode);
                var some = auditService.getAudit(id,deskCode);

                $scope.title = function(string) {
                    var a = auditService.rfaType(string);
                    if (a.status == 'InProgress') {
                        $scope.tooltipsTitle = 'In Progress';
                    }else {
                        $scope.tooltipsTitle = a.status;
                    }
                }

                return some.then(function(resp) {
                    if(resp.data.totalReviewCount > 0) {
                        $scope.auditData = resp.data;
                        $scope.title($scope.content.deskCode);
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