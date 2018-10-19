(function () {
    'use strict';
    angular.module('app.services')
        .service('BulkUploadService', [
            '$resource',
            'CredentialsService',
            'appConfig',
            'rfaApiBulkUploadAdapter',
            BulkUploadService
        ]);

    function BulkUploadService($resource, CredentialsService, appConfig, rfaApiBulkUploadAdapter) {
        var COMMON_URL = appConfig.api_host;

        return $resource(appConfig.api_host, {}, {
            getRows: {
                method: 'POST',
                url: COMMON_URL + 'upload_template/search',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            getUploadedFilesRows: {
                method: 'POST',
                url: COMMON_URL + 'upload_file/search',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            filterSearch: {
                method: 'GET',
                url: appConfig.api_host + 'company/upload_template_filter/template_name',
                params: { filterString: '@filterString' }
            },
            filterSearchProcessingStatus: {
                method: 'GET',
                url: appConfig.api_host + 'upload_file/filter/processingStatus',
                params: { filterString: '@filterString' }
            },
            filterSearchUploadedBy: {
                method: 'GET',
                url: appConfig.api_host + 'upload_file/filter/uploadedBy',
                params: { filterString: '@filterString' }
            },
            deleteTemplate: {
                method: 'DELETE',
                url: COMMON_URL + 'upload_template/:templateId',
                params: { templateId: '@templateId' }
            },
            deleteFile: {
                method: 'DELETE',
                url: COMMON_URL + 'company/:companyId/rfaErrorFile/:fileId',
                params: { companyId: '@companyId', fileId: '@fileId' }
            },
            getUploadTempalate: {
                method: 'GET',
                url: COMMON_URL + 'upload_template/:templateId',
                params: { templateId: '@templateId' },
                transformResponse: function (data) {
                    var data = JSON.parse(data);
                    data.templateFields.forEach(function (row) {
                        row.entityIdentifier = !!row.entityIdentifier;
                    });
                    return data;
                }
            },
            postUploadTempalate: {
                method: 'POST',
                url: COMMON_URL + 'upload_template',
                headers: {
                    'Content-Type': 'application/json'
                },
                transformRequest: function (params) {
                    var data = rfaApiBulkUploadAdapter.postData(params);
                    return JSON.stringify(data);
                }
            },
            putUploadTempalate: {
                method: 'PUT',
                url: COMMON_URL + 'upload_template/:templateId',
                params: { templateId: '@templateId' },
                headers: {
                    'Content-Type': 'application/json'
                },
                transformRequest: function (params) {
                    var data = rfaApiBulkUploadAdapter.postData(params);
                    if (params.templateId) {
                        data.templateId = params.templateId;
                    }
                    return JSON.stringify(data);
                }
            },
            getUploadTempalateRules: {
                method: 'GET',
                url: appConfig.api_host + 'company/upload_template_filter/value',
                transformResponse: function (data) {
                    var transformData = {},
                        rules = JSON.parse(data);
                    transformData = _.reduce(rules.data, function (acc, curr) {
                        acc[curr.fieldIdentifier] = curr;
                        return acc;
                    }, {});
                    return transformData;

                }
            },
            getUploadFileName : {
                method: 'GET',
                url: appConfig.api_host + 'upload_file/filter/templateNames',
            }
        });
    }
})();