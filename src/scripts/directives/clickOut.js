// @ngInject
function clickOutside($document) {
    return {
        link: function(scope, element, attrs) {
            var bindFn = function(event) {
                var isChild = element.has(event.target).length > 0,
                    isSelf = element[0].contains(event.target),
                    isInside = isChild || isSelf;
                if (!isInside) {
                    scope.$apply(attrs.clickOutside);
                }
            };

            $document.unbind('click', bindFn);

            scope.$watch(attrs.handler, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    if (newValue) {
                        $document.bind('click', bindFn);
                    } else {
                        $document.unbind('click', bindFn);
                    }
                }
            });
        }
    };
}

angular
    .module('app.directives')
    .directive('clickOutside', clickOutside);
