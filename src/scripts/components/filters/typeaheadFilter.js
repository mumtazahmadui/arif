// @ngInject
function typeahead() {
    /* jshint validthis: true */
    function escapeRegexp(queryToEscape) {
        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    return function(matchItem, query) {
        return query ? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
}

angular
    .module('app.filters')
    .filter('typeahead', typeahead);