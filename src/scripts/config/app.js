(function() {
    // @ngInject
    var appConfig = {
        api_host: 'ms-webapp-rfa/v1/',
        items_per_page: 25,
        per_page: [25, 50, 100, 250],
        date_format: 'dd/MM/yyyy hh:mm a'
    };

    angular
        .module('app.configs')
        .constant("appConfig", appConfig);
})();