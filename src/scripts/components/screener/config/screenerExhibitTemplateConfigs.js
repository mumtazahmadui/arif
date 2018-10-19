(function() {
    // @ngInject
    var screenerExhibitTemplateConfigs = {
        data: {
            title: 'Exhibit Templates',
            tasks: [],
            pages: {},
            table: {
                template: 'exhibits',
                desc: true,
                sortBy: 'Name',
                partyALegalName: 'Name',
                refIsdaDate: 'Name',
                masterlist_identifier: 'Name',
                linkedBy: 'Name',
                data: {}
            },
            filters: [{
                id: 'template_name',
                label: "Exhibits Name",
                type: "search",
                needSearch: true,
                default_value: "All",
                data: []
            }, {
                id: 'created_by',
                label: "Created By",
                type: "search",
                needSearch: true,
                default_value: "All",
                data: []
            }, {
                id: 'partyALegalName',
                label: "Party A True/Legal Name",
                type: "search",
                needSearch: true,
                default_value: "All",
                data: []
            }, {
                id: 'refIsdaDate',
                label: "Ref. ISDA Date",
                type: "search",
                needSearch: true,
                default_value: "All",
                data: []
            }, {
                id: 'masterlist_identifier',
                label: "Masterlist Identifier",
                type: "search",
                needSearch: true,
                default_value: "All",
                data: []
            }, {
                id: 'linkedBy',
                label: "Linked By",
                type: "search",
                needSearch: true,
                default_value: "All",
                data: []
            }]
        }
    };

    angular
        .module('app.configs')
        .constant("screenerExhibitTemplateConfigs", screenerExhibitTemplateConfigs);
})();