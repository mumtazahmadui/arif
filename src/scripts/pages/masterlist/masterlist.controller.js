(function(){
    angular
        .module('rfa.masterlist')
        .controller('MasterlistController', masterlistController);

    function masterlistController(masterlistTabsConfig) {
        var vm = this;
        vm.tabsConfig = angular.copy(masterlistTabsConfig);
    }
})();