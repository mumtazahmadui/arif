(function(){

    angular
        .module('ui.bootstrap.tooltip')
        .directive('auditEscaltion', auditEscaltion)
        .directive('auditEscaltionPopup',auditEscaltionPopup);


    // @ngInject
    function auditEscaltion($tooltip) {
        return $tooltip( 'auditEscaltion', 'tooltip', 'mouseenter' );
    }

    function auditEscaltionPopup(auditService){
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

                if(typeof $scope.content === 'string'){
                    $scope.content = angular.fromJson($scope.content.replace(/'/g, '"'));
                }
                var id = $scope.content.data;
                var deskCode = auditService.getDeskCode($scope.content.deskCode);
                var escaltion = auditService.getEscalate(id,deskCode);

                return escaltion.then(function(resp) {
                    if(resp.data.totalReviewCount > 0) {
                        $scope.auditData = resp.data.data;
                        $scope.enable = true;
                    }
                });
            },
            link: function(scope) {
                scope.getContentUrl = function() {
                    return '/scripts/components/screener/tables/audit/ssCheckboxEscalationAudit.html';
                };
            }
        };
    }
})();