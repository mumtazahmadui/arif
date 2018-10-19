(function() {
    angular
        .module('rfa.letters')
        .service('LetterTemplate', letterTemplate);

    // @ngInject
    function letterTemplate($http, appConfig, CredentialsService, $base64, $q) {
        /* jshint validthis: true */
        return {
            search: search,
            get: get,
            put: put,
            post: post,
            remove: remove,
            decodeContent: decodeContent,
            encodeContent: encodeContent,
            filterSearch: filterSearch,
            validateContent: validateContent,
            enableSave: enableSave
        };

        function search(params) {
            var data = {
                "sortBy": params.sortBy || null,
                "createdBy": params.data.filters[2].value || null,
                "sortOrder": params.desc || null,
                "modifiedBy": params.data.filters[1].value || null,
                "userId": CredentialsService.userId(),
                "pageSize": params.items_per_page,
                "offSet": params.page,
                "companyId": CredentialsService.companyId(),
                "templateName": params.data.filters[0].value || null
            };

            return $http({
                method: 'POST',
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/letter_template/search',
                headers: { 'Content-Type': 'application/json' },
                data: data
            });
        }



        function enableSave(content) {
            var result = ((
                    $(content).find('#partyBAddition').length ||
                    $(content).find('#partyBRemoval').length
                ) ||
                (
                    $(content).find('#fund_name_change').length ||
                    $(content).find('#exhibit_value_change').length
                ));
            return result;
        }

        function validateContent(content) {
            var result = {
                isValid: true,
                message: ''
            };
            var isEnteredDefault = enableSave(content);
            if (!isEnteredDefault) {
                result.isValid = false;
            } else {

                var bsSignatureLength = $(content).find('[id^=bs_signature]').length;
                var ssSignatureLength = $(content).find('[id^=ss_signature]').length;

                if (!bsSignatureLength && !ssSignatureLength) {
                    result.message = 'Please insert at least one buyside and sellside signature placeholder';
                    result.isValid = false;
                }

                if (bsSignatureLength && !ssSignatureLength) {
                    result.message = 'Please insert at least one sellside signature placeholder';
                    result.isValid = false;
                }

                if (!bsSignatureLength && ssSignatureLength) {
                    result.message = 'Please insert at least one buyside signature placeholder';
                    result.isValid = false;
                }
            }
            return result;
        }

        function encodeContent(content) {
            return $base64.encode(encodeURIComponent(content.replace(/<br>/g, '<br/>')));
        }

        function decodeContent(source) {
            var content = decodeURIComponent($base64.decode(source));
            var values = /value="((?!\<)[a-zA-Z0-9\s\[\]]*(?!\<))"/g;
            content = content.replace(values, 'value="&lt; $1 &gt;"');
            return content;
        }

        function get(params) {
            var defer = $q.defer();
            $http({
                cache: false,
                method: 'GET',
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/letter_template/' + params.templateId
            }).success(function(data) {
                if (params.templateId) {
                    data.data.content = decodeContent(data.data.content || '');
                }
                defer.resolve(data);
            }).error(defer.reject);

            return defer.promise;
        }

        function remove(params) {
            return $http({
                method: 'DELETE',
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/letter_template/' + params.templateId
            });
        }

        function put(data) {
            var params = {};
            params.data = data;
            params.userId = CredentialsService.userId();
            params.data.modifiedBy = CredentialsService.userId();
            params.data.companyId = CredentialsService.companyId();
            params.companyId = CredentialsService.companyId();
            params.data.content = encodeContent(params.data.content);
            return $http({
                method: 'PUT',
                data: angular.toJson(params, true),
                headers: {
                    'Content-Type': 'application/json'
                },
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/letter_template'
            });
        }

        function post(data) {
            var params = {};
            params.data = data;
            params.userId = CredentialsService.userId();
            params.data.createdBy = CredentialsService.userId();
            params.data.modifiedBy = CredentialsService.userId();
            params.data.companyId = CredentialsService.companyId();
            params.companyId = CredentialsService.companyId();
            params.data.content = encodeContent(params.data.content);
            return $http({
                method: 'POST',
                data: angular.toJson(params, true),
                headers: {
                    'Content-Type': 'application/json'
                },
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/letter_template'
            });
        }

        function filterSearch(params) {
            return $http({
                method: 'GET',
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/letter_template_filter/' + params.filterName + '?filterString=' + params.filterString
            });
        };
    }
})();
