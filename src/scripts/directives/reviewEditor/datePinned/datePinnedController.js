(function() {

    angular.module('app.directives')
        .controller('datePinnedCtrl', [
            'AmendmentLetter', '$scope',
            function(AmendmentLetter, $scope) {
                load();
                function load() {
                    AmendmentLetter
                        .getDatePinned($scope.amendmentId)
                        .success(render);
                }

                function render(data) {
                    $scope.datePinned = data.datePinned;
                }
            }]);
})();
