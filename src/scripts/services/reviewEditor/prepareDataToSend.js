(function() {
    angular
        .module('app.services')
        .service('prepareDataToSend', [
        function() {
            var rowTemplate = {
                'PARTYB_ID': 'partyBId',
                'Reason for Rejection/Pending': 'responseComments',
                'Sell Side Response': 'responseStatus',
                partyBExhibitValueChangeId: 'partyBExhibitValueChangeId',
                partyBFundNameChangeId: 'partyBFundNameChangeId'
            };
            var template = {
                "ssResponses": [],
                "responseType": "ADDITON_REMOVAL"
            };

            var prepareRows = function(row) {
                var result = {};
                angular.forEach(rowTemplate, function(item, key) {
                    result[item] = row[key]
                                    ? item === "responseComments" ? encodeURIComponent(row[key]) : row[key]
                                    : null;
                });
                return result;
            };

            var addDataToSsResponses = function(result, table) {
                var rows = table.rows;
                angular.forEach(rows, function(row) {
                    result.ssResponses.push(prepareRows(row));
                });
            };

            this.buildData = function(tables) {
                var result = angular.copy(template);
                angular.forEach(tables, addDataToSsResponses.bind(this, result));
                return result;
            };
        }]);
})();
