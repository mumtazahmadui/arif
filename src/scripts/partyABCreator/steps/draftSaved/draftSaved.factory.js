angular.module('partyABCreator').factory('partyABCreator.draftSaved', [
    'CredentialsService',
    'AmendmentLetter',
    'partyABCreator.validationSelection',
    '$q',
    function(CredentialsService,
              AmendmentLetter,
              validationSelection,
              $q) {

        /**
         *
         * @param data
         * @returns {string}
         */
        function save(data) {
            var defer = $q.defer();
            // Saving Letter
            AmendmentLetter.save({
                'data': data
            }).success(function(data) {
                defer.resolve(data);
            }).error(function() {
                defer.reject();
            });
            return defer.promise;
        }

        return {
            save: save
        };

    }]);
