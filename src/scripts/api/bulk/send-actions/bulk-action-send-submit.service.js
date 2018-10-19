(function () {
    angular.module('rfa.dashboard')
        .service('bulkActionSubmit', function ($resource, CredentialsService, appConfig) {
            return $resource(appConfig.api_host + 'amendmentLetters/:type/:action', {}, {
                ntfToSignatories: {
                    method: 'POST',
                    params: {
                        type: 'actions',
                        action: '@action'
                    },
                    transformRequest: function (params) {
                        var data = {
                            'userId': CredentialsService.userId(),
                            'companyId': CredentialsService.companyId(),
                            data: params
                        };

                        return JSON.stringify(data);
                    }
                },
                sendRFA: {
                    method: 'PUT',
                    params: {
                        type: 'actions',
                        action: '@action'
                    },
                    transformRequest: function (params) {
                        var data = params.rfaIds;
                        return JSON.stringify(data);
                    }
                },
                ntfChaser: {
                    method: 'POST',
                    params: {
                        type: '@type'
                    },
                    transformRequest: function (params) {
                        var data = params.ids;
                        return JSON.stringify(data);
                    }
                }
            });
        });
    function getFileNameFromHeader(header) {
        if (!header) return null;

        var result = header.split(";")[1].trim().split("=")[1];

        return result.replace(/"/g, '');
    }
})();