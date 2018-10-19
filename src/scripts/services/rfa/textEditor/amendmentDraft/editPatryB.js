angular.module('app.placeholders')
    .factory('editPartyB', [
        'textEditorGetDataForEditor',
        'textEditorTypesConfig',
        'partyABCreator',
        '$q',
        'AmendmentLetter',
        'CredentialsService',
        function(
            textEditorGetDataForEditor, textEditorTypesConfig, partyABCreator, $q, AmendmentLetter, CredentialsService
        ) {
            var getDataForEditor = function() {
                var amendmentWithoutContent = textEditorGetDataForEditor
                    .getAmendmentDraftWithoutContent(textEditorTypesConfig.draft);
                return amendmentWithoutContent.then(openModalWindow);
            };
            var prepareData = function(data) {
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

            function openModalWindow(data) {
                data.editorData.data.content = this.undecodedContent;
                var editorData = {
                    data: data.editorData.data,
                    name: data.name
                };
                var RFA = prepareData(editorData);
                return partyABCreator.openModal({
                    RFA: RFA,
                    flow: 'editB'
                }).then(function(data) {
                    this.scope.$emit('content:render:start');
                    if (!data || !data.preparedData) {
                        return $q.reject();
                    }

                    var newData = angular.copy(data.preparedData);
                    for (var i = 0; i < data.preparedData.length; i++) {
                        newData.data[i].modifiedBy = CredentialsService.userId();
                    }

                    return AmendmentLetter.update({
                        data: newData
                    });
                });
            }

            return function($scope, amendment){
                this.scope = $scope;
                this.undecodedContent = amendment.undecodedContent;
                getDataForEditor().then(function() {
                    amendment.content = "";
                    $scope.updateContent();
                });
            };
        }]);

