(function () {
    angular.module('app.configs').factory('letterEditorOptions', function (defaultEditorOptions) {
        var options = angular.copy(defaultEditorOptions);
        options.plugins = 'pasteWord,lists,unEditable,placeholders,validate,removeTableIE9,newLineIE9,powerpaste,customtable,textcolor';
        options.toolbar1 = 'redo undo fontselect fontsizeselect forecolor backcolor bold italic underline  alignleft aligncenter alignright bullist numlist superscript subscript strikethrough lance customtable',
        options.checking_for_placeholders = false;
        options.powerpaste_word_import =  "merge";
        return options;
    });
})();