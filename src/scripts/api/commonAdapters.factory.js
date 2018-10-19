(function () {
    angular.module('rfa.dashboard')
        .factory('rfaApiCommonAdapter', rfaApiCommonAdapter);

    function rfaApiCommonAdapter(CredentialsService) {
        return {
            postData: postData
        };

        function postData(params) {
            return {
                'userId': CredentialsService.userId(),
                'companyId': CredentialsService.companyId(),
                data: params
            };
        }
    }
})();
