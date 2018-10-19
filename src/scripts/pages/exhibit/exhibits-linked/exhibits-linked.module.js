(function() {
    angular.module('rfa.exhibits-linked', [])
        .config(['$stateProvider', config]);

    function config($stateProvider) {
        $stateProvider
            .state('rfa.exhibitItem', {
                url: '/exhibitsLinked/:contentId/:exhibitId',
                templateUrl: '/scripts/pages/exhibit/exhibits-linked/editor/exhibits-linked.html',
                controller: 'exhibitsLinkedController',
                controllerAs: 'exhsLinkCtrl',
                reloadOnSearch: false,
                resolve: {
                    loadData: ['CredentialsService', function(CredentialsService) {
                        return CredentialsService.get();
                    }]
                }
            });
    }
})();
