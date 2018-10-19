(function() {

    angular.module('app.directives')
        .directive('asteriskInput', [
        function() {
            return {
                restrict: 'A',
                scope: {
                    asteriskInput: '='
                },
                link: function($scope, element) {
                    var ASTERISK = '*';
                    var oldValue = '';

                    var keyupListener = function(event) {
                        element.off('keyup', keyupListener);
                        if (event.ctrlKey) {
                            return;
                        }

                        var value = element.val();
                        if (oldValue !== value) {
                            element.val(value.split(ASTERISK).join('') + ASTERISK);
                        }
                    };

                    var keydownListener = function() {
                        element.off('keyup', keyupListener);
                        element.on('keyup', keyupListener);

                    };

                    var checkValue = function() {
                        var value = element.val();
                        if (ASTERISK !== value.charAt(value.length - 1)) {
                            value += ASTERISK;
                            element.val(value);
                            oldValue = value;
                        }
                    };

                    var removeAsterisk = function() {
                        var value = element.val();
                        var lastCharIndex = value.length - 1;
                        if (ASTERISK === value.charAt(lastCharIndex)) {
                            value = value.substr(0, lastCharIndex);
                            element.val(value);
                            oldValue = value;
                        }
                    };

                    $scope.$watch('asteriskInput', function() {
                        if ($scope.asteriskInput) {
                            oldValue = element.val();
                            element.off('keydown', keydownListener);
                            checkValue();
                            element.on('keydown', keydownListener);
                        } else {
                            removeAsterisk();
                            element.off('keydown', keydownListener);
                        }
                    });
                }
            };
        }]);
})();
