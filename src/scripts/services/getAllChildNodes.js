angular
    .module('app.services')
    .factory('GetAllChildNodesService', [
        function() {
            return function getAllChildNodes(parent, nodes) {
                parent = parent || document;
                // add parent on first run
                nodes = nodes || [parent];

                var child = parent.firstChild;
                while (child) {
                    nodes.push(child);
                    if (child.hasChildNodes) {
                        getAllChildNodes(child, nodes);
                    }
                    child = child.nextSibling;
                }
                return nodes;
            };
        }]);
