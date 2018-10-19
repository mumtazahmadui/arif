angular.module('partyABCreator.utils')
    .service('deletedService', function() {
        var data = [];

        this.clean = function() {
            data.length = 0;
            return this;
        };

        var createElement = function(item) {
            var newItem = angular.copy(item);
            newItem.deleted = 1;
            newItem.isAdded = false;
            newItem.isModified = false;
            newItem.entity.deleted = 1;
            return newItem;
        };

        this.addItem = function(item) {
            var newItem = createElement(item);
            var index = _.findLastIndex(data, {
                            id: newItem.id
                        });

            if (-1 === index) {
                data.push(newItem);
            }
            return this;
        };

        this.getData = function() {
            return data;
        };
    });
