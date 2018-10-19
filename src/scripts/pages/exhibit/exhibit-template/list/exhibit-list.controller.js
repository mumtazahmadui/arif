/**
 * RFA Exhibit Library
 * ### Used for:
 *
 *     RFA
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

(function () {
    // @ngInject
    angular.module('app.controllers')
        .controller('exhibitListController', exhibitListController);

    function exhibitListController($scope,
                                   rfaExibitTemplateService,
                                   ScreenerService,
                                   modalsService,
                                   $location,
                                   $window,
                                   documentsService,
                                   exhibitTemplateSaver) {
        /* jshint validthis: true */
        var vm = this;
        vm.update = update;
        vm.edit = edit;
        vm.remove = remove;
        vm.filterSearch = filterSearch;
        vm.open = open;
        vm.linkExhibit = linkExhibit;


        vm.isDestroy = false;

        $scope.$on('$destroy', function () {
            vm.isDestroy = true;
        });

        vm.data = ScreenerService.get('ExhibitTemplate');
        vm.data.loading = true;

        function open(data) {
            $window.open(documentsService.openFile({
                fileId: data.fileId
            }));
        }

        function edit(data) {
            $location.url("/rfa/company/exhibitTemplate/" + data.id);
        }

        function linkExhibit(data) {
            exhibitTemplateSaver.linkMasterAgreementStep(data).then(function () {
                update();
            });
        }

        function remove(params) {
            modalsService.openRemovePopup({
                id: params.exhibitId,
                name: params.exhibitName
            }).result.then(function () {
                rfaExibitTemplateService.del(
                    vm.companyId, params.exhibitId
                ).success(function () {
                    update();
                }).error(function () {
                });
            }, function () {
            });
        }

        function getFilterforQuery(filter) {
            if (!filter) {
                return '';
            }
            return filter.toLowerCase();
        }

        function update() {
            vm.data.loading = true;
            rfaExibitTemplateService.search({
                items_per_page: vm.data.pages.items_per_page,
                page: vm.data.pages.page,
                sortBy: getFilterforQuery(vm.data.table.sortBy),
                partyALegalName: getFilterforQuery(vm.data.table.partyALegalName),
                refIsdaDate: getFilterforQuery(vm.data.table.refIsdaDate),
                masterlist_identifier: getFilterforQuery(vm.data.table.masterlist_identifier),
                linkedBy: getFilterforQuery(vm.data.table.linkedBy),
                sortOrder: vm.data.table.sortOrder,
                companyId: vm.companyId,
                desc: vm.data.table.desc,
                data: vm.data
            }).success(function (data) {
                if (vm.isDestroy) {
                    return;
                }
                vm.data.table.data = data;
                vm.data.loading = false;
                ScreenerService.set(vm.data, false);
            }).error(function () {
                vm.data.loading = false;
            });
        }

        function filterSearch(params) {
            rfaExibitTemplateService.filterSearch({
                filterString: params.query,
                filterName: params.filterName
            }).success(function (data) {
                angular.forEach(vm.data.filters, function (value) {
                    if (value.id === params.filterName) {
                        value.data = data.data;
                        value.loading = false;
                        ScreenerService.set(vm.data, false);
                    }
                });
            });
        }

        $scope.$on('screenerUpdate', function (event, server) {
            vm.data = ScreenerService.get();
            if (server) {
                vm.update();
            }
        });

        $scope.$on('screenerCall', function (event, data) {
            if (vm[data.name] !== undefined) {
                vm[data.name](data.params);
            }
        });
    }
})();