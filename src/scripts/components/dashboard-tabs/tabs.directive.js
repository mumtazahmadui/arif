(function () {
    angular.module('rfa.components').directive('rfaDashboardTab', function (CredentialsService, $rootScope) {
        return {
            replace: true,
            scope: {
                tabsConfig: "="
            },
            templateUrl: '/scripts/components/dashboard-tabs/tabs.html',
            controller: function($scope, $state) {
                init();

                $rootScope.$on('$stateChangeSuccess', init);

                $scope.toggleTab = function() {
                    $scope.tabsConfig.forEach(function(tab) {
                        tab.active = false;
                    });

                    this.tab.active = true;
                };

                $scope.checkPermission = function (tab) {
                    return !tab.permission || CredentialsService.hasPermission(tab.permission);
                };

                function init () {
                    $scope.tabsConfig.forEach(function(tab) {
                        tab.active = ($state.current.name === tab.href);
                    });
                }
            }
        };
    });
})();