(function () {
    'use strict';

    angular.module('app.bulk.upload', ['app.bulk.upload-files', 'app.bulk.upload-template'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('rfa.bulk-upload-create', {
                url: '/create/:templateId',
                templateUrl: '/scripts/pages/bulk-upload/create-template/create-template.html',
                controller: 'createTemplateController',
                controllerAs: 'vm',
                params: {
                    templateId: null
                }
            });
    });
})();
