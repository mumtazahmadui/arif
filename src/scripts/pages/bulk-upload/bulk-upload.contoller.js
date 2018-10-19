(function () {
    'use strict';

    angular.module('app.bulk.upload')
        .controller('bulkUploadController', bulkUploadController);
    // @ngInject
    function bulkUploadController($scope, bulkUploadTabsConfig, $state) {
        var vm = this;
        vm.tabsConfig = angular.copy(bulkUploadTabsConfig);
        vm.show = show;



        function show() {
            return vm.tabsConfig.filter(function (row) {
                return $state.current.name === row.href;
            }).length > 0;
        }
    }

})();