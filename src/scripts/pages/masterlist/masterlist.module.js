(function() {
    angular.module('rfa.masterlist', ['rfa.masterlist.library', 'rfa.masterlist.template']).config(['$stateProvider', config]);

    function config($stateProvider) {
        $stateProvider
            .state('rfa.masterlist', {
                url: "/masterlist",
                templateUrl: "/scripts/pages/masterlist/masterlist.html",
                controller: "MasterlistController",
                controllerAs: 'vm',
                reloadOnSearch: false,
                resolve: {
                    loadData: ['CredentialsService', function(CredentialsService) {
                        return CredentialsService.get();
                    }]
                }
            });
    }
})();

