// @ngInject
function myStatusService($rootScope, screenerConfigsFactory, $sessionStorage, CredentialsService, rfaGridSelection, appConfig, $http) {
    /* jshint validthis: true */
    return {
        mystatus: {
            getDesk1Index:null,
            getDesk1Name:null,
            getDesk2Index:null,
            getDesk2Name:null
        },
        getStatus: getStatus
    };
  
    function getStatus() {
        return $http({
            method: 'GET',
            url: appConfig.api_host + '/dashboard/myStatusLegend/'
        });
    }

}

angular
    .module('app.services')
    .service('myStatusService', myStatusService);