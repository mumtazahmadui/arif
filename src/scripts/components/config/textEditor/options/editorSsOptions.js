(function () {
    angular.module('app.configs').factory('letterEditorOptionsSS', function () {
        return {
            inline: true,
            fixed_toolbar_container: '#tiny-toolbar-rfa-ss',
            plugins: 'noneditable,placeholders,validate,removeTableIE9,newLineIE9,lance,undeletable,powerpaste',
            lance: {
                notify: true
            },
            mode: "exact",
            lance: {
                annotations: {
                    permissions: {
                        delete: {
                            first: "none",// legal values: "none", "opener", "owner", "user", "any"
                            default: "none",
                            last: "owner"
                        },
                        edit: "owner",
                        resolve: {
                            first: "any",
                            default: "any",
                            last: "any"
                        }
                    },                            
                }
            },
            mode: "exact",
            extended_valid_elements: '*[*]',
            valid_elements: '*[*]',
            paste_retain_style_properties: 'all',
            powerpaste_word_import:  "merge",
            paste_webkit_styles: "all",
            mode: "exact",
            toolbar: 'lance',
            statusbar: false,
            menubar: false,
            height: 600,
            indent: false,
            validate: false,
            remove_linebreaks: true,
            remove_trailing_brs: true,
            noneditable_leave_contenteditable: false,
            autoresize_bottom_margin: '3'
        };
    });
})();