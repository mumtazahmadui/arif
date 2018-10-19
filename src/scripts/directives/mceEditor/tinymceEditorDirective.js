(function() {
    angular.module('app.directives')
    .directive('tinyEditor', function() {
        return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div ng-transclude class=\'tiny-editor\'></div>',
        link: function() {

        }
    };});
})();
