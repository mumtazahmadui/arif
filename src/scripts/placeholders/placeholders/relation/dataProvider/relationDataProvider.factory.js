angular.module('app.placeholders')
    .factory('app.placeholders.relationDataProvider', [
        '$http',
        '$resource',
        '$rootScope',
        '$compile',
        'appConfig',
        'app.placeholders.relationPrepareData',
        function($http, $resource, $rootScope, $compile, appConfig, RelationPrepareData) {
            return $resource(
                appConfig.api_host + 'amendmentLetters/:id/partyAPlaceHolder', {id: '@id'}, {
                    get: {
                        method: 'GET',
                        cache: false,
                        transformResponse: function(data) {
                            return new RelationPrepareData().prepareGetData(data);
                        }
                    },
                    save:{
                        method: 'POST',
                        cache: false,
                        transformRequest: function (data) {
                            var sendData = new RelationPrepareData().prepareSendData(data);
                            return JSON.stringify(sendData);
                        }
                    }
                }
            );
        }]);
