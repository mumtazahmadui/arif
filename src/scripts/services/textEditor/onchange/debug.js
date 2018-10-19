angular
    .module('app.services')
    .factory('TextEditorDebugService', [
        function() {
            return function(isDebugMode) {
                this.setIsDebugMode = function(isDebug) {
                    isDebugMode = isDebug;
                    return this;
                };

                this.log = function(text) {
                    if (isDebugMode && console && console.log) {
//                        console.log(text)
                    }
                };
            };
        }]);