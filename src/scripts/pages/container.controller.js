(function(){
    angular
        .module('app')
        .controller('ContainerController', containerController);

    // @ngInject
    function containerController($scope, CredentialsService) {
        $scope.type = CredentialsService.companyType();
    }
})();