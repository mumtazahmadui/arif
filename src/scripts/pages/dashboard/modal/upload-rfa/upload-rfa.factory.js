(function() {
    'use strict';
    angular
        .module('rfa.dashboard')
        .factory('UploadRFAFactory', UploadRFAFactory);

    function UploadRFAFactory($http, appConfig) {
        var factory = {},
            fileUpload = function (file, url, params, responseType) {
                var formData = new FormData();
                url = appConfig.api_host + url;
                console.log(url)
                if(params) {
                    Object.keys(params).forEach(function(key){
                        formData.append(key, params[key]);
                    });
                }
                formData.append('file', file.element[0].files[0]);
                formData.append('fileName', file.name);
                return $http({
                    method: 'POST',
                    //noAutoMessageOnError: true,
                    url: url,
                    data: formData,
                    //responseType: responseType || "arraybuffer",
                    //transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                });
            };

        factory.fileUpload = fileUpload;
        return factory;
    }
})();
