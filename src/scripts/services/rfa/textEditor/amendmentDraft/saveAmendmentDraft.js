angular.module('app.services').factory('saveAmendmentDraft', [
    '$q',
    'modalsService',
    '$stateParams',
    '$location',
    function (
        $q,
        modalsService,
        $stateParams,
        $location
    ) {
        function saveContentStep() {
            this.scope.notificationText = "Saving";
            this.scope.$emit('content:render:start');
            var defer = $q.defer();
            this.amendment.saveData();
            defer.resolve(null);
            return defer.promise;
        }

        function savePlaceholdersStep() {
            var defer = $q.defer();
            angular.forEach(this.amendment.newPlaceholders, function (item) {
                item.placeholder.saveData();
            });
            defer.resolve(null);
            return defer.promise;
        }

        function draftSaveConfirmStep() {
            this.scope.$emit('content:render:end');
            return modalsService.alert({
                'title': "Letter Draft Saved " + $stateParams.contentId,
                'class': 'modal-rfa'
            }).result.then(function() {}, redirectStep);
        }

        function redirectStep() {
            $location.path('/rfa/company/amendmentLetter/');
        }

        function save($scope, amendment) {
            if(!amendment) {
                return;
            }
            this.scope = $scope;
            this.amendment = amendment;

            $q.all([
                savePlaceholdersStep(),
                saveContentStep()
            ]).then(draftSaveConfirmStep);
        }

        return save;
    }]);
