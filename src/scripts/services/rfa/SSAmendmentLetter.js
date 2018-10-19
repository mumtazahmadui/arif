// @ngInject
function ssAmendmentLetter($http, appConfig, CredentialsService) {
    /* jshint validthis: true */
    return {
        search: search,
        filterSearch: filterSearch,
        validate: validate,
        save: save,
        putExibit: putExibit,
        recall: recall,
        withdrawn: withdrawn
    };

    function search(params) {
        var data = {
            'agreementDate': params.data.filters[0].value || null,
            'investmentManager': params.data.filters[1].value || null,
            'partyBAccount': params.data.filters[2].value || null,
            'partyBClientIdentifier': params.data.filters[3].value || null,
            'partyBLei': params.data.filters[4].value || null,
            'myStatus': (params.data.filters[5].value && params.data.filters[5].value.map(function (item) { return item.code; })) || null,
            'rfaIds': params.data.filters[6].value || null,
            'masterlistIdentifier': params.data.filters[7].value || null,
            'agreementType': params.data.filters[8].value || null,
            'actionOnPartyB': params.data.filters[9].value || null,
            'requestStatus': params.data.filters[10].value || null,
            /* 'partyBAccount': params.data.filters[2].value || null,
            'actionOnPartyB': params.data.filters[3].value || null,
            'reviewData': (params.data.filters[5].value && params.data.filters[5].value.map(function(item) {return item.id;})) || null, */
            'sortBy': params.sortBy || null,
            'sortOrder': params.desc || null,
            'userId': CredentialsService.userId(),
            'pageSize': params.items_per_page,
            'offSet': params.page,
            'companyId': CredentialsService.companyId(),
            'companyType': 'SS',
            'task': params.data.task || null
        };

        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/search',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function filterSearch(params) {
        return $http({
            method: 'GET',
            cache: false,
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter_filter/' + params.filterName + '?filterString=' + params.filterString
        });
    };

    function validate(params) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letters/validation',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });
    }

    function save(params) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });
    };

    function putExibit(params) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendment_letter/' + CredentialsService.companyId() + '/exhibit',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });
    }

    function withdrawn(params) {
        var data = {
            'userId': CredentialsService.userId(),
            'data': params.data,
            'companyId': CredentialsService.companyId()
        };

        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.id + '/withdraw',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function recall(params) {
        var data = {
            'userId': CredentialsService.userId(),
            'data': params.data,
            'companyId': CredentialsService.companyId()
        };

        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.data + '/recall',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }
}

angular
    .module('app.services')
    .service('SSAmendmentLetter', ssAmendmentLetter);
