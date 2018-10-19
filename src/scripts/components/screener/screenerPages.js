/**
 * Pagination according to the requirments
 * @author IvanPanarin <ipanarin@luxoft.com>
 */

// @ngInject
function screenerPages(ScreenerService, appConfig) {
    return {
        restrict: 'E',
        templateUrl: '/scripts/components/screener/pages.html',
        scope: {
            boundaryLinks: "=",
            directionLinks: "="
        },
        controller: function($scope) {
            $scope.$on('screenerUpdate', function() {
                $scope.data.pages.last = Math.ceil($scope.data.table.data.totalCount / $scope.data.pages.items_per_page);
                $scope.data.pages.pagePrev = angular.copy($scope.data.pages.page);
            });
        },
        link: function(scope) {
            scope.data = ScreenerService.get();
            scope.data.pages.page = 1;
            scope.data.pages.pagePrev = 1;
            scope.data.pages.items_per_page = appConfig.items_per_page;
            scope.data.pages.per_page = appConfig.per_page;
            scope.data.pages.last = Math.ceil(scope.data.table.data.totalCount / scope.data.pages.items_per_page);
            ScreenerService.set(scope.data, true);

            scope.updatePages = function(page, items_per_page) {
                if(page !== undefined){
                    page = parseInt(page);
                    if(typeof page === "number"){
                        if((page >= 1 && page <= scope.data.pages.last && scope.data.pages.pagePrev !== page) || scope.data.pages.items_per_page !== items_per_page){
                            scope.data.pages.page = page;
                            scope.data.pages.pagePrev = page;
                            scope.data.pages.items_per_page = items_per_page;
                            scope.data.pages.last = Math.ceil(scope.data.table.data.totalCount / items_per_page);

                            ScreenerService.set(scope.data, true);
                        }
                    }
                    else{
                        scope.data.pages.page = scope.data.pages.pagePrev;
                    }
                }
                else{
                    scope.data.pages.page = scope.data.pages.pagePrev;
                }

            };
        }
    };
}

angular
    .module("app.directives")
    .directive("screenerPages", screenerPages);