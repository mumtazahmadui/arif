(function () {
    angular
        .module('app.bulk.upload')
        .controller('addTemplateNameModalController', addTemplateNameModalController);

    function addTemplateNameModalController($scope, data) {
        var vm = this;
        vm.add = add;
        vm.canAdd = canAdd;
        angular.extend(vm, data.templateModel);

        function add() {
            $scope.$close(vm.templateName);
        }

        function canAdd() {
            return vm.templateName && vm.templateName.length > 0;
        }

    }
})();