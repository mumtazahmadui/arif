(function() {
    angular.module('rfa.components')
        .constant('exhibitTemplateConfig', {
            editorNodeId: '#editor',
            notificationText: {
                loading: 'Loading...',
                Saving: 'Saving...'
            },
            columns: {
                perPage: 6,
                offset: 0
            },
            defaultTextSize: 10,
            defaultTextFont: 'Arial',
            datePinned: '<input id="date_pinned" readonly class="place-holder disabled display-none">',
            caretWrongPosition:  [
                'partyBRemovalCompiled',
                'partyARelationsCompiled',
                'partyBAdditionCompiled',
                'partyBExhibitValueChangeCompiled',
                'exhibit_value_changeCompiled',
                'fund_name_changeCompiled',
                'partyBFundNameChangeCompiled'
            ]
        });
})();