(function() {
    angular.module('app.directives')
        .directive('textEditedField', textEditedField);

    function textEditedField() {
        return {
            restrict: 'E',
            replace: true,
            require: '^?ngModel',
            controller: textEditedFieldController,
            controllerAs: 'textEditedCtrl',
            transclude: true,
            templateUrl: '/views/directives/TextEditedField.html',
            link: function(scope, element, attrs, ngModelCtrl) {
                scope.inputField = element.find('input');
                scope.ngModelCtrl = ngModelCtrl;
                scope.type = attrs.type;
                if (attrs.match) {
                    scope.match = new RegExp(attrs.match, 'i');
                }
                if (ngModelCtrl) {
                    ngModelCtrl.$render = function() {
                        scope.editValue = ngModelCtrl.$modelValue;
                    };
                }
            }
        };
    }

    function textEditedFieldController($scope) {
        angular.extend($scope, {
            hovered: false,
            edited: false,
            showEdit: function() {
                $scope.hovered = true;
            },
            hideEdit: function() {
                $scope.hovered = false;
            },
            editMode: function() {
                $scope.edited = true;
                $scope.inputField.removeClass('hidden');
                $scope.inputField[0].focus();
                //TODO: please remove this shitcode
                var value = $scope.inputField.val();
                $scope.inputField.val('').val(value);
            },
            checkKeyValue: function(event) {
                var chr = String.fromCharCode(event.charCode);
                if (event.keyCode === 13) {
                    $scope.inputField.blur();
                    return;
                }
                if (event.charCode === 0) {
                    return;
                }
                if ($scope.match && !chr.match($scope.match)) {
                    event.preventDefault();
                }
            },
            blurInput: function() {
                $scope.changeNgValue();
                $scope.edited = false;
                $scope.inputField.addClass('hidden');
            },
            changeNgValue: function() {
                $scope.ngModelCtrl && $scope.ngModelCtrl.$setViewValue($scope.editValue);
            }
        });
    }
}());
