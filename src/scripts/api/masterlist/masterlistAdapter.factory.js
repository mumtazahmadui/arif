(function () {
    angular.module('rfa.dashboard')
        .factory('rfaApiMasterlistAdapter', rfaApiMasterlistAdapter);

    function rfaApiMasterlistAdapter(CredentialsService) {
        return {
            commonRowsData: commonRowsData,
            masterlistLibraryData: masterlistLibraryData,
            masterlistLibraryTemplateData: masterlistLibraryTemplateData,
            sendTemplateDate: sendTemplateDate
        };

        function commonRowsData(params) {
            return {
                "sortBy": params.sortBy || null,
                "sortOrder": params.desc || null,
                "userId": CredentialsService.userId(),
                "pageSize": params.items_per_page,
                "offSet": params.page,
                "companyId": CredentialsService.companyId()
            };
        }

        function sendTemplateDate(params) {
            return {
                templateName: params.templateName,
                templateFields: params.templateFields
            };
        }

        function masterlistLibraryTemplateData(params) {
            var data = commonRowsData(params);
            data.mlTemplateName = params.data.filters[0].value || null;
            return data;
        }

        function masterlistLibraryData(params) {
            var data = commonRowsData(params);
            data.partyA = params.data.filters[3].value || null;
            data.masterAgreementDate = params.data.filters[0].value || null;
            data.investmentManager = params.data.filters[2].value || null;
            data.masterlist_identifier = params.data.filters[1].value || null;
            data.agreementType = params.data.filters[4].value || null;
            return data;
        }
    }
})();