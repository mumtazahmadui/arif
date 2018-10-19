function kycService(appConfig, $http) {
    /* jshint validthis: true */
    return {
        previewEmail: previewEmail,
        notify:notify
    };

    function previewEmail (deskType,options) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'deskReview/' + deskType + '/previewMail',
            data: options,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    function notify(deskType,options) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'deskReview/' + deskType + '/notify',
            data: options,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

}

angular
    .module('app.services')
    .service('kycService', kycService);