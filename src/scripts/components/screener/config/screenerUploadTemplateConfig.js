(function () {
    // @ngInject
    var screenerUploadTemplateConfigs = {
        data: {
            title: 'Templates',
            tasks: {},
            pages: {},
            buttons: [
                { label: 'Create Upload Template', method: 'createUploadTemplate', class: "btn-clear" },
            ],
            table: {
                template: 'upload_template',
                desc: true,
                sortBy: 'Name',
                data: {}
            },
            filters: [
                {
                    id: "template_name",
                    label: "Template Name",
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
        .constant("screenerUploadTemplateConfigs", screenerUploadTemplateConfigs);
})();