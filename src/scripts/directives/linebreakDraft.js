(function() {
    angular.module('app.directives')
        .directive('linebreakDraft', function() {
                return {
                    restrict: 'A',
                    scope: {
                        placeholderId: '@',
                        placeholderIndex: '@'
                    },
                    templateUrl: '',
                    link: function() {
                        var onKeyDown = function() {
                            return;
                        };

                        $('#editor').on('keydown', onKeyDown);
                    }
                };
            });
})();
