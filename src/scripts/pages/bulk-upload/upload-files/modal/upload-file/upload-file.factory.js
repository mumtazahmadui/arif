(function() {
    'use strict';
    angular
        .module('app.bulk.upload-files')
        .factory('FileUploadFactory', FileUploadFactory);

    function FileUploadFactory($http, appConfig) {
        var factory = {},
            fileUpload = function (file, url, params, responseType) {
                var formData = new FormData();
                url = appConfig.api_host + url;

                if(params) {
                    Object.keys(params).forEach(function(key){
                        formData.append(key, params[key]);
                    });
                }
                formData.append('file', file.element[0].files[0]);
                formData.append('fileName', file.name);
                return $http({
                    method: 'POST',
                    noAutoMessageOnError: true,
                    url: url,
                    data: formData,
                    responseType: responseType || "arraybuffer",
                    transformRequest: angular.identity,
                    transformResponse: function(data) {
                        var res;
                        try {
                            res = JSON.parse(data);
                        } catch(err){
                            res = data;
                        }
                        return res;
                    },
                    headers: {'Content-Type': undefined}
                });
            };

        factory.fileUpload = fileUpload;
        return factory;
    }
})();
