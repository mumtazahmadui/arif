angular
    .module('app.services')
    .factory('TextEditorNormalizeHTMLService', [
        function() {
            return function($editor) {
                if ($editor.find('*').length) {
                    $editor.find('*:empty').not('p.linebreak, br, input, table, tr, td, li').remove();
                    $editor.find('div').removeAttr('style');
                    $editor[0].normalize();
                }
            };
        }]);