(function() {
    angular.module('app.configs')
        .constant('defaultEditorOptions', {
            inline: true,
            fixed_toolbar_container: '#tiny-toolbar',
            //important!!pasteWord will work only before plugin paste
            plugins: 'pasteWord,paste,lists,placeholders,validate,removeTableIE9,newLineIE9,powerpaste',
            lance: {
				annotations: {
					permissions: {
						"delete": "owner"
					}
				}
			},
            extended_valid_elements: "input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|unselectable|class|id]," +
            "table[align<center?left?right|bgcolor|border|cellpadding|cellspacing|class" + "|dir<ltr?rtl|frame|height|id|lang|onclick|ondblclick|onkeydown|onkeypress" + "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|rules" + "|style|summary|title|width|unselectable]," + "td[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class" + "|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick" + "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" + "|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup" + "|style|title|valign<baseline?bottom?middle?top|width|unselectable]," + "th[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class" + "|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick" + "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" + "|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup" + "|style|title|valign<baseline?bottom?middle?top|width|unselectable],annotation",
            valid_elements: '*[*]',
            mode: "exact",
            // extended_valid_elements: "div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick" + "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" + "|onmouseout|onmouseover|onmouseup|style|title|unselectable]," + "input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|unselectable],",
            paste_retain_style_properties: 'all',
            paste_webkit_styles: "all",
            toolbar: 'redo | undo | fontselect | fontsizeselect | bold | italic | underline | alignleft | aligncenter | alignright | bullist | numlist | superscript | subscript | strikethrough |lance,customtable',
            statusbar: false,
            menubar: false,
            height: 600,
            indent: false,
            //Fix for bug in IE9 with deleting wrapper divs of placeholders
            validate: false,
            //Default value
            remove_linebreaks: true,
            //Fix for bug in Mozilla with backspace at the top of document
            remove_trailing_brs: true,
            noneditable_leave_contenteditable: true,
            autoresize_bottom_margin: '3'
        });
})();
