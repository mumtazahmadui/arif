(function() {

    var config = {
        titleLookup: {
            pendingExhibitComplete: 'Exhibit Completion',
            pendingResponse: 'Pending Response',
            pendingEsign: 'Electronic Signature',
            sendRFA: 'Send RFA'
        },
        allowedTasks: {
            sellSide: ['pendingResponse', 'pendingEsign', 'sendRFA'],
            buySide: ['pendingExhibitComplete', 'pendingEsign', 'sendRFA']
        }
    };

    angular
        .module('app.configs')
        .constant('taskPendingConfigs', config);
})();

