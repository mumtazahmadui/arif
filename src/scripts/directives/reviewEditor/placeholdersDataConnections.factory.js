(function () {
    angular.module('app.services').factory('placeholdersDataConnections', placeholdersDataConnections);

    function placeholdersDataConnections() {

        var vm = this;
        var RESPONSE_MAP = {
            'SLEEVE_ADDITION_TABLE': {
                'Accepted': ['Accepted', 'Rejected', 'Pending'],
                'Rejected': ['Rejected'],
                'Pending': ['Rejected', 'Pending']
            },
            'SLEEVE_REMOVAL_TABLE': {
                'Accepted': ['Accepted'],
                'Rejected': ['Rejected', 'Accepted']
            }
        };

        function getRows(prop) {
            return vm[prop];
        }

        function changeChildrenValues(placeholder, item, fn) {
            var foundItems = findChildren(placeholder, item);
            if (foundItems && foundItems.length) {
                foundItems.forEach(fn);
            }
        }
        
        function findChildren(placeholder, item) {
            var tableToFind;
            // setting which table is child
            if (placeholder === 'PARTYB_REMOVAL_TABLE') {
                tableToFind = 'SLEEVE_REMOVAL_TABLE';
            } else if (placeholder === 'PARTYB_ADDITION_TABLE') {
                tableToFind = 'SLEEVE_ADDITION_TABLE';
            } else {
                return false;
            }

            // now finding children
            var filtered;
            if (vm[tableToFind]) {
                filtered = vm[tableToFind].filter(function (row) {
                    return row['Party B True Legal Name'] === item['Party B True Legal Name'];
                });
            }
            return filtered;
        }

        function findParent(placeholder, item) {
            var tableToFind;
            // setting which table is parent
            if (placeholder === 'SLEEVE_REMOVAL_TABLE') {
                tableToFind = 'PARTYB_REMOVAL_TABLE';
            } else if (placeholder === 'SLEEVE_ADDITION_TABLE') {
                tableToFind = 'PARTYB_ADDITION_TABLE';
            } else {
                return false;
            }

            // now finding parent
            var filtered;
            if (vm[tableToFind]) {
                filtered = vm[tableToFind].filter(function (row) {
                    return row['Party B True Legal Name'] === item['Party B True Legal Name'];
                });
            }
            return filtered;
        }
        
        function isChildResponseAvailable(placeholder, item, response) {
            var foundItems = findParent(placeholder, item);

            if (foundItems && foundItems.length) {
                var parentAnswer = foundItems[0]['Sell Side Response'];
                if (!parentAnswer || !parentAnswer.length) {
                    return true;
                }
                return RESPONSE_MAP[placeholder][parentAnswer].indexOf(response) > -1;
            } else {
                return true;
            }
        }

        function isParentAnswered (placeholder, item) {
            var foundItems = findParent(placeholder, item);

            if (foundItems && foundItems.length) {
                return foundItems[0]['Sell Side Response'];
            } else {
                return true;
            }
        }

        function setRows(prop, rows) {
            vm[prop] = rows;
        }

        return {
            getRows: getRows,
            setRows: setRows,
            isChildResponseAvailable: isChildResponseAvailable,
            changeChildrenValues: changeChildrenValues,
            isParentAnswered: isParentAnswered
        };
    }
})();