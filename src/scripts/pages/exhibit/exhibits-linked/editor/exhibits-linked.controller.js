(function() {
    angular.module('rfa.exhibits-linked')
        .controller('exhibitsLinkedController', exhibitsLinkedController);

    function exhibitsLinkedController( 
        $scope,
        ExhibitsLinked,
        contentHandler,
        $stateParams,
        AmendmentLetter,
        $q,
        $location,
        $base64)
    {
 /* jshint validthis: true */
        var vm = this;

        vm.isNew = $stateParams.contentId === 'new';

        vm.editorInstance = '';

        vm.users = [];

            $sidebar = $(".sidebar"), // the div containing the sidebar which contains the various ui elements that aren't part of the editor
			vm.today = Math.floor((new Date().setHours(0)) / 1000),
			vm.day = 24 * 3600,
			vm.hour = 3600,
			vm.minute = 60,
			vm.ui = null,
			vm.nextEditorId = 1,
			vm.editorStates = {},
			vm.editorId = null,
			vm.version = (location.search.match(/(\d\.\d)/) || ["4.4"])[0],
			vm._options,
			$select = $("#users-select"); // the select box with the user names

            $sidebar = $(".sidebar"), // the div containing the sidebar which contains the various ui elements that aren't part of the editor

            vm.clone = function(o) {
                return $.extend({}, o);
            }

            vm.uiOptions = {
                owner: null,
                templateClass: "lance-tmpl",
                ui: $(window),
                container: $(".annotations"), // the DOM node in which the annotations ui will construct its elements
                annotationTemplate: $(".lance-tmpl.annotation-ui"), // an html node that contains the template of a full comments thread (annotation)
                // this is the outer ui, the html for individual comments is next
                commentTemplate: $(".lance-tmpl.comment-ui") // an html node that contains the template for an individual comment within an annotation
            };


        vm.editorOptions = {
            inline: true,
            fixed_toolbar_container: '#tiny-toolbar-ex',
            //important!!pasteWord will work only before plugin paste
            plugins: 'pasteWord,lists,placeholders,validate,removeTableIE9,newLineIE9,powerpaste,htmldiffer,lance,customtable,textcolor',
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
                            first: "none",
                            default: "none",
                            last: "opener"
                        }
                    },                            
                }
            },
            extended_valid_elements: "input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|unselectable|class|id]," +
            "table[align<center?left?right|bgcolor|border|cellpadding|cellspacing|class" + "|dir<ltr?rtl|frame|height|id|lang|onclick|ondblclick|onkeydown|onkeypress" + "|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|rules" + "|style|summary|title|width|unselectable]," + "td[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class" + "|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick" + "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" + "|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup" + "|style|title|valign<baseline?bottom?middle?top|width|unselectable]," + "th[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class" + "|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick" + "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" + "|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup" + "|style|title|valign<baseline?bottom?middle?top|width|unselectable],annotation",
            valid_elements: '*[*]',
            mode: "exact",
            // extended_valid_elements: "div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick" + "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" + "|onmouseout|onmouseover|onmouseup|style|title|unselectable]," + "input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|unselectable],",
            paste_retain_style_properties: 'all',
            paste_webkit_styles: "all",
            toolbar: 'redo undo fontselect fontsizeselect forecolor backcolor bold italic underline alignleft aligncenter alignright bullist numlist superscript subscript strikethrough lance, customtable save',
            statusbar: false,
            powerpaste_word_import:  "merge",
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
        };

        vm.save = save;

        $scope.name = '';

        $scope.letterId = $stateParams.contentId;

        $scope.notificationText = 'Loading...';

        $scope.isShowLoader = false;

        $scope.invalid = false;

        angular.extend(this, {         
            getContentTemplate: function() {
                var html = this.editorInstance.getContent({format: 'raw'});
                var arrows = /value="< ([a-zA-Z0-9\s\[\]]*) >"/g;
                html = html.replace(arrows, 'value="$1"');
                return html;
            }
        });

        var editorWatcher = $scope.$watch(function() {
            return vm.editorInstance;
        }, function(editor) {
            if (editor) {
                editor.addButton('save', {
                    title: 'Save Content',
                    image: 'images/save_comment.png',
                    onclick: function() {
                        // tinymce.activeEditor.setContent("<p>Fetching Default Content...</p><p><b>Done!</b> Please refresh.")
                        // resetContent();
                        editor.plugins.htmldiffer.trigger();    
                       console.log("++++++=+++++++++++++== BUTNONNNNNNN");
                    }
                })

                AmendmentLetter.getLegendItems('BS')
                .success(function(data) {
                    $scope.legend = data
                })
                vm.ui = new window["$LOOPINDEX$"].AnnotationsUI();
                vm.ui.init(vm.uiOptions);
                vm.ui.on(window["$LOOPINDEX$"].AnnotationsUI.Events.COMMENT_UI_BEFORE_COMMAND, function(evt) {
                    console.log("Intercepted command", evt, ",\nset evt.cancel to true to stop event processing");
                    // evt.event.preventDefault();
                    if(evt.command === 'resolve' && (!window.permissions.includes('ss.rfa.legal') && !window.permissions.includes('rfa.admin'))){
                        evt.cancel = true;
                        // evt.event.preventDefault();
                    }
                });


                vm.ui.on(window["$LOOPINDEX$"].AnnotationsUI.Events.COMMENT_UI_AFTER_COMMAND, function(evt) {
                    console.log("command", evt, "executed,\nhere you can provide your own post-processing");
                    if(evt.command === 'resolve'){
                        console.log("asdsa", $("[data-comment-id='" + evt + "']"))
                        
                        $("[data-annotation-id='" + evt.annotationId + "']").addClass('comment-resolved');
                    }
                });

                vm.tmpl = jQuery(".editor-tmpl.lance-tmpl").clone(false),
                    vm.tmpl.removeClass("editor-tmpl lance-tmpl").addClass("editor-tab");
                    vm.tmpl.find("textarea").attr({
                        id: editor.id,
                        name: editor.id
                    })
                    jQuery(".editor-tabs").prepend(vm.tmpl);

                    vm.lance = editor.plugins.lance; // keep a reference to the lance instance,
                    vm.annotations = vm.lance.getAnnotations(); // get a reference to the annotations manager created by the plugin
                    vm.ui.setOwner(null);
                    vm.ui.setOwner(vm.annotations);
                    console.log("^^%%$$%%^^%%$$%%^^",vm.annotations)
                    vm.annotations.addUsers([{
                        id : window.user_id.toString(),
                        name : window.userName,
                        picture : "avatars/frink.png"
                    }]);
                    vm.lance.getAnnotations().setUserId(window.user_id.toString());
                                       
                    
                    console.log(window["$LOOPINDEX$"].Annotations.Events)
                    vm.annotations.on(window["$LOOPINDEX$"].Annotations.Events.COMMENT_ADDED, function(createdEvent) {
                        console.log("COMMENT_ADDED =>>>>> ", createdEvent);
                    });
                    vm.annotations.on(window["$LOOPINDEX$"].Annotations.Events.COMMENT_SELECTED, function(createdEvent) {
                        console.log("COMMENT_SELECTED =>>>>> ", createdEvent);
                    });
                    
                    vm.annotations.on(window["$LOOPINDEX$"].Annotations.Events.ANNOTATION_CREATED, function(createdEvent) {
                        console.log("ANNOTATION CREATED =>>>>> ", createdEvent);
                    });

                    vm.annotations.on(window["$LOOPINDEX$"].Annotations.Events.ANNOTATION_CHANGED, function(changedEvent) {
                        console.log("ANNOTATION CHANGED =>>>>> ", changedEvent);
                    });
                    
                $q.when(setContent()).then(function() {
                    vm.editorInstance.execCommand('mceFocus', false);
                    vm.editorInstance.disableHistory = false;
                });
                //remove this wathcher by calling it directly
                editorWatcher();
            }
        });

        function setContent() {
            if (!vm.isNew) {
                $scope.isShowLoader = true;
                ExhibitsLinked.get().then(function(data) {
                $scope.isShowLoader = false;
                    $scope.contentId = $stateParams.contentId;
                    if (data && data.editorData) {

                        $scope.data = data.editorData.data;
                        $scope.name = data.editorData.name || $scope.letterId;
                        $scope.tableData = data.editorData.tableData;
                        $scope.indexOfLastEditableColumn = data.editorData.indexOfLastEditableColumn;
                        var cnt = contentHandler.handleBeforeView(data.editorData.content);
                        vm.editorInstance.setContent(cnt, {format: 'raw'});
                        vm.editorInstance.previousContent = vm.editorInstance.getContent({format: 'raw'});
                    }
            });
            } {
                vm.editorInstance.undoManager.add();                
            }
        }

        $scope.getCommentsMetadata = function () {
            var metadata = [];
            var annotation;
            var annotations = $('#'+vm.editorInstance.id)[0].getElementsByTagName('annotation');
            for (var i = 0; i < annotations.length; i++){
                annotation = JSON.parse(decodeURIComponent($(annotations[i]).attr('data-ant')));
                annotation.attributes = null;
                metadata.push(annotation);
            }    
            return metadata;
        }

        $scope.getChangelogMetadata = function () {
            var changelog = [];
            var ins = $('#'+vm.editorInstance.id)[0].getElementsByTagName('ins');
            var del = $('#'+vm.editorInstance.id)[0].getElementsByTagName('del');
            for(var i = 0;i < ins.length; i++) {
                if ($(ins[i])[0].innerHTML != "﻿") {
                    console.log("9999 => ", $(ins[i]), $(ins[i])[0].innerHTML)
                    if($(ins[i]).prev().length && $(ins[i]).prev().get(0).tagName === 'DEL') {
                        console.log("999901 INS => ", $(ins[i]).prev())
                        changelog.push({
                            "action" : "MODIFIED",
                            "email" : $(ins[i]).attr('title').substring(
                                        $(ins[i]).attr('title').lastIndexOf("by: ") + 4, 
                                        $(ins[i]).attr('title').lastIndexOf(" on ")
                                            ),
                            "actiondate" : Date.now() / 1000 | 0,
                            "previous" : "",
                            "current" : $base64.encode(encodeURIComponent($(ins[i])[0].outerHTML))
                        })
                    } else {
                        changelog.push({
                            "action" : "ADD",
                            "email" : $(ins[i]).attr('title').substring(
                                        $(ins[i]).attr('title').lastIndexOf("by: ") + 4, 
                                        $(ins[i]).attr('title').lastIndexOf(" on ")
                                            ),
                            "actiondate" : Date.now() / 1000 | 0,
                            "previous" : "",
                            "current" : $base64.encode(encodeURIComponent($(ins[i])[0].outerHTML))
                        })
                    }
                    
                }
            }

            for(var i = 0;i < del.length; i++) {
                if($(del[i]).next().length && $(del[i]).next().get(0).tagName === 'INS') {
                } else {
                    changelog.push({
                        "action" : "DELETE",
                        "email" : $(del[i]).attr('title').substring(
                                    $(del[i]).attr('title').lastIndexOf("by: ") + 4, 
                                    $(del[i]).attr('title').lastIndexOf(" on ")
                                        ),
                        "actiondate" : Date.now() / 1000 | 0,
                        "previous" : $base64.encode(encodeURIComponent($(del[i])[0].outerHTML)),
                        "current" : ""
                    })
                }
                
            }
            return changelog;
        }

        function save() {
            $scope.invalid = !$scope.exhLinkedForm.$valid;
            if (!$scope.invalid) {
                var savedTemplate = contentHandler.handleBeforeSave(vm.editorInstance);
                var preparedData = {};
                var data = {
                    data: {
                        content: {
                            name: $scope.name
                        },
                        contentId: $stateParams.contentId,
                        data: {
                            name: $scope.name
                        },
                        preparedData: preparedData,
                        selectControlColumn: false,
                        tableData: $scope.tableData,
                        template: savedTemplate,
                        type: 'linked',
                    },
                    amendmentId: $scope.letterId,
                    exhibitId: $stateParams.exhibitId,
                    commentlog: $scope.getCommentsMetadata(),
                    changelog: $scope.getChangelogMetadata(),
                    partyType: "BS"
                };
                $scope.notificationText = 'Saving...';
                $scope.isShowLoader = true;
                ExhibitsLinked.save(data).finally(function () {
                    $scope.isShowLoader = false;
                    $location.path('/rfa/company/amendmentLetter');
                });
            }
        }
    }
})();
