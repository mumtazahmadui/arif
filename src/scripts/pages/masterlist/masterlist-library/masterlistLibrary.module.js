(function() {
    angular.module('rfa.masterlist.library', []).config(['$stateProvider', config]);

    function config($stateProvider) {
        $stateProvider
            .state('rfa.masterlist.library', {
                url: "/library",
                templateUrl: "/scripts/pages/masterlist/masterlist-library/masterlistLibrary.template.html",
                controller: "masterlistLibraryController",
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