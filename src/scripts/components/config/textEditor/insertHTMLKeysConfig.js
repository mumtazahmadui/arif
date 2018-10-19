(function() {
    angular
        .module('app.configs')
        .constant('insertHTMLKeysConfig', {
            partyARelations: {
                name: 'Party A Relation',
                alwaysExists: true,
                nonRemovable: true,
                once: true,
                template: [
                    [
                        'insertHTML',
                        '<input id=\"partyARelations\" unselectable=\"on\" readonly class=\"place-holder unselectable disabled\" value=\"&lt; Party A Relation &gt;\" />'
                    ]
                ]
            },
            partyBAddition: {
                name: 'Party B Addition',
                once: true,
                nonRemovable: true,
                template: [
                    [
                        'insertHTML',
                        '<input id=\"partyBAddition\" unselectable=\"on\" readonly class=\"place-holder unselectable disabled\" value=\"&lt; Party B Addition &gt;\" />'
                    ]
                ]
            },
            partyBRemoval: {
                name: 'Party B Removal',
                once: true,
                nonRemovable: true,
                template: [
                    [
                        'insertHTML',
                        '<input id=\"partyBRemoval\" unselectable=\"on\" readonly class=\"place-holder unselectable disabled\" value=\"&lt; Party B Removal &gt;\" />'
                    ]
                ]
            },
            partyBExhibitValueChange: {
                once: true,
                nonRemovable: true
            },
            partyBFundNameChange: {
                once: true,
                nonRemovable: true
            },
            fund_name_change: {
                name: 'Fund Name Change',
                once: true,
                template: [
                    [
                        'insertHTML',
                        '<input id=\"fund_name_change\" unselectable=\"on\" readonly class=\"place-holder unselectable disabled\" value=\"&lt; Fund Name Change &gt;\" />'
                    ]
                ]
            },
            exhibit_value_change: {
                once: true,
                name: 'Exhibit Value Change',
                template: [
                    [
                        'insertHTML',
                        '<input id=\"exhibit_value_change\" unselectable=\"on\" readonly class=\"place-holder unselectable disabled\" value=\"&lt; Exhibit Value Change &gt;\" />'
                    ]
                ]
            },
            bs_signature: {
                isIndexed: true,
                nonRemovable: true,
                name: 'Buyside Signature',
                value: '< Buyside Signature[{index}] >',
                template: [
                    [
                        'insertHTML',
                        '<input id=\"bs_signature[]\" unselectable=\"on\" readonly class=\"place-holder unselectable disabled\" value=\"&lt; Buyside Signature[] &gt;\" index="1" />'
                    ]
                ]
            },
            ss_signature: {
                isIndexed: true,
                nonRemovable: true,
                name: 'Sellside Signature',
                value: '< Sellside Signature[{index}] >',
                template: [
                    [
                        'insertHTML',
                        '<input id=\"ss_signature[]\" unselectable=\"on\" readonly class=\"place-holder unselectable disabled\" value=\"&lt; Sellside Signature[] &gt;\" index="1" />'
                    ]
                ]
            }
        });
})();
