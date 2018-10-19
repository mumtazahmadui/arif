/**
 * RFA Review Editor
 * ### Used for:
 *
 *     RFA
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */
(function() {
    // @ngInject

    rfaReviewEditorController.$inject = ["toastr", "$scope", "CredentialsService", "AmendmentLetter", "$stateParams", "$base64", "$location", "replaceHoldersConfig", "ReplaceHoldersFactory", "queueAjaxService", "$window", "documentsService", "letterEditorOptionsSS", "$q", "$compile", "$http", "modalsService"];
    angular.module('app.controllers')
        .controller('RFAReviewEditorController', rfaReviewEditorController);

    function rfaReviewEditorController(
        toastr, $scope, CredentialsService, AmendmentLetter, $stateParams, $base64, $location, replaceHoldersConfig,
        ReplaceHoldersFactory, queueAjaxService, $window, documentsService, letterEditorOptionsSS, $q, $compile, $http,
        modalsService
    ) {
        var vm = this;
        $scope.translationComplete = false;
        $scope.start_indexes = [];
        $scope.end_indexes = [];
        $scope.contentChunks = [];
        $scope.contentPlaceholders = [];
        vm.editorInstance = '';
        vm.editorOptions = letterEditorOptionsSS;
        vm.editingAllowed = false;
        vm.changelog = [];

        $scope.PDFLinkWet = documentsService.openFileForWSignConsolidated({
            amendmentId: $stateParams.contentId
        });

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

        /* jshint validthis: true */
        var replaceHoldersService = new ReplaceHoldersFactory();
        $scope.queueService = new queueAjaxService();
        replaceHoldersService.setConfig(replaceHoldersConfig);
        var permissions = ['ss.read', 'ss.view', 'ss.rfa', 'ss.rfa.signatory', 'ss.req.perm', 'ss.req.perm'];
        $scope.loaded = false;
        $scope.agreed = false;
        $scope.notificationText = 'Loading...';
        $scope.errorText = '';
        $scope.validate = false;
        $scope.data = {};
        $scope.deletedComments = [];
        $scope.placeHolders = []
        $scope.isPartialyCompleted = false;
        $scope.compiledContent = false;
        $scope.BSplaceholders = {
            'date_pinned': '<input type="text" id="date_pinned" class="place-holder disabled display-none">',
            'partyARelations': '<input id="partyARelations" unselectable="on" readonly="readonly" class="party-a-relations" value="< Party A Relation >">',
            'partyBAddition': '<input id="partyBAddition" unselectable="on" readonly="readonly" class="party-b-additional-table" value="< Party B Addition >">',
            'sleeveAddition': '<input id="sleeveAddition" readonly="" class="party-b-additional-sleeve-table" value="< Sleeve Addition >">',
            'partyBRemoval': '<input id="partyBRemoval" unselectable="on" readonly="readonly" class="party-b-removal-table" value="< Party B Removal >">',
            'sleeveRemoval': '<input id="sleeveRemoval" readonly="" class="party-b-removal-sleeve-table" value="< Sleeve Removal >">',
            'exhibit_value_change': '<input id="exhibit_value_change" unselectable="on" readonly="readonly" class="party-b-exhibit-value-change" value="< Exhibit Value Change >">',
            'fund_name_change': '<input id="fund_name_change" unselectable="on" readonly="readonly" class="party-b-fund-name-change" value="< Fund Name Change >">',
            'bs_signature1' : '<input id="bs_signature[1]" unselectable="on" readonly="readonly" class="signature" value="< Buyside Signature[1] >" index="1">',
            'ss_signature1' : '<input id="ss_signature[1]" unselectable="on" readonly="readonly" class="signature" value="< Sellside Signature[1] >" index="1">',
            'bs_signature2' : '<input id="bs_signature[2]" unselectable="on" readonly="readonly" class="signature" value="< Buyside Signature[2] >" index="2">',
            'ss_signature2' : '<input id="ss_signature[2]" unselectable="on" readonly="readonly" class="signature" value="< Sellside Signature[2] >" index="2">'
        } 

        var HtmlRenderWatcher = $scope.$watch(function(value) {
            return $scope.htmlRender;
        },function(value){
            if (!value) {
                return;
            }
            
            // var t = null;
            // var annotations = document.createElement('dummy_content');
            // annotations.innerHTML = value
            // annotation = annotations.getElementsByTagName('annotations');
            // for(var i = 0; i < annotation.length; i++){
            //     t = annotation[i].clone()
            //     annotation[i].parentNode.parentNode.append(t)
            //     annotation[i].remove()
            // }
            // value = annotations.innerHTML;
            console.log("APPENDING CONTENT [BEFORE] 30sep => ", value);
            $scope.placeHolders.push({
                'partyARelations' : $(value).find('[id=partyARelations]')
            })
            $scope.placeHolders.push({
                'date_pinned' : $(value).find('[id=date_pinned]')
            })
            $scope.placeHolders.push({
                'partyBAddition' : $(value).find('[id=partyBAddition]')
            })
            $scope.placeHolders.push({
                'sleeveAddition' : $(value).find('[id=sleeveAddition]')
            })
            $scope.placeHolders.push({
                'partyBRemoval' : $(value).find('[id=partyBRemoval]')
            })
            $scope.placeHolders.push({
                'sleeveRemoval' : $(value).find('[id=sleeveRemoval]')
            })
            $scope.placeHolders.push({
                'exhibit_value_change' : $(value).find('[id=exhibit_value_change]')
            })
            $scope.placeHolders.push({
                'fund_name_change' : $(value).find('[id=fund_name_change]')
            })
            $scope.placeHolders.push({
                'bs_signature[1]' : $(value).find('#bs_signature[1]')
            })
            $scope.placeHolders.push({
                'ss_signature[1]' : $(value).find('#ss_signature[1]')
            })
            $scope.placeHolders.push({
                'bs_signature[2]' : $(value).find('#bs_signature[2]')
            })
            $scope.placeHolders.push({
                'ss_signature[2]' : $(value).find('#ss_signature[2]')
            })
            
            

            
            console.log("30sep ", $scope.placeHolders)
            var content = $compile(value)($scope);
            // scope.appendEditorContent(content);
            
            var sd = angular.element("#letterBody");
            sd.html(content);
    
            console.log("APPENDING CONTENT [AFTER] 30sep => ", $(content)[0]);
            console.log("single 30sep => ", document.getElementById('bs_signature[1]'));
            HtmlRenderWatcher();
        });

        $scope.initializeLancePlugin = function() {
            var elems = document.body.getElementsByTagName("annotation");
            console.log('556 ', elems);
            for(var i = 0; i < elems.length; i++){
                console.log('5566 ', elems[i]);
                $(elems[i]).wrap('<span></span>')
            }
            
            vm.ui = new window["$LOOPINDEX$"].AnnotationsUI();
                    vm.ui.init(vm.uiOptions);
                    console.log("-=-=-=-=-=-=- initializeLancePlugin -=-=-=-=-=-=", vm.ui)

                    vm.ui.on(window["$LOOPINDEX$"].AnnotationsUI.Events.COMMENT_UI_BEFORE_COMMAND, function(evt) {
                        console.log("Intercepted command", evt, ",\nset evt.cancel to true to stop event processing");
                        // evt.event.preventDefault();
                        if(evt.command !== 'resolve' || CredentialsService.hasPermission('ss.rfa.legal') || CredentialsService.hasPermission('ss.rfa.admin')){
                            // Let user resolve the comment
                            // var tt = vm.ui.getAnnotationById(evt.annotationId)
                            console.log("10OCT 0 =>", vm.annotations.getAnnotationById(evt.annotationId))
                        } else {
                            evt.cancel = true;
                        }
                    });


                    vm.ui.on(window["$LOOPINDEX$"].AnnotationsUI.Events.COMMENT_UI_AFTER_COMMAND, function(evt) {
                        console.log("command", evt, "executed,\nhere you can provide your own post-processing");
                        if(evt.command === 'resolve'){
                            console.log("asdsa", $("[data-comment-id='" + evt.commentId + "']"))
                            
                            $("[data-comment-id='" + evt.commentId + "']").addClass('comment-resolved');
                        }
                    });

                    vm.tmpl = jQuery(".editor-tmpl.lance-tmpl").clone(false),
                    vm.tmpl.removeClass("editor-tmpl lance-tmpl").addClass("editor-tab");
                    vm.tmpl.find("textarea").attr({
                        id: vm.editorInstance.id,
                        name: vm.editorInstance.id
                    })
                    jQuery(".editor-tabs").prepend(vm.tmpl);

                    vm.lance = vm.editorInstance.plugins.lance; // keep a reference to the lance instance,
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
        }

        $scope.replacePlaceholders = function() {
            var sign_placeholder = null;
            return new Promise(function(resolve) {
                $(content).find('[id=partyARelations]').replaceWith($($scope.BSplaceholders.partyARelations))
                $(content).find('[id=partyBAddition]').replaceWith($($scope.BSplaceholders.partyBAddition))
                $(content).find('[id=sleeveAddition]').replaceWith($($scope.BSplaceholders.sleeveAddition))
                $(content).find('[id=partyBRemoval]').replaceWith($($scope.BSplaceholders.partyBRemoval))
                $(content).find('[id=sleeveRemoval]').replaceWith($($scope.BSplaceholders.sleeveRemoval))
                $(content).find('[id=exhibit_value_change]').replaceWith($($scope.BSplaceholders.exhibit_value_change))
                $(content).find('[id=fund_name_change]').replaceWith($($scope.BSplaceholders.fund_name_change))
                if(document.getElementById('bs_signature[1]') !== null){
                    sign_placeholder = document.getElementById('bs_signature[1]')
                    $(sign_placeholder).replaceWith($($scope.BSplaceholders.bs_signature1))
                }
                if(document.getElementById('bs_signature[2]') !== null){
                    sign_placeholder = document.getElementById('bs_signature[2]')
                    $(sign_placeholder).replaceWith($($scope.BSplaceholders.bs_signature2))
                    
                }
                if(document.getElementById('ss_signature[1]') !== null){
                    sign_placeholder = document.getElementById('ss_signature[1]')
                    $(sign_placeholder).replaceWith($($scope.BSplaceholders.ss_signature1))
                }
                if(document.getElementById('bs_signature[2]') !== null){
                    sign_placeholder = document.getElementById('ss_signature[2]')
                    $(sign_placeholder).replaceWith($($scope.BSplaceholders.ss_signature2))
                }
                resolve($('#letterBody')[0].innerHTML);
            })
            
        }

        var editorWatcher = $scope.$watch(function() {
            return vm.editorInstance;
        }, function(editor) {
            if (editor) {
                

                $q.when(setContent()).then(function() {
                    AmendmentLetter.getLegendItems('SS')
                    .success(function(data) {
                        $scope.legend = data
                    })

                    vm.editorInstance.on('keydown', function(event) {
                        if(!vm.editingAllowed || event.target.localName !== "textarea" ) {
                            console.log("30octt => ", event, event.keyCode)
                            event.preventDefault();
                            return false;
                        }
                    })


                    vm.editorInstance.on('click', function(event) {
                        console.log("click event => ", event);
                        if (event.target.localName === "textarea" || event.target.localName === "annotation"){
                            if(event.target.localName === "textarea" || event.target.localName === "annotation" || event.target.parentElement.localName == "ins"){
                                $(event.target).focus();
                                vm.editingAllowed = true;
                            }
                            console.log(":: ALLOWED ::");
                            
                        } else {
                            vm.editingAllowed = false;
                            console.log(":: NOT ALLOWED ::");
                            event.preventDefault();
                            return false;
                        }
                    })                    

                    vm.editorInstance.on('ExecCommand', function (e) {
                        event.preventDefault();
                        var div = document.createElement('div');
                        div.innerHTML = e.value.trim();
                        
                        console.log("EXECUTE COMMAND SS => ", e, div.firstChild.getAttribute("data-annotation-id"));
                        
                        // let sas= vm.ui.getAnnotationNodeForId(div.firstChild.getAttribute("data-annotation-id"))

                        var tt = vm.annotations.getAnnotationById(div.firstChild.getAttribute("data-annotation-id"));

                        console.log("sassassassassas => ", tt);

                        
                    });
                    

                    vm.editorInstance.execCommand('mceFocus', false);
                    vm.editorInstance.disableHistory = false;
                    // $scope.initializeLancePlugin();
                });
                //remove this wathcher by calling it directly
                editorWatcher();
            }
        });

        function drawPdf(pdf, signatures, selector, type) {
            var pagesCount = pdf.numPages;
            $scope['totalPages' + type] = pagesCount;
            for (var i = 0; i < pagesCount; i++) {
                showPage(pdf, i + 1, selector);
            }
            ;

            for (i = 0; i < parseInt(signatures.data.ss_placeholder_count); i++) {
                vm.signaturesPH.push(false);
            }

            $('#' + selector + ' canvas').css('zoom', $scope.minZoom);
            $timeout(function () {
                var canvas = $('canvas'),
                    canvasFirst = canvas.first(),
                    canvasCount = canvas.length,
                    canvasZoom = canvasFirst.css('zoom') * 1,
                    canvasWidth = canvasFirst.width(),
                    canvasHeight = canvasFirst.height(),
                    pdfHeight = canvasZoom * canvasHeight * canvasCount;
                // on long doc, cant accept and needed x-scroll || CPM-15807
                if ((pdfHeight < 400 && canvasZoom < 0.6) ||
                    canvasWidth > $('#' + selector).width()) {
                    canvas.css('zoom', '1');
                    $('#' + selector).css('overflow-x', 'auto');
                }
                $scope.loaded = true;
            }, 100);

            if (vm.data.name)
                showPreview(type);

        }
        /*
        $http.get($scope.PDFLinkWet).then(function (response) {
            //console.log(response.data);
            if(!response.data) {
                return;
            }
            // PDF wet
            $q.all([
                PDFJS.getDocument($scope.PDFLinkWet),
                AmendmentLetter.getAmendmentSignaturePlaceholers({amendmentLetterId: $stateParams.amendmentId})
            ]).then(function (results) {
                drawPdf(results[0], results[1], 'pdf-holder-wet', 'wet');
            }, function() {
                showRealPDFWSignConsolidated();
            });
        });
        */


        $('#pdf-holder-wet').on('scroll', function () {
            if ($('#pdf-holder-wet')[0].scrollHeight - 50 <= $('#pdf-holder-wet').height() + $('#pdf-holder-wet').scrollTop()) {
                $scope.$apply(function () {
                    $scope.docsReadedWet = true;
                });
            }
        });

        function showRealPDFWSignConsolidated() {
            //console.log('showRealPDFWSignConsolidated')
            AmendmentLetter.getAmendmentSignaturePlaceholers({amendmentLetterId: $stateParams.contentId}).then(function (signatures) {
                for (var i = 0; i < parseInt(signatures.data.bs_placeholder_count); i++) {
                    vm.signaturesPH.push(false);
                }
            });
            $scope.docsReaded = true;
            $scope.errorPdf = true;
            $('#pdf-holder-wet').html('<iframe src=\'' + $scope.PDFLinkWet + '#view=FitH\' frameborder=\'0\' height=\'600\' width=\'100%\' scrolling=\'no\' style=\'overflow:hidden\'></iframe>');
            $scope.loaded = true;
        }

        function setContent() {
            vm.editorInstance.setContent('<html-render id="letterBody"></html-render><div id="fake-exhibit-wrapper"></div>', {format: 'raw'});
        }

        $scope.$watch(function () {
            return $scope.queueService.isRun;
        }, function (newVal) {
            var fakeExhibitWrapper = angular.element("#fake-exhibit-wrapper");
            var exhibitTable = angular.element("#exhibit-table").clone()  
            $scope.loaded = !newVal;
            if(!$scope.queueService.isRun && $scope.compiledContent) {
                exhibitTable.css('display', 'block')                
                fakeExhibitWrapper.html(exhibitTable[0].outerHTML);
                bindAcceptRejectEventsModified()
                bindAcceptRejectEvents();
                $scope.initializeLancePlugin()
                console.log("Content Loaded ?????????????")
            }
            if($scope.queueService.isRun) {
                $scope.compiledContent = true;
            }
            
            
        });

        $scope.$on('$viewContentLoaded', load);

        // Autofix Comment Area Size
        $scope.$watch(function() {
            $('textarea').each(function() {
                var element = $(this);
                element.innerHeight(element.prop('scrollHeight'));
            });
        });

        $scope.isSellSideUser = function() {
            for (var i = 0, l = permissions.length; i < l ; i++) {
                if (CredentialsService.hasPermission(permissions[i])) {
                    return true;
                }
            }
            return false;
        };

        $scope.getCommentsMetadata = function (annotations) {
            var metadata = [];
            var annotation = null;
            
                for (var i = 0; i < annotations.length; i++){
                    annotation = JSON.parse(decodeURIComponent($(annotations[i]).attr('data-ant')));
                    console.log("10OCT => ", $(annotations[i]));
                    annotation.resolved = vm.annotations.getAnnotationById(annotation.id).isResolved();
                    annotation.attributes = null;
                    metadata.push(annotation);
                }
                annotations = $('#exhibitText')[0].getElementsByTagName('annotation');
                for (var i = 0; i < annotations.length; i++){
                    annotation = JSON.parse(decodeURIComponent($(annotations[i]).attr('data-ant')));
                    annotation.resolved = vm.annotations.getAnnotationById(annotation.id).isResolved();
                    annotation.attributes = null;
                    metadata.push(annotation);
                } 
                return metadata;
        }

        $scope.getContentToSave = function() {
            
            $scope.replacePlaceholders()
            $('#letterBody')[0].innerHTML.replace(/class="ng-scope"/g, '')
            return $base64.encode(encodeURIComponent($('#letterBody')[0].innerHTML))
            
        }

        $scope.save = function() {
            var annotationsLT = $('#letterBody')[0].getElementsByTagName('annotation');
            var annotationsET = $('#exhibitText')[0].getElementsByTagName('annotation');
            var exhibitContent = $('#exhibitText')[0].innerHTML
            $scope.errorText = '';
            $scope.validate = true;
            $scope.$broadcast('isValid');
            if (!$scope.validate) {
                showError();
                return;
            }
            // $scope.getContentToSave();
            // var sss = $scope.getContentToSave();
            // console.log("1oct => ", sss)

            AmendmentLetter
            .saveAmendmentContent({
                id: $stateParams.contentId,
                content: $scope.getContentToSave(),
                comments: $scope.getCommentsMetadata(annotationsLT),
                changelog: vm.changelog,
                partyType: "SS",
            })

            AmendmentLetter
            .updateExhibitSS({
                id: $stateParams,
                content: $base64.encode(encodeURIComponent(exhibitContent)),
                comments: $scope.getCommentsMetadata(annotationsET),
                changelog: vm.changelog,
                partyType: "SS",
            })

            // .success(render);

            $scope.$broadcast('onSave', {
                success: redirectToAmendmentLetter,
                error: showError
            });
        };

        function redirectToAmendmentLetter() {
            $scope.loaded = true;
            $location.url('/rfa/company/amendmentLetter');
        }

        function showError() {
            $scope.loaded = true;
        }

        $scope.getTaskStep = function(data) {
            var step = 0;
            if (data.amendmentStatus === undefined) {
                return 0;
            }
            if (data.amendmentStatus.displayName === 'Partially Completed') {
                step = 2;
            }
            if (data.amendmentStatus.displayName === 'Submitted') {
                for (var i = 0; i < data.partyBEntities.length; i++) {
                    if (data.partyBEntities[i].acknowledgementStatus === null) {
                        return 0;
                    }
                }
                step = 1;
            }
            return step;
        };

        $scope.print = function() {

            $window.open(documentsService.openFile({
                id: $stateParams.contentId
            }));
        };

        $scope.viewRFADocumentHistory = function(){
            modalsService.open({
                template: "dashboard/modal/rfa-history/rfa-history",
                controller: "RFAHistory",
                id: $stateParams.contentId,
                class: 'modal-rfa',
                size: 'lg',
                backdrop: 'static'
            });
        }

        function load() {
            $scope.loaded = false;
            AmendmentLetter
                .getContent({
                    id: $stateParams.contentId
                })
                .success(render);
        }

        function chunkifyContent(data) {
                var content = decodeURIComponent($base64.decode(data.content));
                var searchStartStr = '<input ';
                var searchEndStr = '">';
                var searchStrLen = searchStartStr.length;
                
                var start = 0;
                var startIndex = 0, endIndex = 0, index, indices = [];
                var index_end, indices_end = [];
                var content_chunks = [];
                var final_content = '';
                
                while ((index = content.indexOf(searchStartStr, startIndex)) > -1) {
                    indices.push(index);
                    index_end = content.indexOf(searchEndStr, index)
                    indices_end.push(index_end+2);
                    startIndex = index + searchStrLen;
                    start = start + 1;
                }
                
                $scope.start_indexes = indices;
                $scope.end_indexes = indices_end;
                
                for(var i = 0; i < indices.length; i++){
                    var t = '';
                    if(i === 0 ) {
                    console.log("IF ", i, 0, indices[i]);
                    t = '<div class="content_chunk">' + content.substring(0, indices[i]) + '</div>';
                    $scope.contentPlaceholders.push(content.substring(indices[i], indices_end[i]));
                        content_chunks.push(t)
                    } else if(i === indices.length-1) {
                    console.log("ELSE IF", i, indices_end[i], content.length);
                    t = '<div class="content_chunk">' + content.substring(indices_end[i], content.length) + '</div>';
                    $scope.contentPlaceholders.push(content.substring(indices[i], indices_end[i]));
                        content_chunks.push(t)
                    } else {
                    console.log("ELSE ", i, indices_end[i-1], indices[i]);
                    t = '<div class="content_chunk">' + content.substring(indices_end[i-1], indices[i]) + '</div>';
                    $scope.contentPlaceholders.push(content.substring(indices[i], indices_end[i]));
                        content_chunks.push(t)
                    }
                }
               $scope.contentChunks = content_chunks;
                
                for(var l = 0; l < indices.length; l++){
                final_content = final_content + content_chunks[l] + content.substring(indices[l], indices_end[l])
                    if(l === indices.length-1) {
                        final_content = final_content + content_chunks[l]
                    }
                }
                console.log("final_content =>",$scope.contentChunks)
                return final_content;

        }

        function render(data) {
            var content = '';
            $scope.content = data;
            console.log("[AmendmentLetter][Service] => ", data);
            // content = chunkifyContent(data)
            $scope.loaded = false;
            $scope.agreed = data.agreed<2;
            $scope.amendmentId = $stateParams.contentId;
            // var strHtmlContent = decodeURIComponent($base64.decode(data.content));
            var strHtmlContent = decodeURIComponent($base64.decode(data.content));
            $scope.htmlRender = replaceHoldersService
                                    .setContainerStr(strHtmlContent)
                                    .start();
        }
        function closePopup(){
            var openWindows = tinymce.activeEditor.windowManager.getWindows();
            if (openWindows.length) {
                for (var i=0; i<openWindows.length; i++){
                    openWindows[i].close();
                }
            }
        }

        function bindAcceptRejectEventsModified() {
            var i;
            var doc = tinymce.get(vm.editorInstance.id).getDoc();
            return new Promise(function(resolve) {
                nodes_modified = doc.getElementsByClassName("inserted")
                console.log("27sep =0> ", nodes_modified)
                for(i = 0; i < nodes_modified.length; i++) {
                    console.log("27sep =1> ", $(nodes_modified[i]).prev().length)
                    if(i > 0 ){
                        console.log("27sep =[-1]> ", nodes_modified[i-1])
                    }
                    
					if($(nodes_modified[i]).prev().length === 0 || $(nodes_modified[i]).prev()[0].tagName !== "DEL") {
						continue;						
					} else {
						if($(nodes_modified[i]).prev().attr("data-review-action") === "accepted" || $(nodes_modified[i]).prev().attr("data-review-action") === "rejected") {
							$(nodes_modified[i]).prev().onclick = function() {
								return false;
							}
							continue;
						} else {
                            $(nodes_modified[i]).prev().attr("data-review-action", "combined")

                        }
					}
                    if (nodes_modified[i].getAttribute("data-review-action") === "accepted" || nodes_modified[i].getAttribute("data-review-action") === "rejected") {
                        nodes_modified[i].onclick = function() {
                            return false;
                          }
                          continue;
                    } else {
                        $(nodes_modified[i]).attr("data-review-action", "combined")
                    }
					
                    
					
					
                    (function (i) {
                        var combinedElement = document.createElement('span');
                        var toBeDeleted = $(nodes_modified[i]).prev();
                        combinedElement.append($($(nodes_modified[i]).prev()[0].outerHTML)[0]);
                        combinedElement.append($($(nodes_modified[i])[0].outerHTML)[0]);
                        console.log("29sep 0=>", combinedElement)
                        console.log("29sep 1=>", $(nodes_modified[i]).prev()[0].outerHTML);
                        console.log("29sep 2=>", $(nodes_modified[i])[0].outerHTML)
                        $(combinedElement).insertAfter($(nodes_modified[i]));
                        $(nodes_modified[i]).remove();
                        toBeDeleted.remove();
                    
                        combinedElement.onclick = function() {

                        if(!CredentialsService.hasPermission('ss.rfa.legal') && !CredentialsService.hasPermission('ss.rfa.admin')) { // Check for User Permission
                            tinymce.activeEditor.windowManager.alert('Dear ' + window.userName + '!, Your don\'t have previlleges to accept or reject the changes.');

                        }
                        else {

                        tinymce.activeEditor.windowManager.open({
                        // editor.windowManager.open({
                            title: 'Accept / Reject change',
                            body: [
                                { // ********** 'Delete row' ***************
                                text: 'Accept',
                                type: 'button',
                                classes: 'button-without-background',
                                onclick: function (e) {
                                    var acceptedNode = '<span title ="Accepted By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#70e470;"></span>';                            
                                    thisOne = combinedElement
                                    console.log("thisOne => ", thisOne);
                                        var text = thisOne.innerText
                                        var parent = thisOne.parentNode
                                        const newNode = document.createTextNode(text)
                                        vm.changelog.push({
                                            "action" : "ACCEPTED",
                                            "email" : window.userName,
                                            "actiondate" : Date.now() / 1000 | 0,
                                            "previous" : "",
                                            "current" : $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML))
                                        })
                                        parent.replaceChild(newNode, thisOne)
                                        console.log("Accepted this change => ", newNode);
                                        $(newNode).attr("data-review-action", "accepted")
                                        $(newNode).wrap(acceptedNode);
                                        bindAcceptRejectEvents()
                                        .then(function() {
                                            currentContent = tinymce.activeEditor.getContent({
                                                format: 'raw'
                                            });
                                            // api.attribute.saveContentLength = currentContent.length
                                            closePopup();
                                        })
                                    }
                                },
                                { // ********** 'Delete row' ***************
                                text: 'Reject',
                                type: 'button',
                                classes: 'button-without-background',
                                onclick: function (e) {  
                                    var rejectedNode = '<span title ="Rejected By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#ff6767;"></span>';                            
                                    thisOne = combinedElement
                                    vm.changelog.push({
                                        "action" : "REJECTED",
                                        "email" : window.userName,
                                        "actiondate" : Date.now() / 1000 | 0,
                                        "previous" : $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML)),
                                        "current" : ""
                                    })
                                    var text = thisOne.innerText
                                    var parent = thisOne.parentNode
                                    const newNode = document.createTextNode(text)
                                    parent.replaceChild(newNode, thisOne)

                                    console.log('Rejected this change => ', newNode);
                                    /******   TEMPRARY COMMENTED    */
                                    // parent.removeChild(thisOne)
                                    $(newNode).wrap(rejectedNode)
                                    $(newNode).attr("data-review-action", "rejected")
                                    bindAcceptRejectEvents()
                                    .then(function() {
                                        currentContent = tinymce.activeEditor.getContent({
                                            format: 'raw'
                                        });
                                        // api.attribute.saveContentLength = currentContent.length
                                        closePopup();
                                    })
                                }
                            },
                        ]
                        });
                    }
                        }
                        
                    })(i);
                }
				resolve(true)
            })
        }

        function bindAcceptRejectEvents() {
            var i;
            var doc = tinymce.get(vm.editorInstance.id).getDoc();
            return new Promise(function(resolve) {
                nodes_inserted = doc.getElementsByClassName("inserted")
                for(i = 0; i < nodes_inserted.length; i++) {
                    if (nodes_inserted[i].getAttribute("data-review-action") === "accepted" || nodes_inserted[i].getAttribute("data-review-action") === "rejected" || nodes_inserted[i].getAttribute("data-review-action") === "combined") {
                        nodes_inserted[i].onclick = function() {
                            return false;
                          }
                          continue;
                    }
                    (function (i) {
                        nodes_inserted[i].onclick = function() {

                        if(!CredentialsService.hasPermission('ss.rfa.legal') && !CredentialsService.hasPermission('ss.rfa.admin')) { // Check for User Permission
                            tinymce.activeEditor.windowManager.alert('Dear ' + window.userName + '!, Your don\'t have previlleges to accept or reject the changes.');

                        }
                        else {

                        tinymce.activeEditor.windowManager.open({
                        // editor.windowManager.open({
                            title: 'Accept / Reject change',
                            body: [
                                { // ********** 'Delete row' ***************
                                text: 'Accept',
                                type: 'button',
                                classes: 'button-without-background',
                                onclick: function (e) {
                                    var acceptedNode = '<span title ="Accepted By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#70e470;"></span>';                            
                                    thisOne = nodes_inserted[i]
                                    console.log("thisOne => ", thisOne);
                                        var text = thisOne.innerHTML
                                        var parent = thisOne.parentNode
                                        const newNode = document.createTextNode(text)
                                        vm.changelog.push({
                                            "action" : "ACCEPTED",
                                            "email" : $(thisOne).attr('title').substring(
                                                        $(thisOne).attr('title').lastIndexOf("by: ") + 4, 
                                                        $(thisOne).attr('title').lastIndexOf(" on ")
                                                            ),
                                            "actiondate" : Date.now() / 1000 | 0,
                                            "previous" : "",
                                            "current" : $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML))
                                        })
                                        parent.replaceChild(newNode, thisOne)
                                        console.log("Accepted this change => ", newNode);
                                        $(newNode).attr("data-review-action", "accepted")
                                        $(newNode).wrap(acceptedNode);
                                        bindAcceptRejectEventsModified()
                                        bindAcceptRejectEvents()
                                        .then(function() {
                                            currentContent = tinymce.activeEditor.getContent({
                                                format: 'raw'
                                            });
                                            // api.attribute.saveContentLength = currentContent.length
                                            closePopup();
                                        })
                                    }
                                },
                                { // ********** 'Delete row' ***************
                                text: 'Reject',
                                type: 'button',
                                classes: 'button-without-background',
                                onclick: function (e) {  
                                    var rejectedNode = '<span title ="Rejected By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#ff6767;"></span>';                            
                                    thisOne = nodes_inserted[i]
                                    vm.changelog.push({
                                        "action" : "REJECTED",
                                        "email" : $(thisOne).attr('title').substring(
                                                    $(thisOne).attr('title').lastIndexOf("by: ") + 4, 
                                                    $(thisOne).attr('title').lastIndexOf(" on ")
                                                        ),
                                        "actiondate" : Date.now() / 1000 | 0,
                                        "previous" : $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML)),
                                        "current" : ""
                                    })
                                    var text = thisOne.innerHTML
                                    var parent = thisOne.parentNode
                                    const newNode = document.createTextNode(text)
                                    parent.replaceChild(newNode, thisOne)

                                    console.log('Rejected this change => ', newNode);
                                    /******   TEMPRARY COMMENTED    */
                                    // parent.removeChild(thisOne)
                                    $(newNode).wrap(rejectedNode)
                                    $(newNode).attr("data-review-action", "rejected")
                                    bindAcceptRejectEventsModified()
                                    bindAcceptRejectEvents()
                                    .then(function() {
                                        currentContent = tinymce.activeEditor.getContent({
                                            format: 'raw'
                                        });
                                        // api.attribute.saveContentLength = currentContent.length
                                        closePopup();
                                    })
                                }
                            },
                        ]
                        });
                    }
                        }
                        
                    })(i);
                }

                nodes_deleted = doc.getElementsByClassName("tbd")
                for(i = 0; i < nodes_deleted.length; i++) {
                    if (nodes_deleted[i].getAttribute("data-review-action") === "accepted" || nodes_deleted[i].getAttribute("data-review-action") === "rejected" || nodes_deleted[i].getAttribute("data-review-action") === "combined") {
                        nodes_deleted[i].onclick = function() {
                            return false;
                          }
                          continue;
                    }
                    (function (i) {
                        nodes_deleted[i].onclick = function() {
                            

                        if(!CredentialsService.hasPermission('ss.rfa.legal') && !CredentialsService.hasPermission('ss.rfa.admin')) { // Check for User Permission
                                tinymce.activeEditor.windowManager.alert('Dear ' + window.userName + '!, Your don\'t have previlleges to accept or reject the changes.');
                            } else {
                            tinymce.activeEditor.windowManager.open({
                            // editor.windowManager.open({
                                title: 'Accept / Reject change',
                                body: [
                                    { // ********** 'Delete row' ***************
                                    text: 'Accept',
                                    type: 'button',
                                    classes: 'button-without-background',
                                    onclick: function (e) { 
                                        var acceptedNode = '<span title ="Accepted By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#70e470;"></span>';                             
                                        thisOne = nodes_deleted[i]
                                        vm.changelog.push({
                                            "action" : "ACCEPTED",
                                            "email" : $(thisOne).attr('title').substring(
                                                        $(thisOne).attr('title').lastIndexOf("by: ") + 4, 
                                                        $(thisOne).attr('title').lastIndexOf(" on ")
                                                            ),
                                            "actiondate" : Date.now() / 1000 | 0,
                                            "previous" : $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML)),
                                            "current" : ""
                                        })
                                        var text = thisOne.innerHTML
                                        var parent = thisOne.parentNode
                                        const newNode = document.createTextNode(text)
                                        parent.replaceChild(newNode, thisOne)
                                        $(newNode).wrap(acceptedNode);
                                        $(newNode).attr("data-review-action", "accepted")
                                        bindAcceptRejectEventsModified()
                                        bindAcceptRejectEvents()
                                        .then(function() {
                                            currentContent = tinymce.activeEditor.getContent({
                                                format: 'raw'
                                            });
                                            closePopup();
                                            // api.attribute.saveContentLength = currentContent.length
                                        })
                                        }
                                    },
                                    { // ********** 'Delete row' ***************
                                    text: 'Reject',
                                    type: 'button',
                                    classes: 'button-without-background',
                                    onclick: function (e) {
                                        var rejectedNode = '<span title ="Rejected By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#ff6767;"></span>';                               
                                        thisOne = nodes_deleted[i]
                                        vm.changelog.push({
                                            "action" : "REJECTED",
                                            "email" : $(thisOne).attr('title').substring(
                                                        $(thisOne).attr('title').lastIndexOf("by: ") + 4, 
                                                        $(thisOne).attr('title').lastIndexOf(" on ")
                                                            ),
                                            "actiondate" : Date.now() / 1000 | 0,
                                            "previous" : "",
                                            "current" :  $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML))
                                        })
                                        var text = thisOne.innerHTML
                                        var parent = thisOne.parentNode
                                        const newNode = document.createTextNode(text)
                                        parent.replaceChild(newNode, thisOne)
                                        $(newNode).wrap(rejectedNode);
                                        $(newNode).attr("data-review-action", "rejected")
                                        bindAcceptRejectEventsModified()
                                        bindAcceptRejectEvents()
                                        .then(function() {
                                            currentContent = tinymce.activeEditor.getContent({
                                                format: 'raw'
                                            });
                                            closePopup();
                                            // api.attribute.saveContentLength = currentContent.length
                                            closePopup();
                                        })
                                    }
                                },
                            ]
                            });
                        }
                        }
                        
                    })(i);
                }

                nodes_formatted= doc.getElementsByClassName("inserted-format")
                for(i = 0; i < nodes_formatted.length; i++) {
                    if (nodes_formatted[i].getAttribute("data-review-action") === "accepted" || nodes_formatted[i].getAttribute("data-review-action") === "rejected" || nodes_formatted[i].getAttribute("data-review-action") === "combined") {
                        nodes_formatted[i].onclick = function() {
                            return false;
                          }
                          continue;
                    }
                    (function (i) {
                        nodes_formatted[i].onclick = function() {

                        if(!CredentialsService.hasPermission('ss.rfa.legal') && !CredentialsService.hasPermission('ss.rfa.admin')) { // Check for User Permission
                            tinymce.activeEditor.windowManager.alert('Dear ' + window.userName + '!, Your don\'t have previlleges to accept or reject the changes.');

                            // tinymce.activeEditor.notificationManager.open({
                            //     text: '<h1>Dear ' + window.userName + '!</h1>,<p>Your don\'t have previlleges to <span style="color:green"><strong>accept</strong></span> or <span style="color:red"><strong>reject</strong></span> the changes.</p>',
                            //     timeout: 5000,
                            //     closeButton: false,
                            //     type: "error"
                            //   });
                        }
                        else {

                        tinymce.activeEditor.windowManager.open({
                        // editor.windowManager.open({
                            title: 'Accept / Reject change',
                            body: [
                                { // ********** 'Delete row' ***************
                                text: 'Accept',
                                type: 'button',
                                classes: 'button-without-background',
                                onclick: function (e) {
                                    var acceptedNode = '<span title ="Accepted By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#70e470;"></span>';                            
                                    thisOne = nodes_formatted[i]
                                    console.log("thisOne => ", thisOne);
                                        var text = thisOne.innerHTML
                                        var parent = thisOne.parentNode
                                        const newNode = document.createElement('span')
                                        newNode.innerHTML = text
                                        vm.changelog.push({
                                            "action" : "ACCEPTED",
                                            "email" : $(thisOne).attr('title').substring(
                                                        $(thisOne).attr('title').lastIndexOf("by: ") + 4, 
                                                        $(thisOne).attr('title').lastIndexOf(" on ")
                                                            ),
                                            "actiondate" : Date.now() / 1000 | 0,
                                            "previous" : "",
                                            "current" : $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML))
                                        })
                                        parent.replaceChild(newNode, thisOne)
                                        console.log("Accepted this change => ", newNode);
                                        $(newNode).wrap(acceptedNode);
                                        $(newNode).attr("data-review-action", "accepted")
                                        bindAcceptRejectEventsModified()
                                        bindAcceptRejectEvents()
                                        .then(function() {
                                            currentContent = tinymce.activeEditor.getContent({
                                                format: 'raw'
                                            });
                                            // api.attribute.saveContentLength = currentContent.length
                                            closePopup();
                                        })
                                    }
                                },
                                { // ********** 'Delete row' ***************
                                text: 'Reject',
                                type: 'button',
                                classes: 'button-without-background',
                                onclick: function (e) {  
                                    var rejectedNode = '<span title ="Rejected By: ' + window.userName + ' on '+ new Date() + '" style="background-color:#ff6767;"></span>';                            
                                    thisOne = nodes_formatted[i]
                                    vm.changelog.push({
                                        "action" : "REJECTED",
                                        "email" : $(thisOne).attr('title').substring(
                                                    $(thisOne).attr('title').lastIndexOf("by: ") + 4, 
                                                    $(thisOne).attr('title').lastIndexOf(" on ")
                                                        ),
                                        "actiondate" : Date.now() / 1000 | 0,
                                        "previous" : $base64.encode(encodeURIComponent($(thisOne)[0].outerHTML)),
                                        "current" : ""
                                    })
                                    var text = thisOne.innerHTML
                                    var parent = thisOne.parentNode
                                    const newNode = document.createElement('span')
                                    newNode.innerHTML = text
                                    parent.replaceChild(newNode, thisOne)
                                    console.log('Rejected this change => ', newNode);
                                    /******   TEMPRARY COMMENTED    */
                                    // parent.removeChild(thisOne)
                                    $(newNode).wrap(rejectedNode)
                                    $(newNode).attr("data-review-action", "rejected")
                                    bindAcceptRejectEventsModified()
                                    bindAcceptRejectEvents()
                                    .then(function() {
                                        currentContent = tinymce.activeEditor.getContent({
                                            format: 'raw'
                                        });
                                        // api.attribute.saveContentLength = currentContent.length
                                        closePopup();
                                    })
                                }
                            },
                        ]
                        });
                    }
                        }
                        
                    })(i);
                }

                
                resolve(true)
            })
        }

    }
})();
