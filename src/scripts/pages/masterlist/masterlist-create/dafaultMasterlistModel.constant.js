(function () {
    angular.module('rfa.components').constant('defaultMasterlistModel', [{
        fieldIdentifier: 'Agreement Type',
        attributeName: 'Agreement Type',
        alias: 'agreementType',
        showLabel: true,
        label: 'input',
        ableToHide: true,
        ableToOrder: false,
        required: true
    }, {
        fieldIdentifier: 'Reference Master Agreement Date',
        attributeName: 'Reference Master Agreement Date',
        alias: 'refMasterAgrmDate',
        showLabel: true,
        label: 'input',
        ableToHide: false,
        ableToOrder: false,
        required: true
    }, {
        fieldIdentifier: 'Investment Manager',
        attributeName: 'Investment Manager',
        alias: 'investmentManager',
        showLabel: true,
        label: 'input',
        ableToHide: false,
        ableToOrder: false,
        required: true
    }, {
        fieldIdentifier: 'Counterparty Name',
        attributeName: 'Counterparty Name',
        alias: 'cntptName',
        showLabel: true,
        label: 'placeholder',
        labelText: 'This field is used to identify counterparty top co',
        ableToHide: false,
        ableToOrder: false,
        required: true
    }, {
        fieldIdentifier: 'Masterlist Identifier',
        attributeName: 'Masterlist Identifier',
        alias: 'mastlId',
        showLabel: true,
        label: 'input',
        ableToHide: true,
        ableToOrder: false
    }, {
        attributeName: 'Sellside',
        showLabel: false,
        category: true,
        ableToHide: false,
        ableToOrder: false
    }, {
        fieldIdentifier: 'Party A True Legal Name',
        attributeName: 'Party A True Legal Name',
        alias: 'partyATrue',
        showLabel: true,
        label: 'input',
        ableToHide: true,
        ableToOrder: false,
        required: true
    }, {
        fieldIdentifier: 'Party A Pre-LEI/LEI',
        attributeName: 'Party A Pre-LEI/LEI',
        alias: 'partyAPre',
        showLabel: true,
        label: 'input',
        ableToHide: true,
        ableToOrder: false,
        fieldVisibility: 0,
        disabledShowHide: true
    }, {
        attributeName: 'Buyside Account (either True Legal Name or Client Identifier Is required)',
        showLabel: false,
        category: true,
        ableToHide: false,
        ableToOrder: false
    }, {
        fieldIdentifier: 'Party B True Legal Name',
        attributeName: 'Party B True Legal Name',
        alias: 'partyBTrue',
        showLabel: true,
        label: 'input',
        labelDependency: 'partyBClientId',
        ableToHide: true,
        ableToOrder: true
    }, {
        fieldIdentifier: 'Party B Client Identifier',
        attributeName: 'Party B Client Identifier',
        alias: 'partyBClientId',
        showLabel: true,
        label: 'input',
        labelDependency: 'partyBTrue',
        ableToHide: true,
        ableToOrder: true
    }, {
        fieldIdentifier: 'Party B Pre-LEI/LEI',
        attributeName: 'Party B Pre-LEI/LEI',
        alias: 'partyBPre',
        showLabel: true,
        label: 'input',
        ableToHide: true,
        ableToOrder: true
    }, {
        attributeName: 'Sleeve Account',
        showLabel: false,
        category: true,
        ableToHide: false,
        ableToOrder: false
    }, {
        fieldIdentifier: 'Sleeve True Legal Name',
        attributeName: 'Sleeve True Legal Name',
        alias: 'sleeveTrue',
        showLabel: true,
        label: 'input',
        ableToHide: true,
        ableToOrder: true
    }, {
        fieldIdentifier: 'Sleeve Client Identifier',
        attributeName: 'Sleeve Client Identifier',
        alias: 'sleeveClientId',
        showLabel: true,
        label: 'input',
        ableToHide: true,
        ableToOrder: true
    }]);
})();