angular.module('partyABCreator').factory('modificationFilter', [
    function() {
        function filter(item) {
            return item.isModified && !item.deleted;
        }

        function modified(item) {
            return item.isModified;
        }

        return {
            filter: filter,
            modified: modified
        };
    }]);
