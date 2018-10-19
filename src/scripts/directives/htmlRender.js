(function() {
    return;
    angular.module('app.directives')
        .directive('htmlRender', [
            '$compile',
        function($compile) {
            return {
                restrict: 'E',
                replace: true,
                link: function(scope, element) {
                    scope.$watch('htmlRender', function(value) {
                        if (!value) {
                            return;
                        }
                        var content = $compile(value)(scope);
                        // scope.appendEditorContent(content);
                        console.log("APPENDING CONTENT => ", content);
                        element.append(content);
                    });
                }
            };
        }]);
})();
