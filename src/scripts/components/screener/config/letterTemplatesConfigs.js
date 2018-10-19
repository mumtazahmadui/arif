(function() {
    // @ngInject
    var screenerLetterTemplatesConfigs = {
        data: {
            title: 'Letter Templates',
            tasks: [],
            pages: {},
            table: {
                template: 'letters',
                desc: true,
                sortBy: 'Name',
                data: {}
            },
            filters: [{
                    id: 'template_name',
                    label: "Template Name",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: 'last_edited_by',
                    label: "Last Edited By",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: 'created_by',
                    label: "Created By",
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
        .constant("screenerLetterTemplatesConfigs", screenerLetterTemplatesConfigs);
})();