angular
    .module('app.services')
    .factory('IsHasClassService', [
        function() {
            return function(element, className) {
                if (element.className) {
                    var regexpStr = "(^|\\s)" + className + "(\\s|$)";
                    return new RegExp(regexpStr).test(element.className);
                }
                return  false;
            };
        }]);