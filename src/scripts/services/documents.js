/**
 * RFA Documents API
 * ### Used for:
 *
 *     RFA
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

// @ngInject
function documentsService($http, appConfig, CredentialsService) {
    /* jshint validthis: true */

    return {
        get: get,
        link: link,
        openFile: openFile,
        openFileForESign: openFileForESign,
        downloadFile: downloadFile,
        openFileForESignClick: openFileForESignClick,
        openFileForWSignConsolidated: openFileForWSignConsolidated
    };

    function get(fileId, companyId) {
        if (companyId === undefined) {
            companyId = CredentialsService.companyId();
        }
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'company/' + companyId + '/files/download_file/' + fileId
        });
    }

    function link(fileId, companyId) {
        if (companyId === undefined) {
            companyId = CredentialsService.companyId();
        }
        return appConfig.api_host + 'company/' + companyId + '/files/download_file/' + fileId;
    }

    function openFile(params) {
        return appConfig.api_host + 'amendmentLetters/' + params.id + '/actions/rfaid_pdf';
    }

    function openFileForESign(params) {
        // per CPM-15834
        return appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.amendmentId + '/0/pdf';
    }

    function openFileForWSignConsolidated(params) {
        return appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.amendmentId + '/wetSignConsolidatedPdf';
    }

    function openFileForESignClick(params) {
        return appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.amendmentId + '/1/pdf';
    }

    function downloadFile(params) {
        return appConfig.api_host + 'company/' + CredentialsService.companyId() + '/files/download_file/' + params.fileId;
    }
}

angular
    .module('app.services')
    .service('documentsService', documentsService);
