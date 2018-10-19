(function() {
    angular
        .module('app.configs')
        .constant('tableReviewEditorConfig', {
            hide: {
                BS: ['Sell Side Response', 'Reason for Rejection/Pending'],
                SS: []
            },
            noborders: {
                BS: ['Buyside Comments', 'Sell Side Response', 'Reason for Rejection/Pending'],
                SS: ['Buyside Comments', 'Sell Side Response', 'Reason for Rejection/Pending']
            }
        });
})();
