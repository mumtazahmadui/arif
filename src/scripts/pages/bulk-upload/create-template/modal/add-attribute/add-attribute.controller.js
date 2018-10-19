(function () {
    angular
        .module('app.bulk.upload')
        .controller('addAttributeModalController', addAttributeModalController);

    function addAttributeModalController($scope, $rootScope, data) {
        var vm = this;
        vm.init = init;
        vm.add = add;
        vm.canAdd = canAdd;
        angular.extend(vm, data);
        vm.init();


        function init() {
            vm.isAlreadyAdded = vm.templateModel.filter(function (row) {
                return row.removable && row.isShow;
            });
            vm.templateModel = vm.templateModel.filter(function (row) {
                return row.removable && !row.isShow;
            });
        }

        function add() {
            var resultsToAdd = getAllSelected().map(function (row) {
                return row.fieldIdentifier;
            });
            if (resultsToAdd.indexOf('Sleeve Client Identifier') > -1) {
             $rootScope.$broadcast('scannerStarted');
            }
            $scope.$close(resultsToAdd)
        }

        function getAllSelected() {
            return vm.templateModel.filter(function (row) {
                return row.removable && row.isShow && vm.isAlreadyAdded.indexOf(row) === -1;
            });
        }

        function canAdd() {
            return getAllSelected().length === 0;
        }

    }
})();