(function() {
    angular.module('app.services').factory('app.services.contentProvider', [
        '$q',
        'app.placeholders.contentFactory',
        'app.placeholders.placeholdersFactory',
        'app.services.placeholdersConfig',
        function($q,
                  ContentFactory,
                  PlaceholdersFactory,
                  placeholdersConfig) {
            function contentProvider(params) {
                var contentFactory = new ContentFactory();
                var placeholdersFactory = new PlaceholdersFactory();

                this.getContent = function() {
                    var content = contentFactory.getContentData(params);
                    var defer = $q.defer();
                    defer.resolve(content);
                    return defer.promise;
                };

                this.getPlaceholders = function() {
                    var placeholders = placeholdersFactory.getPlaceholders(placeholdersConfig, params);
                    return placeholders;
                };
            }

            return contentProvider;
        }
    ]);
}());
