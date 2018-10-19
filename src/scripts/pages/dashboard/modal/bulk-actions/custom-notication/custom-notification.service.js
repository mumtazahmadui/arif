function customNotificationService(appConfig, $http) {
    /* jshint validthis: true */
    return {
        previewEmail: previewEmail,
        customNotify:customNotify
    };

    function previewEmail (options) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'deskReview/custom/previewMail',
            data: options,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    function customNotify(options) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'dashboard/customNotify',
            data: options,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

}

angular
    .module('app.services')
    .service('customNotificationService', customNotificationService);