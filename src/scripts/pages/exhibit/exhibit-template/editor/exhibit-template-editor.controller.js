(function() {
    angular.module('rfa.exhibit-template-editor')
        .controller('exhibitTemplateEditorController', exhibitTemplateController);

    function exhibitTemplateController(
        $scope,
        ExhibitTemplate,
        exhibitEditorOptions,
        contentHandler,
        $stateParams,
        $window,
        $q,
        $location
    ) {
        /* jshint validthis: true */
        var vm = this;

        vm.isNew = $stateParams.contentId === 'new';

        vm.editorInstance = '';

        vm.editorOptions = exhibitEditorOptions;

        vm.save = save;

        vm.print = print;

        $scope.name = '';

        $scope.notificationText = 'Loading...';

        $scope.isShowLoader = false;

        $scope.isShowSelectControlColumn = {flag:false};

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
                ExhibitTemplate.get({templateId: $stateParams.contentId}).then(function(data) {
                        $scope.isShowLoader = false;
                        $scope.contentId = $stateParams.contentId;
                        if (data && data.data) {
                            $scope.data = data.data;
                            $scope.name = data.data.name;
                            $scope.tableData = data.tableData;
                            if($scope.tableData.rows.length) {
                                $scope.isShowSelectControlColumn.flag = $scope.tableData.rows[0].some(function(clmn){return clmn.controlColumn; });
                            }
                            var content = contentHandler.handleBeforeView(data.content);
                            vm.editorInstance.setContent(content, {format: 'raw'});
                        }
                    });
            } else {
                vm.editorInstance.setContent('');
                vm.editorInstance.undoManager.add();
            }
        }

        function print(){
            $window.print();
        }

        function save() {
            $scope.invalid = !$scope.exhTempForm.$valid;

            if (!$scope.invalid) {
                var savedTemplate = contentHandler.handleBeforeSave(vm.editorInstance);
                var preparedData = {};
                var item = {
                    type: "exhibit",
                    name: $scope.name,
                    tableData: $scope.tableData,
                    preparedData: preparedData,
                    content: {name: $scope.name},
                    data: $scope.data || {},
                    contentId: $scope.contentId,
                    selectControlColumn: $scope.isShowSelectControlColumn.flag,
                    template: savedTemplate
                };
                item.data.name = undefined;

                $scope.notificationText = 'Saving...';
                $scope.isShowLoader = true;
                ExhibitTemplate.save(item, false).then(function(){
                    $location.path('/rfa/company/exhibitTemplate');
                }).finally(function() {
                    $scope.isShowLoader = false;
                });
            }
        }
    }
})();
