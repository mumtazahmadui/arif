(function () {
    'use strict';

    angular.module('app.bulk.upload-files', [])
        .config(function ($stateProvider) {
            $stateProvider
                .state('rfa.bulk-upload.files', {
                    url: '/files',
                    templateUrl: '/scripts/pages/bulk-upload/upload-files/upload-files.html',
                    controller: 'uploadFilesController',
                    controllerAs: 'vm'
                });
        });
})();
