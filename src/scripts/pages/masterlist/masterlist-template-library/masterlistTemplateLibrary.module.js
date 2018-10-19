(function() {
    angular.module('rfa.masterlist.template', []).config(['$stateProvider', config]);

    function config($stateProvider) {
        $stateProvider
            .state('rfa.masterlist.template', {
                url: "/template-library",
                templateUrl: "/scripts/pages/masterlist/masterlist-template-library/masterlistTemplateLibrary.template.html",
                controller: "masterlistTemplateLibraryController",
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