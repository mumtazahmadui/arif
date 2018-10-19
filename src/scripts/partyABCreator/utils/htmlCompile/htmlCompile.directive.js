angular.module('partyABCreator.utils').directive('htmlCompile',[
    '$compile',
    function(
        $compile
    ) {
        return function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.htmlCompile);
                },
                function(value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        };
    }
]);
