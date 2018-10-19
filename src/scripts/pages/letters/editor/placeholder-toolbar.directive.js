(function() {
    function letterPlaceholderToolbarDirective(insertHTMLKeysConfig, $timeout) {
        return {
            restict: 'A',
            link: link,
            templateUrl: '/scripts/pages/letters/editor/placeholder-toolbar.html',
            scope: {
                editorInstance: '='
            }
        }


        function link(scope) {
            //Copying config for immutability
            scope.placeholdersMap = angular.copy(insertHTMLKeysConfig);
            scope.placeholdersKey = ['partyARelations', 'partyBAddition', 'partyBRemoval', 'bs_signature', 'ss_signature', 'fund_name_change', 'exhibit_value_change'];
            scope.selectPlaceholder = selectPlaceholder;
            scope.setupEditor = setupEditor;
            var editorWatcher = scope.$watch('editorInstance', function(editor) {
                if (editor) {
                    //remove editor watcher
                    editorWatcher();
                    setupEditor(editor);
                }
            });

            function setupEditor(editor) {
                editor.on('NodeChange SetContent', onChange);
                //We need to make possibility to disable history
                editor.on('BeforeAddUndo', function(event) {
                    if (editor.disableHistory) {
                        event.preventDefault();
                        return false;
                    }
                });
                editor.on('focus', function(){ // insert selected placeholder
                    if(scope.selectedPlaceholder) {
                        setTimeout(function(){ // we should insert placeholder after the moment when cusor set in its place
                            insertPlaceholder();
                        })
                    }
                })                
            }

            function insertPlaceholder() {
                var placeholder = scope.selectedPlaceholder;
                scope.selectedPlaceholder = null;
                if (scope.editorInstance && !placeholder.map.addingDisabled) {
                    scope.editorInstance.execCommand('mceInsertContent', false, placeholder.map.template[0][1]);
                    $timeout(onChange, 100);
                }
            }

            function selectPlaceholder(id) {
                scope.selectedPlaceholder = {
                    id: id,
                    map: scope.placeholdersMap[id]
                };
            }

            function incrementPlaceholderIndexes(placeholderKey, items) {
                angular.forEach(items, function(value, index) {
                    var newIndex = index + 1;
                    $(value).attr({
                        index: newIndex,
                        id: placeholderKey + '[' + newIndex + ']',
                        value: scope.placeholdersMap[placeholderKey].value.replace('{index}', newIndex)
                    });
                });
            }

            function onChange() {
                var content = $(scope.editorInstance.bodyElement);
                angular.forEach(scope.placeholdersMap, function(value, key) {
                    var items = content.find('[id^=' + key + ']');
                    if (scope.placeholdersMap[key].isIndexed) {
                        incrementPlaceholderIndexes(key, items);
                    }
                    value.addingDisabled = value.once && !!items.length;
                });
                //Disabling buttons sellside and buyside signature
                //To prevent another dom searching we can get the current state according to placholder addingDisabled properties
                //In case if addingDisabled is true and propery once is equal to true then we know that this placeholder didn't added

                var placeholdersIdsThatMakesEnable = ['partyBAddition', 'partyBRemoval', 'fund_name_change', 'exhibit_value_change'];
                var signatureDisable = !placeholdersIdsThatMakesEnable.reduce(function(result, placeholderId) {
                    return scope.placeholdersMap[placeholderId].addingDisabled || result;
                }, false);

                ['bs_signature', 'ss_signature'].forEach(function(key) {
                    scope.placeholdersMap[key].addingDisabled = signatureDisable;
                });

                scope.$evalAsync();
                return content;
            }
        }
    }
    angular.module('rfa.letters.editor').directive('letterPlaceholderToolbar', ['insertHTMLKeysConfig', '$timeout', letterPlaceholderToolbarDirective]);
})();
