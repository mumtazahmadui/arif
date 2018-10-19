/**
 * RFA Master Agreement API
 * ### Used for:
 *
 *     RFA
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

// @ngInject
function masterAgreementService($http, appConfig, CredentialsService) {
    /* jshint validthis: true */

    return {
        put: put
    };

    function put(params) {
        var data = {
            'sortBy': params.sortBy || null,
            'sortOrder': params.sortOrder || null,
            'userId': CredentialsService.userId(),
            'pageSize': params.pageSize || 1000,
            'offSet': params.offSet || 1,
            'companyId': CredentialsService.companyId(),
            'masterListLinked': !!params.offSet

        };

        return $http({
            method: 'PUT',
            data: angular.toJson(data, true),
            headers: {
                'Content-Type': 'application/json'
            },
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/master_agreement'
        });
    };

}

angular
    .module('app.services')
    .service('masterAgreementService', masterAgreementService);
