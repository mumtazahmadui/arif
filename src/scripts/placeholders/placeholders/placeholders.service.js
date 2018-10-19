angular.module('app.placeholders')
    .service('app.placeholders.placeholdersService', [
        '$q',
        '$rootScope',
        '$compile',
        '$injector',
        function($q, $rootScope, $compile, $injector) {
            return function(config, id) {
                var dataProvider = $injector.get(config.provider);
                var requestParams = {
                    id: id
                };

                if (config.dataType === 'table') {
                    requestParams['placeholderName'] = config.endpoint;
                }

                this.get = function() {
                    var deferred = $q.defer(), self = this;
                    if(!dataProvider) {
                        setTimeout(function(){deferred.resolve(self);}, 20);
                        return deferred.promise;
                    }
                    var promise = dataProvider.get(requestParams, config).$promise;
                    if (!promise) {
                        setTimeout(function(){deferred.resolve(self);}, 20);
                        return deferred.promise;
                    }

                    promise.then(function(data) {
                        self.placeholderData = data;
                        var scope = $rootScope.$new();
                        scope.data = self.placeholderData;
                        var directive = angular.element('<' + config.directiveName + ' data="data">');
                        var res = $compile(directive)(scope);
                        setTimeout(function() {
                            deferred.resolve(res);
                        });
                    });

                    return deferred.promise;
                };

                this.save = function() {
                    var deferred = $q.defer();
                    if(!dataProvider) {
                        setTimeout(function(){deferred.resolve(this);}, 20);
                        return deferred.promise;
                    }
                    var promise = dataProvider.save(requestParams, {data: this.placeholderData, id: config.id}).$promise;

                    if (!promise) {
                        setTimeout(function(){deferred.resolve(this);}, 20);
                        return deferred.promise;
                    }
                    promise.then(function() {
                        deferred.resolve(this);
                    });
                    return deferred.promise;
                };
            };
        }]);