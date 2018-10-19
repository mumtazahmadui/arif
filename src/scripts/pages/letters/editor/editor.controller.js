(function() {
    // @ngInject
    function letterEditorController(
        $scope,
        LetterTemplate,
        letterTemplateSaver,
        letterEditorOptions,
        contentHandler,
        $stateParams,
        modalsService,
        $window,
        $q
    ) {
        /* jshint validthis: true */
        var vm = this;

        vm.isNew = $stateParams.contentId === 'new';

        vm.editorInstance = '';

        vm.editorOptions = letterEditorOptions;

        vm.save = save;

        vm.print = print;

        vm.enableSave = enableSave;

        vm.letter = {};


        $scope.name = '';

        $scope.notificationText = 'Loading...';
        $scope.isShowLoader = false;



        var editorWatcher = $scope.$watch(function() {
            return vm.editorInstance;
        }, function(editor) {
            if (editor) {
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
                LetterTemplate.get({
                    templateId: $stateParams.contentId
                }).then(function(data) {
                    $scope.isShowLoader = false;
                    if (data && data.data) {
                        vm.letter = data.data;
                        $scope.name = data.data.name;
                        var handledContentBeforeView = contentHandler.handleBeforeView(data.data.content, 'input');
                        vm.editorInstance.setContent(handledContentBeforeView, {format: 'raw'});
                        vm.editorInstance.prevContent = vm.editorInstance.getContent({format: 'raw'});
                    }
                });
            } else {
                vm.editorInstance.setContent('');
                vm.editorInstance.prevContent = vm.editorInstance.getContent({format: 'raw'});
                vm.editorInstance.undoManager.add();
            }
        }

        function print(){
            $window.print();
        }

        function enableSave(){
            return LetterTemplate.enableSave(vm.editorInstance.bodyElement);
        }

        function save() {
            var validationResult = LetterTemplate.validateContent(vm.editorInstance.bodyElement);
            if (validationResult.isValid) {
                vm.letter.name = $scope.name;
                vm.letter.content = contentHandler.handleBeforeSave(vm.editorInstance);
                $scope.notificationText = 'Saving...';
                $scope.isShowLoader = true;
                letterTemplateSaver.save(vm.letter, false).finally(function() {
                    $scope.isShowLoader = false;
                });
            } else if (validationResult.message) {
                modalsService.alert({
                    class: 'modal-rfa',
                    title: 'Error',
                    body: validationResult.message
                });
            }
        }
    }

    angular
        .module('rfa.letters.editor')
        .controller('LetterEditorController', letterEditorController);
})();
