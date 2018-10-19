(function() {
    angular.module('rfa.components')
        .directive('fileInput', function () {
            return {
                restrict: 'A',
                require: '?ngModel',
                scope: {
                    model: '=ngModel',
                    change: '&fileInputChange'
                },
                link: function (scope, element, attrs, ngModel) {
                    if (!ngModel) {
                        throw Error('no model');
                    }

                    if (attrs.fileTypes) {
                        ngModel.$parsers.unshift(setValidity);
                    }

                    scope.filename = '';

                    element.on('change', getFileLink);

                    var viewValue = {
                        name: scope.filename,
                        element: element
                    };

                    function getFileLink(event) {
                        if (event.target.value) {
                            var fileInputMatch =
                                event.target.value.match(/[^\/\\]+$/);

                            viewValue.name = fileInputMatch ? fileInputMatch[0] : '';
                            if (scope.filename === viewValue.name) {
                                scope.change();
                            }
                            scope.filename = viewValue.name;
                            ngModel.$setViewValue(angular.extend({}, viewValue));
                            ngModel.$render();
                            scope.$apply();
                        }
                    }

                    scope.$watch('filename', function (n) {
                        if (n && ngModel.$valid) {
                            scope.change();
                        }
                    });

                    function setValidity(viewValue) {
                        if (!viewValue) {
                            ngModel.$setValidity('extension', true);
                            return null;
                        } else if (viewValue.name.lastIndexOf('.') !== -1) {
                            var extension = viewValue.name
                                .substr(viewValue.name.lastIndexOf('.') + 1, viewValue.name.length)
                                .toLowerCase();

                            if (attrs.fileTypes.split(',').indexOf(extension) !== -1) {
                                ngModel.$setValidity('extension', true);
                                return viewValue;
                            } else {
                                ngModel.$setValidity('extension', false);
                                return undefined;
                            }
                        } else {
                            ngModel.$setValidity('extension', false);
                            return undefined;
                        }
                    }
                }
            };
        });
})();