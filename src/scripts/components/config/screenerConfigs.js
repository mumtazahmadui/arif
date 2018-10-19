(function() {
    // @ngInject
    var screenerConfigs = {
        data: {
            tasks: {},
            pages: {},
            table: {
                template: '',
                desc: true,
                sortBy: 'Name',
                data: {}
            },
            filters: []
        }
    };

    angular
        .module('app.configs')
        .constant("screenerConfigs", screenerConfigs);
})();