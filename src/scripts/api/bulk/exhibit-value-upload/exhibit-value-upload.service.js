(function () {
    'use strict';
    angular.module('app.services')
        .service('ExhibitValueUploadService', [
            '$http',
            'appConfig',
            ExhibitValueUploadService
        ]);

    function ExhibitValueUploadService($http, appConfig) {
        return {
            updateExhibit: function (params) {
                return $http.put(appConfig.api_host + 'amendmentLetters/exhibits?fileId=' + params.fileId +
                    '&fileName=' + params.fileName
                );
            }
        }
    }
})();