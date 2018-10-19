(function () {
    // @ngInject

   

    var screenerRFAConfigs = {
        data: {
            title: 'Request for Amendment',
            tasks: {},
            pages: {},
            table: {
                template: 'amendments',
                desc: true,
                sortBy: 'Name',
                data: {}
            },
            actions: [
                {label:'Notification to Signatory',rfaIdValidation:false,partyBLevel:false, method:'notificationToSignatory', permissions: ['bs.rfa', 'bs.rfa.signatory']},
                {label:'Legal', rfaIdValidation:false, partyBLevel:true, method:'notificationBslegal', permissions: ['bs.rfa', 'bs.rfa.signatory','bs.rfa.desk1','bs.rfa.desk2']},
                {label:'Manager', rfaIdValidation:false, partyBLevel:true, method:'notificationBsManager', permissions: ['bs.rfa', 'bs.rfa.signatory','bs.rfa.desk1','bs.rfa.desk2']},
                {label:'Electronic Signature', rfaIdValidation:true,partyBLevel:false, method:'electronicSignature', permissions: ['bs.rfa.signatory']},
                {label:'Exhibit Value Upload', rfaIdValidation:true,partyBLevel:false, method:'exhibitValueUpload'},
                {label:'Send Notification Chaser', rfaIdValidation:true,partyBLevel:false, method: 'sendNotificationChaser'},
                {label:'Download and Print', method: 'downloadAndPrint',rfaIdValidation:false, partyBLevel:false},
                {label:'Upload Signed RFA', method: 'uploadSignedRFA',uploaded:true,rfaIdValidation:false, partyBLevel:false},
                {label:'Send RFA', method: 'sendRFA',rfaIdValidation:true, partyBLevel:false},
                {label: 'Custom Notification', method: 'customNotification', rfaIdValidation: false, partyBLevel: true },


            ],
            filters: [
                {
                    id: "agreement_date",
                    label: "REF. MASTER AGREEMENT DATE",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "masterlist_identifier",
                    label: "MASTERLIST IDENTIFIER",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "party_a",
                    label: "PARTY A",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "party_b",
                    label: "PARTY B TRUE / LEGAL NAME",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "party_b_client_identifier",
                    label: "PARTY B CLIENT IDENTIFIER",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "party_b_lei",
                    label: "PARTY B PRE-LEI / LEI",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "addition_action",
                    label: "PARTY B ACTIONED",
                    type: "search",
                    default_value: "All",
                    needSearch: true,
                    data: []
                },

                {
                    id: "request_status",
                    label: "REQUEST STATUS",
                    type: "search",
                    needSearch: false,
                    default_value: "All",
                    data: []
                },

                {
                    id: "rfa_id",
                    label: "RFA ID",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "agreement_type",
                    label: "AGREEMENT TYPE",
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },
                
                {
                    id: "submit_date",
                    label: "SUBMITTED DATE",
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
        .constant("screenerRFAConfigs", screenerRFAConfigs);
})();