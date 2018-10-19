(function() {
    // @ngInject
    var screenerSSRFAConfigs = {
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
                {label:'Notification to Signatory', rfaIdValidation:false, partyBLevel:false, method:'notificationToSignatory', permissions: ['ss.rfa', 'ss.rfa.signatory']},
                {label:'Electronic Signature', rfaIdValidation:true, partyBLevel:false, method:'electronicSignature', permissions: ['ss.rfa.signatory']},
                {label:'Send RFA',rfaIdValidation:true, partyBLevel:false, method: 'sendRFA', permissions: ['ss.rfa', 'ss.rfa.signatory']},
                {label:'Notification to Onboarding', rfaIdValidation:false, partyBLevel:true, method:'notificationOnboarding', permissions: ['ss.rfa', 'ss.rfa.signatory','ss.rfa.onboarding','ss.rfa.kyc','ss.rfa.tax','ss.rfa.credit','ss.rfa.legal','ss.rfa.operations','ss.rfa.manager']},
                {label:'Notification to KYC', rfaIdValidation:false, partyBLevel:true, method:'notificationKyc', permissions: ['ss.rfa', 'ss.rfa.signatory','ss.rfa.onboarding','ss.rfa.kyc','ss.rfa.tax','ss.rfa.credit','ss.rfa.legal','ss.rfa.operations','ss.rfa.manager']},
                {label:'Notification to Tax',rfaIdValidation:false, partyBLevel:true, method:'notificationTax', permissions: ['ss.rfa', 'ss.rfa.signatory','ss.rfa.onboarding','ss.rfa.kyc','ss.rfa.tax','ss.rfa.credit','ss.rfa.legal','ss.rfa.operations','ss.rfa.manager']},
                {label:'Notification to Credit',rfaIdValidation:false, partyBLevel:true, method:'notificationCredit', permissions: ['ss.rfa', 'ss.rfa.signatory','ss.rfa.onboarding','ss.rfa.kyc','ss.rfa.tax','ss.rfa.credit','ss.rfa.legal','ss.rfa.operations','ss.rfa.manager']},
                {label:'Notification to Legal',rfaIdValidation:false, partyBLevel:true, method:'notificationLegal', permissions: ['ss.rfa', 'ss.rfa.signatory','ss.rfa.onboarding','ss.rfa.kyc','ss.rfa.tax','ss.rfa.credit','ss.rfa.legal','ss.rfa.operations','ss.rfa.manager']},
                {label:'Notification to Operations',rfaIdValidation:false, partyBLevel:true, method:'notificationOperations', permissions: ['ss.rfa', 'ss.rfa.signatory','ss.rfa.onboarding','ss.rfa.kyc','ss.rfa.tax','ss.rfa.credit','ss.rfa.legal','ss.rfa.operations','ss.rfa.manager']},
                {label:'Notification to Manager',rfaIdValidation:false, partyBLevel:true, method:'notificationManager', permissions: ['ss.rfa', 'ss.rfa.signatory','ss.rfa.onboarding','ss.rfa.kyc','ss.rfa.tax','ss.rfa.credit','ss.rfa.legal','ss.rfa.operations','ss.rfa.manager']},
                {label:'Download and Print', method: 'downloadAndPrint',rfaIdValidation:false, partyBLevel:false, permissions: ['ss.rfa', 'ss.rfa.signatory']},
                {label:'Upload Signed RFA', method: 'uploadSignedRFA',uploaded:true, rfaIdValidation:false, partyBLevel:false, permissions: ['ss.rfa', 'ss.rfa.signatory']},
                { label: 'Custom Notification', method: 'customNotification', rfaIdValidation: false, partyBLevel: true},
            ],
            filters: [
                {
                    id: 'agreement_date',
                    label: "REF. MASTER AGREEMENT DATE",
                    type: 'search',
                    needSearch: true,
                    default_value: 'All',
                    data: []
                },

                {
                    id: 'investment_manager',
                    label: 'Investment Manager',
                    type: 'search',
                    needSearch: true,
                    default_value: 'All',
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
                    id: "my_status",
                    label: 'My Status',
                    type: "search",
                    needSearch: true,
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
                    id: "masterlist_identifier",
                    label: "MASTERLIST IDENTIFIER",
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
                    id: 'addition_action',
                    label: 'Party B Actioned',
                    type: "search",
                    needSearch: true,
                    default_value: "All",
                    data: []
                },

                {
                    id: "request_status",
                    label: "REQUEST STATUS",
                    type: "search",
                    needSearch: false,
                    default_value: "All",
                    data: []
                }

/*                 {
                    id: 'party_b',
                    label: 'Party B Account',
                    type: 'search',
                    needSearch: true,
                    default_value: 'All',
                    data: []
                },

                

               

                {
                    id: 'review_status',
                    label: 'Review Status',
                    type: 'search',
                    needSearch: false,
                    default_value: 'All',
                    data: []
                } */
            ]
        }
    };

    angular
        .module('app.configs')
        .constant('screenerSSRFAConfigs', screenerSSRFAConfigs);
})();
