(function () {
    // @ngInject
    function screenerConfigsFactory($injector, screenerConfigs, CredentialsService) {
        /* jshint validthis: true */
        return {
            get: get,
            data: {}
        };

        function get(name) {
            this.data = screenerConfigs.data;
            this.data.credentials = {};
            this.data.credentials.companyId = CredentialsService.companyId();
            this.data.credentials.userId = CredentialsService.userId();
            this.data.credentials.companyType = CredentialsService.companyType();
            this.data.actions = [];
            this.data.buttons = [];
            this.data.showhideGrid=true;
            this.data.onCompletedTabs=false;
            var extention = $injector.get('screener' + name + 'Configs');
            angular.extend(this.data, extention.data);
            return this.data;
        }
    }

    angular
        .module('app.services')
        .service('screenerConfigsFactory', screenerConfigsFactory);
})();