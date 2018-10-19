(function () {
    angular.module('rfa.dashboard')
        .service('rfaApiMasterlist', rfaApiMasterlist);

    function rfaApiMasterlist($resource, CredentialsService, appConfig, rfaApiMasterlistAdapter) {
        var COMMON_URL = appConfig.api_host;

        return $resource(appConfig.api_host, {}, {
            createTemplate: {
                url: COMMON_URL + 'masterlist_template',
                method: 'POST',
                transformRequest: function (params) {
                    return JSON.stringify(rfaApiMasterlistAdapter.sendTemplateDate(params));
                }
            },
            getRows: {
                method: 'POST',
                url: COMMON_URL + 'company/' + CredentialsService.companyId() + '/master_list/search',
                headers: {
                    'Content-Type': 'application/json'
                },
                transformRequest: function (params) {
                    return JSON.stringify(rfaApiMasterlistAdapter.masterlistLibraryData(params));
                }
            },
            getRowsTemplates: {
                method: 'POST',
                url: COMMON_URL + 'masterlist_template/search',
                headers: {
                    'Content-Type': 'application/json'
                },
                transformRequest: function (params) {
                    return JSON.stringify(rfaApiMasterlistAdapter.masterlistLibraryTemplateData(params));
                }
            },
            filterSearch: {
                method: 'GET',
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/master_list_filter/:filterName',
                params: {filterName: 'filterName', filterString: '@filterString'}
            },
            filterTemplateSearch: {
                method: 'GET',
                url: COMMON_URL + 'masterlist_template_filter/:filterName',
                params: {filterName: 'filterName', filterString: '@filterString'}
            },
            deleteTemplate: {
                method: 'DELETE',
                url: COMMON_URL + 'masterlist_template/:templateId',
                params: {templateId: 'templateId'}
            },
            deleteMasterlist: {
                method: 'DELETE',
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/master_list/:id',
                params: {id: 'id'}
            },
            getAgreementTypes: {
                method: 'GET',
                url: COMMON_URL + 'company/' + CredentialsService.companyId() + '/master_list_filter/agreement_types'
            },
            putAgreementType: {
                method: 'PUT',
                url: COMMON_URL + 'company/' + CredentialsService.companyId() + '/master_list/:id',
                params: {id: 'id'},
                transformRequest: function (params) {
                    return JSON.stringify({agreementTypeId: params.id});
                }
            }
        });
    }
})();
