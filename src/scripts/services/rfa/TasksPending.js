// @ngInject
function tasksPendingService($http, appConfig, CredentialsService) {
    /* jshint validthis: true */
    return {
        get: get
    };

    function get() {
        return $http({
            method: 'GET',
            cache: false,
            url: appConfig.api_host + 'dashboard/company/' + CredentialsService.companyId() + '/amendment_stats'
        });
    }
};

angular
    .module('app.services')
    .service('TasksPendingService', tasksPendingService);
