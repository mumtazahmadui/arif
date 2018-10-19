function escalationService(appConfig, $http) {
    /* jshint validthis: true */
    return {
        previewEmail: previewEmail,
        escalate:escalate
    };

    function previewEmail (deskCode,options) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'deskReview/' + deskCode + '/previewMail',
            data: options,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    function escalate(partyBId,deskType,options) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'partyB/' + partyBId + '/deskReview/' + deskType + '/escalate',
            data: options,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

}

angular
    .module('app.services')
    .service('EscalationService', escalationService);