//ADDED: do not show placeholder if ngModel value is falsy and $element is focused

/*global angular*/
(function (undef) {
    var propName, needsShimByNodeName;

    propName = 'taiplaceholder';
    needsShimByNodeName = {};
    // not 'placeholder' because of content-editable crash
    angular.module("taiPlaceholderCustom", []).directive("taiplaceholder", [
        "$document",
        function ($document) {
            // Determine if we need to perform the visual shimming
            angular.forEach([ 'INPUT', 'TEXTAREA' ], function (val) {
                needsShimByNodeName[val] = $document[0].createElement(val)[propName] === undef;
            });

            /**
             * Determine if a given type (string) is a password field
             *
             * @param {string} type
             * @return {boolean}
             */
            function isPasswordType(type) {
                return type && type.toLowerCase() === "password";
            }

            return {
                require: "^ngModel",
                restrict: "A",
                link: function ($scope, $element, $attributes, $controller) {
                    var className, currentValue, text,
                        ATTR_INPUT_TYPE = 'data-placeholder-type';

                    text = $attributes[propName];
                    className = $attributes[propName + "Class"] || propName;

                    // This does the class toggling depending on if there
                    // is a value or not.
                    $scope.$watch($attributes.ngModel, function (newVal) {
                        currentValue = newVal || "";

                        if (!currentValue) {
                            $element.addClass(className);
                        } else {
                            $element.removeClass(className);
                        }
                    });

                    if (needsShimByNodeName[$element[0].nodeName]) {

                        //show placeholder in password input
                        if ( $element.val() === "" && $element[0].type === 'password' && changeType($element[0], 'text') ) {
                            $element[0].setAttribute(ATTR_INPUT_TYPE, 'password');
                        }

                        // These bound events handle user interaction
                        $element.bind("focus", function () {
                            //set input type back to original value if it was changed
                            var type = $element[0].getAttribute(ATTR_INPUT_TYPE);
                            if ( type ) {
                                $element[0].type = type;
                            }

                            if (currentValue === "") {
                                if ($element.val().length && $element.val() !== text) {
                                    currentValue = $element.val();
                                } else {
                                    // Remove placeholder text
                                    $element.val("");
                                }
                            }
                        });

                        $element.bind("blur", function () {
                            if ($element.val() === "") {

                                //show placeholder in password input
                                if ( $element[0].type === 'password' && changeType($element[0], 'text') ) {
                                    $element[0].setAttribute(ATTR_INPUT_TYPE, 'password');
                                }

                                // Add placeholder text
                                $element.val(text);
                            }
                        });

                        // This determines if we show placeholder text or not
                        // when there was a change detected on scope.
                        $controller.$formatters.unshift(function (val) {
                            // Do nothing if element is already focused
                            if($element[0] === document.activeElement ){
                                return val;
                            }

                            /* Do nothing on password fields, as they would
                             * be filled with asterisks.  Issue #2.
                             */
                            if (isPasswordType($element.prop("type"))) {
                                return val;
                            }

                            // Show placeholder text instead of empty value
                            return val || text;
                        });
                    }
                }
            };
        }
    ]);

    // Attempt to change the type property of an input element.
    function changeType( elem, type ) {
        try {
            elem.type = type;
            return true;
        } catch ( e ) {
            // You can't change input type in IE8 and below.
            return false;
        }
    }

}());
