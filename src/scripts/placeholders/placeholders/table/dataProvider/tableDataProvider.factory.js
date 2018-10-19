angular.module('app.placeholders')
    .factory('app.placeholders.tableDataProvider', [
        '$resource',
        'appConfig',
        'app.placeholders.tablePrepareData',
        '$q',
        function($resource, appConfig, TablePrepareData, $q) {

            var res = $resource(
                appConfig.api_host + 'amendmentLetters/:id/:placeholderName/:lineBreaks', null, {
                    get: {
                        method: 'GET',
                        cache: false,
                        params: {id: '@id', placeholderName: '@placeholderName'},
                        transformResponse: function(data) {
                            return new TablePrepareData().prepareGetData(data);
                        }
                    },
                    save: {
                        method: 'POST',
                        cache: false,
                        params: {id: '@id', placeholderName: '@placeholderName', lineBreaks: 'lineBreaks'},
                        transformRequest: function(data) {
                            var sendData = new TablePrepareData().prepareSendData(data);
                            return JSON.stringify({
                                lineBreaks: sendData
                            });
                        }
                    }
                }
            ),
                getPreparedTable = function(params){
                    var key = params.placeholderName + ':' + params.id;
                    return this._tablesCache[key];
                },
                _get = res.get
            ;


            angular.extend(res, {
                _tablesCache: {},
                get: function(params){
                    var key = params.placeholderName + ':' + params.id,
                        item = _get.call(res, params),
                        dfr = $q.defer()
                    ;
                    this._tablesCache[key] = item;
                    //we shoud remove sleeve data from result
                    item.$promise.then(function(data){
                        dfr.resolve(data);
                    });
                    return {
                        $promise: dfr.promise
                    };
                },
                getPreparedTable: getPreparedTable
            });

            return res;
        }])
;
