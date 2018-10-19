angular.module('partyABCreator').controller('templateSelection.ctrl',[
    '$scope',
    'LetterTemplate',
    function(
        $scope,
        LetterTemplate
    ) {
        var vm = this;
        $scope.maxLength = 6;
        vm.loaded = false;
        var extendedData = $scope.inputData;

        extendedData.letterTemplates = extendedData.letterTemplates || [];

        //TODO  please remove shitcode
        $scope.getScrollSettings = function(length) {
            var obj = {};
            if (length >= $scope.maxLength) {
                obj.height = 260;
            } else {
                obj.height = length * 23;
            }
            return JSON.stringify(obj);
        };

        vm.letterTemplatesSelected = function() {
            if (extendedData.selectedPartyA === undefined) {
                return false;
            }

            return extendedData.selectedPartyA.filter(function(i) {
                    return i.letterTemplateId > 0;
                }).length >= extendedData.selectedPartyA.length;
        };

        vm.back = function() {
            $scope.$emit('step.back',{data: $scope.inputData});
        };
        vm.next = function() {
            $scope.$emit('step.next',{data: $scope.inputData});
        };

        vm.select = function(entity, choice) {
            entity.requestName = choice.name + ' rfa';
            entity.letterTemplateName = choice.name;
            entity.letterTemplateId = choice.id;
            entity.content = choice.content;
        };

        if (!extendedData.letterTemplates.length) {
            LetterTemplate.get({
                templateId: ''
            })
                .then(function(data) {
                    extendedData.letterTemplates = data.data;
                    vm.loaded = true;
                })
                .catch(function() {
                });
        }else {
            vm.loaded = true;
        }
    }
]);
