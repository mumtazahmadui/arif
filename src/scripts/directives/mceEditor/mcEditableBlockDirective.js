(function() {
    angular.module('app.directives')
        .directive('mceEditableBlock', mceEditableBlockDirective);

    function mceEditableBlockDirective() {
        return {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            scope: {
                model: '='
            },
            template: '<div class=\'tiny-mce tiny-editor\'></div>',
            link: function($scope, element, attr, ngModelCtrl) {
                if ($scope.model) {
                    element.html($scope.model.getData());
                    $scope.model.onSave(function() {
                        return element.clone();
                    });
                } else if (ngModelCtrl) {
                    element[0].setAttribute('id', Math.random().toString().replace('.', ''));
                    ngModelCtrl.$render = function() {
                        element.html(ngModelCtrl.$modelValue);
                    };

                    setTimeout(function() {
                        var editor = tinymce.get(element[0].id);
                        if (!editor)
                            editor = new tinymce.Editor(element[0].id, {}, tinymce.EditorManager);
                        editor.on('change', function() {
                            ngModelCtrl.$setViewValue(element.html());
                        });
                    });
                }
            }
        };
    }
})();
