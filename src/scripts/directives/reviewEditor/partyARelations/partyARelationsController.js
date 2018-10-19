(function() {

    angular.module('app.directives')
        .controller('partyARelationsCtrl', [
            'AmendmentLetter', '$scope', '$base64',
            function(AmendmentLetter, $scope, $base64) {

                $scope.loaded = false;
                load();
                function load() {
                    AmendmentLetter
                        .getPartyAPlaceHolder($scope.amendmentId)
                        .success(render);
                }

                function decodeText(text) {
                    return decodeURIComponent($base64.decode(text).replace(/\+/g,  ' '));
                }

                function render(data) {
                    $scope.partyARelationsText = decodeText(data.partyAText);
                }
            }]);
})();
