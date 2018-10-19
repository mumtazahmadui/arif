(function () {
    'use strict';

    angular.module('app.bulk.exhibitValueUpload', [])
        .config(function ($stateProvider) {
            $stateProvider
                .state('rfa.bulk.exhibitValueUpload', {
                    url: '/exhibitValueUpload?',
                    templateUrl: '/scripts/pages/bulk/exhibit-value-upload/exhibit-value-upload.html',
                    controller: 'exhibitValueUploadController',
                    controllerAs: 'ExValueUploadCtrl',
                    params: {
                        rfaIds: null
                    }
                });
        });
})();