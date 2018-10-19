angular
    .module('app.controllers')
    .controller('AmendmentDraftTextEditorController', [
        '$scope',
        'ContenAdapter',
        'textEditorGetDataForEditor',
        'textEditorTypesConfig',
        'app.services.contentProvider',
        'validationRulesFactory',
        'partyABCreator',
        'AmendmentLetter',
        'CredentialsService',
        'contentHandler',
        '$stateParams',
        '$location',
        '$q',
        'modalsService',
        '$base64',
        function ($scope, ContenAdapter, textEditorGetDataForEditor, textEditorTypesConfig, ContentProvider, validationRulesFactory, partyABCreator, AmendmentLetter, CredentialsService, contentHandler, $stateParams, $location, $q, modalsService, $base64) {
            var onEditorDataLoaded = function (data) {
                $scope.name = data.name;
                $scope.editorData = data.editorData;
                console.log("++++++++++ ", data)
            };
            var init = function () {
                textEditorGetDataForEditor
                    .getAmendmentDraftWithoutContent(textEditorTypesConfig.draft)
                    .then(onEditorDataLoaded, onEditorDataLoaded);
            };
            var vm = this;
            var amendmentParams = {
                id: $stateParams.contentId
            };
            $scope.legend = [];
            $scope.accordian = {
                oneAtATime : true,
                groups : [
                    {
                      title: 'Dynamic Group Header - 1',
                      content: 'Dynamic Group Body - 1'
                    },
                    {
                      title: 'Dynamic Group Header - 2',
                      content: 'Dynamic Group Body - 2'
                    }
                  ],
                items : ['Item 1', 'Item 2', 'Item 3'],
                addItem : function() {
                    var newItemNo = $scope.items.length + 1;
                    $scope.items.push('Item ' + newItemNo);
                },
                status : {
                    isFirstOpen: true,
                    isFirstDisabled: false
                },
                content : "This is it!"
            };

            vm.loadingFirstTime = true;
            vm.editorInstance = '';

            vm.validationRules = validationRulesFactory.rules;
            vm.onValidation = validationRulesFactory.onValidation;
            var contentProvider = new ContentProvider(amendmentParams);

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
                fixed_toolbar_container: '#tiny-toolbar-rfa',
                //important!!pasteWord will work only before plugin paste
                plugins: 'noneditable,pasteWord,lists,unEditable,placeholders,validate,removeTableIE9,newLineIE9,lance,htmldiffer, customtable,textcolor,powerpaste',
                extended_valid_elements: 'input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|unselectable|class|id],' +
                    'table[align<center?left?right|bgcolor|border|cellpadding|cellspacing|class' + '|dir<ltr?rtl|frame|height|id|lang|onclick|ondblclick|onkeydown|onkeypress' + '|onkeyup|onmousedown|onmousemove|onmouseout|onmouseover|onmouseup|rules' + '|style|summary|title|width|unselectable],' + 'td[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class' + '|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick' + '|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove' + '|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup' + '|style|title|valign<baseline?bottom?middle?top|width|unselectable],' + 'th[abbr|align<center?char?justify?left?right|axis|bgcolor|char|charoff|class' + '|colspan|dir<ltr?rtl|headers|height|id|lang|nowrap<nowrap|onclick' + '|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove' + '|onmouseout|onmouseover|onmouseup|rowspan|scope<col?colgroup?row?rowgroup' + '|style|title|valign<baseline?bottom?middle?top|width|unselectable],',
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
                                edit: "owner"
                            },                            
                        },
                        statusCallback: function(obj) {
                            // obj contains the properties comment, annotation, status, owner (the Annotations object)
                            // in status, you should access only the fields canEdit, canResolve, canDelete
                            console.log("Get status for comment******** ******** *******", obj.comment);
                            obj.status.canEdit = false;
                        }
        
                    },
                valid_elements: '*[*]',
                // extended_valid_elements: "div[align<center?justify?left?right|class|dir<ltr?rtl|id|lang|onclick" + "|ondblclick|onkeydown|onkeypress|onkeyup|onmousedown|onmousemove" + "|onmouseout|onmouseover|onmouseup|style|title|unselectable]," + "input[accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value|unselectable],",
                paste_retain_style_properties: 'all',
                paste_webkit_styles: 'all',
                powerpaste_word_import:  "merge",
                toolbar1: 'redo undo fontselect fontsizeselect forecolor backcolor bold italic underline  alignleft aligncenter alignright bullist numlist superscript subscript strikethrough lance customtable save',
                statusbar: false,
                menubar: false,
                indent: false,
                height: 600,
                //Fix for bug in IE9 with deleting wrapper divs of placeholders
                validate: false,
                //Default value
                remove_linebreaks: true,
                //Fix for bug in Mozilla with backspace at the top of document
                remove_trailing_brs: true,
                noneditable_leave_contenteditable: true,
                autoresize_bottom_margin: '3',
                //configuration for validate plugin
                validation_rules: validationRulesFactory.rules,
                on_validation: validationRulesFactory.onValidation,

                //configuration for placeholders plugin
                placeholders: contentProvider.getPlaceholders()

            };

            $scope.notificationText = 'Loading';

            $scope.updateContent = function () {
                $scope.isShowLoader = true;
                contentProvider
                    .getContent()
                    .then(transformContent)
            };

            
            function transformContent(result) {
                var content = new ContenAdapter();
                vm.amendment = result;
                vm.editorInstance.disableHistory = true;
                //Command for building placeholders inside our draft
                content.setHTMLContent(vm.amendment.content);
                content.adapteeContent();
                vm.amendment.content = content.getJQContent().html();
                console.log("vm.amendment = > ", vm.amendment);
                vm.editorInstance.setContent(vm.amendment.content, {
                    format: 'raw'
                });
                vm.editorInstance.previousContent = vm.editorInstance.getContent({format: 'raw'});
                console.log("=0= 2 ", vm.editorInstance.previousContent);
                vm.editorInstance.execCommand('placeholdersInit');
                // vm.editorInstance.initialContent = vm.editorInstance.getContent({format: 'raw'});
                // vm.editorInstance.previousContent = vm.editorInstance.getContent({format: 'raw'});
                // angular.element("#accordion").accordion( "refresh" );

            }

            //Showing loader functionality
            function showingLoaderFunctionality() {
                var editorContent = '';
                var newContent = '';
                var div = null;
                if (vm.editorInstance) {

                    vm.editorInstance.addButton('save', {
                        title: 'Save Content',
                        image: 'images/save_comment.png',
                        onclick: function() {
                            // tinymce.activeEditor.setContent("<p>Fetching Default Content...</p><p><b>Done!</b> Please refresh.")
                            // resetContent();
                            vm.editorInstance.plugins.htmldiffer.trigger();    
                           console.log("++++++=+++++++++++++== BUTNONNNNNNN");
                        }
                    })
                    // vm.editorInstance.on("click", function(e) {
                    //     vm.editorInstance.plugins.lance._onEditorNodeClicked(e.target);
                    // });

                    vm.editorInstance.on('beforePlaceholdersInit', function () {
                        $scope.isShowLoader = true;
                    });
                    vm.editorInstance.on('afterPlaceholdersInit', function (editor) {
                        contentHandler.handleRFABeforeView(editor);

                        console.log("_+_+_+_+_+_+ CONTENT  UPDATED  _+_+_+_+_+_+_+_", editor)
                        if(vm.loadingFirstTime) {
                            vm.loadingFirstTime = false;
                            newContent = editor.getContent({format: 'raw'})

                            // div = document.createElement('addspanclass');
                            // div.innerHTML = newContent
                            
                            div = $('#'+editor.id)[0].getElementsByTagName('span');
                            
                            AmendmentLetter.getLegendItems('BS')
                            .success(function(data) {
                                $scope.legend = data
                            })
                            
                            // $(editor.id).hasChildNodes();
                            // console.log("currentContent =0=> ", div.innerHTML);
                            
                            for(var i = 0; i < div.length; i++){
                                var attr_ng_if = $(div[i]).attr('ng-if')
                                var attr_ng_bind = $(div[i]).attr('ng-bind')
                                var attr_ng_for = $(div[i]).attr('ng-for')
                                // if(div.childNodes[i].innerHTML = "&#65279;"){
                                if(!($(div[i]).hasClass()) && (typeof attr_ng_if !== undefined && attr_ng_if !== false) && (typeof attr_ng_bind !== undefined && attr_ng_bind !== false) && (typeof attr_ng_for !== undefined && attr_ng_for !== false)){
                                    //console.log("=-=-=-=-=->>>>>-=-=-=-=- ", $(div[i]))
                                    $(div[i]).addClass('initdiff');
                                }                                
                            }
                            div = $('#'+editor.id)[0].getElementsByTagName('em');
                            for(var i = 0; i < div.length; i++){
                                var attr_ng_if = $(div[i]).attr('ng-if')
                                var attr_ng_bind = $(div[i]).attr('ng-bind')
                                var attr_ng_for = $(div[i]).attr('ng-for')
                                // if(div.childNodes[i].innerHTML = "&#65279;"){
                                if(!($(div[i]).hasClass()) && (typeof attr_ng_if !== undefined && attr_ng_if !== false) && (typeof attr_ng_bind !== undefined && attr_ng_bind !== false) && (typeof attr_ng_for !== undefined && attr_ng_for !== false)){
                                    console.log("=-=-=-=-=->>>>>-=-=-=-=- ", $(div[i]))
                                    $(div[i]).addClass('initdiff');
                                }                                
                            }
                            div = $('#'+editor.id)[0].getElementsByTagName('sup');
                            for(var i = 0; i < div.length; i++){
                                var attr_ng_if = $(div[i]).attr('ng-if')
                                var attr_ng_bind = $(div[i]).attr('ng-bind')
                                var attr_ng_for = $(div[i]).attr('ng-for')
                                // if(div.childNodes[i].innerHTML = "&#65279;"){
                                if(!($(div[i]).hasClass()) && (typeof attr_ng_if !== undefined && attr_ng_if !== false) && (typeof attr_ng_bind !== undefined && attr_ng_bind !== false) && (typeof attr_ng_for !== undefined && attr_ng_for !== false)){
                                    console.log("=-=-=-=-=->>>>>-=-=-=-=- ", $(div[i]))
                                    $(div[i]).addClass('initdiff');
                                }                                
                            }
                            div = $('#'+editor.id)[0].getElementsByTagName('sub');
                            for(var i = 0; i < div.length; i++){
                                var attr_ng_if = $(div[i]).attr('ng-if')
                                var attr_ng_bind = $(div[i]).attr('ng-bind')
                                var attr_ng_for = $(div[i]).attr('ng-for')
                                // if(div.childNodes[i].innerHTML = "&#65279;"){
                                if(!($(div[i]).hasClass()) && (typeof attr_ng_if !== undefined && attr_ng_if !== false) && (typeof attr_ng_bind !== undefined && attr_ng_bind !== false) && (typeof attr_ng_for !== undefined && attr_ng_for !== false)){
                                    console.log("=-=-=-=-=->>>>>-=-=-=-=- ", $(div[i]))
                                    $(div[i]).addClass('initdiff');
                                }                                
                            }
                            div = $('#'+editor.id)[0].getElementsByTagName('strong');
                            for(var i = 0; i < div.length; i++){
                                var attr_ng_if = $(div[i]).attr('ng-if')
                                var attr_ng_bind = $(div[i]).attr('ng-bind')
                                var attr_ng_for = $(div[i]).attr('ng-for')
                                // if(div.childNodes[i].innerHTML = "&#65279;"){
                                if(!($(div[i]).hasClass()) && (typeof attr_ng_if !== undefined && attr_ng_if !== false) && (typeof attr_ng_bind !== undefined && attr_ng_bind !== false) && (typeof attr_ng_for !== undefined && attr_ng_for !== false)){
                                    console.log("=-=-=-=-=->>>>>-=-=-=-=- ", $(div[i]))
                                    $(div[i]).addClass('initdiff');
                                }                                
                            }


                            // console.log("=0=0=", div.innerHTML)
                            // newContent = div.innerHTML;
                            // newContent = newContent.replace(/<span /g, '<span class="init" ');
                            // newContent = editor.setContent(newContent, {format: 'raw'})
                            // editorContent = newContent;
                            // newContent = setupInitialContent(editorContent);
                            vm.editorInstance.initialContent = editor.getContent({format: 'raw'});
                            vm.editorInstance.previousContent = editor.getContent({format: 'raw'});

                            console.log("=0= 1 ", vm.editorInstance.previousContent);
                            // vm.editorInstance.setContent(newContent, {
                            //     format: 'raw'
                            // });
                        } else {
                            // editor.prevContent = editor.getContent({format: 'raw'});
                        }
                        $scope.isShowLoader = false;
                        $scope.$evalAsync();
                    });
                }
            }

            var editorWatcher = $scope.$watch(function () {
                return vm.editorInstance;
            }, function (editor) {
                if (editor) {
                    
                    vm.ui = new window["$LOOPINDEX$"].AnnotationsUI();
                    vm.ui.init(vm.uiOptions);
                    console.log("-=-=-=-=-=-=- initializeLancePlugin -=-=-=-=-=-=", vm.ui)
                    vm.ui.on(window["$LOOPINDEX$"].AnnotationsUI.Events.COMMENT_UI_BEFORE_COMMAND, function(evt) {
                        console.log("Intercepted command", evt, ",\nset evt.cancel to true to stop event processing");


                        if(evt.command === 'resolve'){
                            evt.cancel = true;
                        } else {
                            // Let user action be through
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

                    





                    // editor.on('ExecCommand', function (e) {
                    //     console.log("EXECUTE COMMAND 1 => ", e);                	
                    // });
                    // editor.on("lance::init", function(event) {
                    //     console.log("lance::init lance::init lance::init lance::init lance::init");
                    //     var lance = event.data.lance, // get a reference to the lance instance,
                    //         annotations = lance.getAnnotations(); // get a reference to the annotations manager created by the plugin
                    //     });
                    showingLoaderFunctionality();
                    editorWatcher();
                }
            });

            $scope.updateContent();

            if ('new' !== $stateParams.contentId) {
                init();
            }

            //TODO extract dependency on PartyBEdit
            $scope.partyBEdit = function () {
                var editorDataCopy = {};
                angular.copy($scope.editorData.data, editorDataCopy);
                editorDataCopy.content = vm.amendment.undecodedContent;
                var data = {
                    type: textEditorTypesConfig.draft,
                    data: editorDataCopy,
                    name: $scope.name
                };

                var prepareData = function (data) {
                    var RFA = [];
                    if (angular.isObject(data.data)) {
                        RFA.push(angular.copy(data.data));
                        RFA[0].partyBEntities = [];
                        if (angular.isArray(data.data.partyBEntities)) {
                            data.data.partyBEntities.forEach(function (v) {
                                RFA[0].partyBEntities.push(angular.copy(v));
                            });
                        }
                        RFA[0].name = data.name;
                    }
                    return RFA;
                };

                function partyBEdit(data) {
                    var flow = $scope.editorData.data.creationFlow === 'Sleeve' ? 'editSleeve' : 'editB';
                    var RFA = prepareData(data);

                    return partyABCreator.openModal({
                        RFA: RFA,
                        flow: flow
                    });
                }
                partyBEdit(data).then(function (data) {
                        if (!data || !data.preparedData) {
                            return $q.reject();
                        }
                        $scope.isShowLoader = true;

                        var newData = angular.copy(data.preparedData);
                        for (var i = 0; i < data.preparedData.length; i++) {
                            newData.data[i].modifiedBy = CredentialsService.userId();
                        }

                        return AmendmentLetter.update({
                            data: newData
                        });
                    })

                    .then(function () {
                        init();
                        vm.editorInstance.execCommand('placeholdersInit');
                    });
            };

            $scope.print = function () {
                window.print();
            };

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
                        console.log("99990 INS => ", $(ins[i]).prev().length,$(ins[i]), $(ins[i]).prev())
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
                    }  else {
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

            $scope.save = function () {
                if (!vm.amendment) {
                    return;
                }
                $scope.isShowLoader = true;
                contentHandler.handleRFABeforeSave(vm.editorInstance);
                var schema = vm.editorInstance.getDocumentSchema();

                vm.newPlaceholders = _.filter(schema.map, function (item) {
                    if (item.content) {
                        return item;
                    }
                });

                vm.amendment.content = schema.content;
                vm.amendment.comments = $scope.getCommentsMetadata();
                vm.amendment.changelog = $scope.getChangelogMetadata();

                $q.all([
                    vm.amendment.saveData(),
                    angular.forEach(vm.newPlaceholders, function (item) {
                        item.placeholder.saveData();
                    })
                ]).then(function () {
                    $scope.isShowLoader = false;
                    modalsService.alert({
                        'title': 'Letter Draft Saved ' + amendmentParams.id,
                        'class': 'modal-rfa'
                    }).result.then(function () {}, function () {
                        $location.path('/rfa/company/amendmentLetter');
                    });
                });
            };
        }
    ]);