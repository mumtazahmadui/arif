(function(){

    angular.module('app')
        .controller('AppController', appController)
    ;



    function appController($scope, CredentialsService, $location) {
        $scope.user = {};

        CredentialsService.get().success(function(data) {
            $scope.user.id = data.data.userId;
            $scope.user.companyId = data.data.companyId;
            $scope.user.companyName = data.data.companyName;
            $scope.user.companyType = data.data.companyType;
            $scope.user.Name = data.data.userName;
            $scope.user.phone = data.data.phone;
            $scope.user.email = data.data.email;
            $scope.user.Title = data.data.title;
            $scope.user.permissions = data.data.permissions;
        });

        $.ajaxSetup({
            cache: false
        });

        $scope.linkTo = function(where) {
            $location.path(where);
        };
    }
})();

