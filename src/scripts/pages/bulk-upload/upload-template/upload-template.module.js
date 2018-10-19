(function () {
    'use strict';

    angular.module('app.bulk.upload-template', [])
        .config(function ($stateProvider) {
            $stateProvider
                .state('rfa.bulk-upload.template', {
                    url: '/template',
                    templateUrl: '/scripts/pages/bulk-upload/upload-template/upload-template.html',
                    controller: 'uploadTemplateController',
                    controllerAs: 'upTmpCtrl'
                });
        });
})();
