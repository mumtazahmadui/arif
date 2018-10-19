(function(){
    angular.module('app.services')
    .factory('sleevesService', ['$http', 
                                  '$q',
                                  'appConfig', 
                                  'CredentialsService',
                                  function($http, 
                                           $q,
                                           appConfig,
                                           CredentialsService) {
        return {
            search: search,
            getForEntities: getForEntities
        };
        function search(searchString) {
            return CredentialsService.get().then(function(){
                return $http.get(appConfig.api_host + 
                                 'company/' + CredentialsService.companyId() +
                                 '/entity?type=sleeve&filterString=' + searchString +
                                 '&masterlistIds&entityIds&offSet=1&pageSize=500');
            })
            .then(function(result){
                if (result && result.data && result.data.data) {
                    return result.data.data;
                }
                return [];
            });
        }
        
        function getForEntities(entityIds, masterlistIds) {
            return CredentialsService.get().then(function(){
                return $http.get(appConfig.api_host + 
                                 'company/' + CredentialsService.companyId() +
                                 '/entity?type=sleeve&filterString=' +
                                 '&masterlistIds=' + masterlistIds +
                                 '&entityIds='+ entityIds + '&offSet=&pageSize=');
            })
            .then(function(result){
                if (result && result.data && result.data.data) {
                    return result.data.data;
                }
                return [];
            });
        }
    }]);
})();