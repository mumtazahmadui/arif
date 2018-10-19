(function() {
    // @ngInject
    var screenerMasterlistConfigs = {
        data: {
            title: 'Masterlist',
            tasks: {},
            pages: {},
            table: {
                template: 'masterlist',
                desc: true,
                sortBy: 'Name',
                data: {}
            },
            filters: [
                {
                    id: "agreement_date",
                    label: "Reference Master Agreement Date",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },
                {
                    id: "masterlist_identifier",
                    label: "Masterlist Identifier",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },
                {
                    id:"investment_manager",
                    label: "Investment Manager",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },
                {
                    id: "party_a",
                    label: "Party A",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },
                {
                    id: "agreement_types",
                    label: "Agreement Type",
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
        .constant("screenerMasterlistConfigs", screenerMasterlistConfigs);
})();