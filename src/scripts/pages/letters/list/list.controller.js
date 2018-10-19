(function() {
    // @ngInject
    function lettersListController($scope, LetterTemplate, $location, toastr, ScreenerService, modalsService, CredentialsService, $window, documentsService) {
        /* jshint validthis: true */
        var vm = this;
        vm.update = update;
        vm.edit = edit;
        vm.remove = remove;
        vm.filterSearch = filterSearch;
        vm.open = open;

        vm.isDestroy = false;

        $scope.$on('$destroy', function() {
            vm.isDestroy = true;
        });

        activate();

        function activate() {
            vm.data = ScreenerService.get('LetterTemplates');
            vm.data.loading = true;
            return;
        };

        function open(data) {
            $window.open(documentsService.openFile({fileId: data.fileId}));
        };

        function edit(data) {
            $location.url('/rfa/company/letterTemplate/' + data.id);
        };

        function remove(data) {
            var modalConfirmInstance = modalsService.open({
                'template': 'letters/modal/delete-letter-template',
                'controller': 'DeleteLetterTemplate',
                'id': data.id,
                'name': data.name,
                'class': 'modal-rfa'
            });
            modalConfirmInstance.result.then(function() {
                LetterTemplate.remove({'templateId': data.id})
                    .success(function() {
                        ScreenerService.set(vm.data, true);
                    })
                    .error(function() {
                    });
            }, function() {});
        };

        function update() {
            vm.data.loading = true;
            LetterTemplate.search({
                'items_per_page': vm.data.pages.items_per_page,
                'page': vm.data.pages.page,
                'sortBy': vm.data.table.sortBy.toLowerCase(),
                'desc': vm.data.table.desc,
                'data': vm.data
            })
                .success(function(data) {
                    if (vm.isDestroy) {
                        return;
                    }
                    vm.data.table.data = data;
                    vm.data.loading = false;
                    ScreenerService.set(vm.data, false);
                })
                .error(function() {
                });
        };

        function filterSearch(params) {
            LetterTemplate.filterSearch({'filterString': params.query, 'filterName': params.filterName})
                .success(function(data) {
                    angular.forEach(vm.data.filters, function(value) {
                        if (value.id === params.filterName) {
                            value.data = data.data;
                            value.loading = false;
                            ScreenerService.set(vm.data, false);
                        }
                    });
                });
        };

        $scope.$on('screenerUpdate', function(event, server) {
            vm.data = ScreenerService.get();
            if (server) {
                vm.update();
            }
        });

        $scope.$on('screenerCall', function(event, data) {
            if (vm[data.name] !== undefined) {
                vm[data.name](data.params);
            }
        });
    }

    angular
        .module('rfa.letters.list')
        .controller('LettersListController', lettersListController);
})();
