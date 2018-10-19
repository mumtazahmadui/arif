(function() {
    angular.module('app.services').constant('app.services.placeholdersConfig', {
        'partyARelations': {
            endpoint: 'partyAPlaceHolder',
            id: 'partyARelations',
            isReplace: false,
            directiveName: 'mc-party-a-relations-pl',
            provider: 'app.placeholders.relationDataProvider',
            dataType: 'relation',
            content: '<input id="partyARelations" readonly="" class="place-holder disabled" value="Party A Relation">'
        },
        'datePinned': {
            endpoint: 'datePinnedPlaceHolder',
            id: 'datePinned',
            isReplace: false,
            directiveName: 'data-pinned-pl',
            provider: 'app.placeholders.tableDataProvider',
            dataType: 'table'
        },
        'partyBAddition': {
            endpoint: 'partyBAdditionPlaceHolder',
            isReplace: true,
            id: 'partyBAddition',
            directiveName: 'party-b-tables-pl',
            provider: 'app.placeholders.tableDataProvider',
            content: '<input id="partyBAddition" readonly class="place-holder disabled" value="< Party B Addition >">',
            dataType: 'table'
        },
        'sleeveAddition': {
            endpoint: 'sleeveAdditionPlaceHolder',
            isReplace: true,
            id: 'sleeveAddition',
            directiveName: 'party-b-sleeve-tables-pl',
            provider: 'app.placeholders.tableDataProvider',
            content: '<input id="sleeveAddition" readonly class="place-holder disabled" value="< Sleeve Addition >">',
            dataType: 'table'
        },
        'partyBRemoval': {
            endpoint: 'partyBRemovalPlaceHolder',
            isReplace: true,
            id: 'partyBRemoval',
            directiveName: 'party-b-tables-pl',
            provider: 'app.placeholders.tableDataProvider',
            content: '<input id="partyBRemoval" readonly class="place-holder disabled" value="< Party B Removal >">',
            dataType: 'table'
        },
        'sleeveRemoval': {
            endpoint: 'sleeveRemovalPlaceHolder',
            isReplace: true,
            id: 'sleeveRemoval',
            directiveName: 'party-b-sleeve-tables-pl',
            provider: 'app.placeholders.tableDataProvider',
            content: '<input id="sleeveRemoval" readonly class="place-holder disabled" value="< Sleeve Removal >">',
            dataType: 'table'
        },
        'exhibit_value_change': {
            endpoint: 'partyBExhibitValueChangePlaceHolder',
            isReplace: true,
            id: 'exhibit_value_change',
            directiveName: 'party-b-tables-pl',
            provider: 'app.placeholders.tableDataProvider',
            content: '<input id="exhibit_value_change" readonly class="place-holder disabled" value="< Party B Addition >">',
            dataType: 'table'
        },
        'fund_name_change': {
            endpoint: 'partyBFundNameChangePlaceHolder',
            isReplace: true,
            id: 'fund_name_change',
            directiveName: 'party-b-tables-pl',
            provider: 'app.placeholders.tableDataProvider',
            content: '<input id="fund_name_change" readonly class="place-holder disabled" value="< Party B Removal >">',
            dataType: 'table'
        }
    });
}());
