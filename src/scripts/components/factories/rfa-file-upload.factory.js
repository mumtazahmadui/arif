(function() {
    'use strict';

    angular.module('app.services')
        .factory('rfaFileUpload', rfaFileUpload)
    ;

    function rfaFileUpload($http, appConfig, $q) {
        var factory = {},
            fileUpload = function (file, url, params, responseType){
                url = appConfig.api_host + url;
                if(checkIeVersion()) {
                    var sendData = {
                        //'_csrf': token.csrfToken,
                        'ie-9': true,
                        fileName: file.name
                    },
                        res = $q.defer();

                    if(params)
                        angular.extend(sendData, params);
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: 'json',
                        data: sendData,
                        files: file.element[0],
                        iframe: true,
                        processData: false
                    }).then(function(data){
                        res.resolve(data);
                    }, function(err){
                        if(err.status === 200 || err.status === 201){
                            res.resolve(err);
                        } else res.reject(err);
                    });
                    return res.promise;
                } else {
                    var formData = new FormData();
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
                }

                function checkIeVersion() {
                    var res = false;
                    var detectIEregexp;

                    if(navigator.userAgent.indexOf('MSIE') !== -1) {
                        //test for MSIE x.x
                        detectIEregexp = /MSIE (\d+\.\d+);/;
                    }else {
                        // if no "MSIE" string in userAgent
                        //test for rv:x.x or rv x.x where Trident string exists
                        detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/;
                    }

                    if (detectIEregexp.test(navigator.userAgent)) {
                        //if some form of IE
                        res = Math.floor(parseFloat(RegExp.$1));
                    }
                    return res;
                }
            }
        ;
        factory.fileUpload = fileUpload;
        return factory;
    }
})();
