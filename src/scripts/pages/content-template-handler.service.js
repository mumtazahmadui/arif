(function() {
    angular.module('app')
        .service('contentHandler', function() {

            function replaceBR(content) {
                var res = content;// = content.replace(/^<br[^>]*?\/?>/g, '&#65279;');
                res = res.replace(/>&nbsp;</g, '>&#65279;<');
                res = res.replace(/<\/?\w+:[^>]*?>/g, '');
                return res;

            }

            function removeComments(content){
                return content.replace(/(<|&lt;)!--.*?--(>|&gt;)/g, '');
            }

            function removeLineBreaks(content){
                return content.replace(/>[\r\n]+</g, '><');
            }

            function handleBeforeView(content, requiredNode) {
                var replacedContent = removeLineBreaks(removeComments(replaceBR(content)));
                var handledContent = $('<div>').html(replacedContent), dOne;
                //replace date_pinned placeholder in root and remove all paragraphs with it
                angular.forEach(handledContent.find("input#date_pinned"), function(inp){
                    if(dOne){
                        if(inp.parentNode.nodeName === 'P') $(inp.parentNode).remove();
                        else $(inp).remove();
                    } else {
                        dOne = inp;
                        if(inp.parentNode.nodeName === 'P'){
                            var p = $(inp.parentNode);
                            $(inp).remove();
                            p.after(inp);
                            p.remove();
                        }
                    }
                });
                //remove all finished <br> in lines
                angular.forEach(handledContent.find('br'), function(br){
                    if(br.nextSibling && br.nextSibling.tagName === 'P'){
                        $(br).after('&#65279;');
                        $(br).remove();
                        return;
                    }
                    //if <br> is last of 'p' child and not have other text below it, we should remove that
                    var pofbr = br, bpos, pcontent;
                    while(pofbr && pofbr.tagName !== 'P' && pofbr.parentNode !== handledContent[0]) pofbr = pofbr.parentNode;                    
                    //find the br position and get all html before it                    
                    if(pofbr){
                        bpos = pofbr.innerHTML.indexOf("<br");
                        if(bpos >-1){
                            var vcontent = pofbr.innerHTML.substring(0, bpos).replace(/<[^>]+>/g, '');
                            pcontent = pofbr.innerHTML.substring(bpos).replace(/<[^>]+>/g, ''); //gets content and remove all tags
                            if(vcontent.length === 0 && pcontent.length === 0){
                                pofbr.innerHTML = pofbr.innerHTML.replace(/<br.*?\/?>/, '&#65279;');
                            } else if(!pcontent.length){
                                $(br).remove();
                            }
                        }
                    }
                });
                
                return handledContent.html();
                //remove empty fonts and paragraphs
                ['font', 'span', 'p',].forEach(function(name){
                    
                    angular.forEach(handledContent.find(name), function (element) {
                        if (element && element.innerText !== undefined && element.innerText.match(/^[ ]*$/) && !$(element).find(requiredNode).length){
                            //check all childs for white spaces
                            var find = true;
                            if(element.childNodes.length){                                
                                var checkNonSpace = function(node){
                                    if(node.nodeType === 3){
                                        return node.nodeValue.match(/[^ ]+/);
                                    } else return _.some(node.childNodes, function(cnd){
                                        return checkNonSpace(cnd);
                                    });
                                };
                                find = !checkNonSpace(element);
                            }
                            if(find)
                                $(element).remove();
                        }
                    });
                });

                // return handledContent.html();
            }

            function handleRFABeforeView(editor) {
                var handledContent = $('<div>').html(handleBeforeView(editor.getContent({format: 'raw'}), 'input'));
                //styling partyA comment
                var parARel = handledContent.find('#partyARelations');

                if(parARel.length) {
                    var prevElem = parARel.prev();
                    if (prevElem.is('p') && !prevElem.hasClass('partAComment')) {
                        prevElem.addClass('partAComment');
                    }
                }

                //add paragraphs how parents for lineBreaks
                angular.forEach(handledContent.find('td.headerText'), function(lineBreak) {
                    if(!$(lineBreak).children().length) {
                        lineBreak.innerHTML = '<p>' + lineBreak.innerHTML + '</p>';
                    }
                });

                editor.setContent(handledContent.html(), {format: 'raw'});
            }

            function handleBeforeSave(editor) {
                var handledContent = replaceBR(editor.getContent({format: 'raw'}));
                handledContent = handledContent + '<p></p>'
                editor.setContent(handledContent, {format: 'raw'});
                return handledContent;
            }

            function handleRFABeforeSave(editor) {
                var content = $('<div>').html(replaceBR(editor.getContent({format: 'raw'})));
                var parARel = content.find('#partyARelations');

                //just for styling comments around partyARelation in PDF
                if(parARel.length) {
                    var prevElem = parARel.prev(),
                        nextElem = parARel.next();
                    angular.forEach([prevElem, nextElem], function(paragraph) {
                        if(paragraph.is('p')) {
                            paragraph.attr('style', 'display: inline;');
                        }
                    });
                }

                editor.setContent(content.html(), {format: 'raw'});
            }


            return {
                replaceBR: replaceBR,
                handleBeforeView: handleBeforeView,
                handleRFABeforeView: handleRFABeforeView,
                handleBeforeSave: handleBeforeSave,
                handleRFABeforeSave: handleRFABeforeSave
            };
        });
})();