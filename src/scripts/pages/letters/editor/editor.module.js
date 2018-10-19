(function() {
    angular.module('rfa.letters.editor', []).config(['$stateProvider', config]);

    function config($stateProvider) {
        $stateProvider
            .state('rfa.letterTemplate', {
                url: "/letterTemplate/:contentId",
                templateUrl: "/scripts/pages/letters/editor/editor.html",
                title: "Letter Template Editor",
                controller: "LetterEditorController",
                controllerAs: 'vm',
                reloadOnSearch: false,
                resolve: {
                    loadData: ['CredentialsService', function(CredentialsService) {
                        return CredentialsService.get();
                    }]
                }
            })
        ;
    }
})();
