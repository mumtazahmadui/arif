(function() {
    angular.module('app.configs')
        .constant('replaceHoldersConfig', [{
            holder: 'partyBAddition',
            directive: 'party-b-additional-table'
        }, {
            holder: 'sleeveAddition',
            directive: 'party-b-additional-sleeve-table'
        }, {
            holder: 'sleeveRemoval',
            directive: 'party-b-removal-sleeve-table'
        }, {
            holder: 'partyBRemoval',
            directive: 'party-b-removal-table'
        }, {
            holder: 'partyARelations',
            directive: 'party-a-relations'
        }, {
            holder: 'exhibit_value_change',
            directive: 'party-b-exhibit-value-change'
        }, {
            holder: 'fund_name_change',
            directive: 'party-b-fund-name-change'
        }, {
            holder: 'date_place_holder',
            directive: 'date-pinned'
        }, {
            holder: 'bs_signature',
            directive: 'signature',
            isIndex: true
        }, {
            holder: 'ss_signature',
            directive: 'signature',
            isIndex: true
        }]);
})();
