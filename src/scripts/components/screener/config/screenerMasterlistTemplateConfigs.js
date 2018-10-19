(function() {
    // @ngInject
    var screenerMasterlistTemplateConfigs = {
        data: {
            title: 'Masterlist Template',
            tasks: {},
            pages: {},
            table: {
                template: 'masterlist_template',
                desc: true,
                sortBy: 'Name',
                data: {}
            },
            filters: [
                {
                    id: "template_name",
                    label: "Masterlist Template Name",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                }
            ]
        }
    };

    angular
        .module('app.configs')
        .constant("screenerMasterlistTemplateConfigs", screenerMasterlistTemplateConfigs);
})();