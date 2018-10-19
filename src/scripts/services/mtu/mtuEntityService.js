// @ngInject
function mtuEntityService($http, appConfig) {
    /* jshint validthis: true */
    return {
        get: get,
        post: post
    };

    function get(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'v1/entity/' + params
        });
    }

    function post(params, postData) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'v1/entity/' + params,
            data: postData
        });
    }
}

angular
    .module('app.services')
    .service('MTUEntityService', mtuEntityService);