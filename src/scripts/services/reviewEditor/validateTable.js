(function() {
    angular
        .module('app.services')
        .service('validataTable', ['placeholdersDataConnections',
        function(placeholdersDataConnections) {
            var status = ['Rejected', 'Pending'];
            var result = true;
            var sleeveResult = true;

            var checkReason = function(str) {
                return 0 < str.length && str.length < 501;
            };

            var checkRow = function(row) {
                if (-1 !== _.indexOf(status, row['Sell Side Response']) && result) {
                    result = row['Reason for Rejection/Pending'] ?
                        checkReason(row['Reason for Rejection/Pending'])
                        : false;
                }
            };

            var checkParentAnswer = function (table) {
                if (table.rows && table.rows.length) {
                    table.rows.forEach(function (row) {
                        if (sleeveResult && row['Sell Side Response']) {
                            sleeveResult = placeholdersDataConnections.isParentAnswered(table.placeHolderType, row);
                        }
                    });
                }
            };

            var checkRows = function(table) {
                angular.forEach(table.rows, checkRow);
            };

            this.validateSleeve = function (tables) {
                sleeveResult = true;
                angular.forEach(tables, checkParentAnswer);
                return sleeveResult;
            };

            this.validate = function(tables) {
                result = true;
                angular.forEach(tables, checkRows);
                return result;
            };
        }]);
})();
