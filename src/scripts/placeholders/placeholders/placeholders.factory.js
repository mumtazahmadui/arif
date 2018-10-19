angular.module('app.placeholders')
    .factory('app.placeholders.placeholdersFactory', [
        'app.placeholders.placeholdersService',
        function (PlaceholdersService) {
            function placeholdersFactory() {
                this.placeholders = [];
            }

            placeholdersFactory.prototype.getPlaceholders = function(config, params) {
                var self = this;
                angular.forEach(config, function(item) {
                    var placeholdersService = new PlaceholdersService(item, params.id);
                    self.placeholders.push({
                        item: item,
                        id:item.id,
                        getContent: function () {
                            return placeholdersService.get();
                        },
                        saveData: function () {
                            return placeholdersService.save();
                        }
                    });
                });

                return this.placeholders;
            };

            return placeholdersFactory;
        }]);


