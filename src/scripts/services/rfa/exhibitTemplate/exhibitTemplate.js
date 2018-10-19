/**
 * RFA Exhibit Template API
 * ### Used for:
 *
 *     RFA
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

// @ngInject
function rfaExibitTemplateService($http, appConfig, CredentialsService) {
    /* jshint validthis: true */

    return {
        get: get,
        put: put,
        post: post,
        del: del,
        search: search,
        filterSearch: filterSearch,
        linkMasterAgreement:linkMasterAgreement
    };

    function get(templateId) {
        if (templateId === undefined) {
            templateId = "";
        }
        return $http({
            method: 'GET',
            cache: false,
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template/' + templateId
        });
    };

    function del(companyId, templateId) {
        return $http({
            method: 'DELETE',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template/' + templateId
        });
    };

    function linkMasterAgreement(exhibitTemplateId,masterAgreementId){
        return $http({
            method:'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            url:appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template/'+exhibitTemplateId+'/masterlist/' + masterAgreementId
        });
    }

    function put(exhibitTemplate) {
        var data = exhibitTemplate;
        data.companyId = CredentialsService.companyId();
        data.userId = CredentialsService.userId();
        data.data.modifiedBy = CredentialsService.userId();
        data.data.companyId = CredentialsService.companyId();

        return $http({
            method: 'PUT',
            data: angular.toJson(data, true),
            headers: {
                'Content-Type': 'application/json'
            },
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template'
        });
    };

    function post(exhibitTemplate) {

        var data = exhibitTemplate;
        data.companyId = CredentialsService.companyId();
        data.userId = CredentialsService.userId();
        data.data.createdBy = CredentialsService.userId();
        data.data.modifiedBy = CredentialsService.userId();
        data.data.companyId = CredentialsService.companyId();

        return $http({
            method: 'POST',
            data: angular.toJson(data, true),
            headers: {
                'Content-Type': 'application/json'
            },
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template'
        });
    }

    function ucfirst(str) {
        var f = str.charAt(0).toUpperCase();
        return f + str.substr(1, str.length - 1);
    }

    function updateNameFormFilter(id) {
        var name = id.split('_');
        var length = name.length;
        if (1 === length) {
            return id;
        }

        for (var i = 1; i < length; i++) {
            name[i] = ucfirst(name[i]);
        }

        return name.join('');
    }

    function search(params) {
        var data = {
            sortBy: params.sortBy || null,
            sortOrder: params.desc || null,
            userId: CredentialsService.userId(),
            pageSize: params.items_per_page,
            offSet: params.page,
            companyId: CredentialsService.companyId()
        };

        //add filters to data variable
        params.data.filters.forEach(function(item) {
            if (item.id) {
                var filterName = updateNameFormFilter(item.id);
                data[filterName] = item.value || null;
            }
        });

        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template/search',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function filterSearch(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template_filter/' + params.filterName + '?filterString=' + params.filterString
        });
    };
}

angular
    .module('app.services')
    .service('rfaExibitTemplateService', rfaExibitTemplateService);