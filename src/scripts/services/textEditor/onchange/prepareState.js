angular
    .module('app.services')
    .factory('TextEditorPrepareStateService', [
        function() {
            return function(st) {
                if(!st) {
                    return '';
                }
                return st.replace('&nbsp;', ' ')
                    .replace('&lt;', '<')
                    .replace('&gt;', '>')
                    .replace('&amp', '&')
                    .replace(/\<\!--.*?--\>/g, '');
            };
        }]);