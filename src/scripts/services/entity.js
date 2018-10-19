/**
 * RFA Entity API
 * ### Used for:
 *
 *     RFA
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

// @ngInject
function entityService($http, appConfig, CredentialsService) {
    /* jshint validthis: true */

    return {
        put: put
    };

    function put(params) {
        if (params.companyId === undefined) {
            params.companyId = CredentialsService.companyId();
        }

        var data = {
            'sortBy': params.sortBy || null,
            'sortOrder': params.sortOrder || null,
            'userId': CredentialsService.userId(),
            'pageSize': params.pageSize,
            'offSet': params.offSet,
            'companyId': params.companyId
        };

        return $http({
            method: 'POST',
            data: angular.toJson(data, true),
            url: appConfig.api_host + 'company/' + params.companyId + '/entity?filterString=' + (params.searchString || '')

        });
    }
}

angular
    .module('app.services')
    .service('entityService', entityService);
