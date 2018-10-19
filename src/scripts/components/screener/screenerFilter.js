/**
 * Screener Table with wide functionality
 * @author IvanPanarin <ipanarin@luxoft.com>
 */

// @ngInject
function screenerFilter(ScreenerService, $compile, $filter, $rootScope,$timeout) {
    return {
        restrict: 'E',
        template: '<div ng-include="getContentUrl()"></div>',
        scope: {
            filter: '=data'
        },
        controller: function() {

        },
        link: function(scope) {

            if (scope.filter.value === undefined) {
                switch (scope.filter.default_value) {
                    case 'Anyone':
                        scope.filter.value = [];
                        break;
                    case 'All':
                        scope.filter.value = [];
                        scope.filter.view_value = 'All';
                        break;
                    default:
                        scope.filter.value = [scope.filter.default_value];
                        scope.filter.view_value = '';
                        break;
                }
            }

            scope.filter.opened = false;

            scope.getContentUrl = function() {
                return '/scripts/components/screener/filters/filter-types/' + scope.filter.type + '.html';
            };

            scope.updateFilter = function() {
                switch (scope.filter.type) {
                    case 'toggle':
                        scope.filter.view_value = scope.filter.value.join(', ');
                        break;
                    case 'search':
                        scope.filter.view_value = scope.filter.value.length ?
                            scope.filter.value.map(function(v) {return v.value ? v.value : v;}).join(', ')
                            : 'All';
                        break;
                    default:
                        break;
                }
            };

            scope.select = function(obj, clear) {
                $rootScope.$broadcast('remoteTasksWipe');
                if (clear) {
                    scope.filter.value = [];
                }

                if (scope.filter.type === 'toggle') {
                    scope.filter.value = scope.filter.value.indexOf(obj) > -1 ? [] : [obj];
                } else {
                    var index = -1;
                    scope.filter.value.some(function(v, k) {
                        if ((scope.filter.trackBy !== '' && v[scope.filter.trackBy] === obj[scope.filter.trackBy]) ||
                            v === obj) {
                            index = k;
                            return;
                        }
                    });
                    if (index > -1) {
                        scope.filter.value.splice(index, 1);
                    } else {
                        scope.filter.value.push(obj);
                    }
                }
                scope.updateFilter(scope.filter.type);
                scope.$parent.updateFilters();
            };

            scope.$on('remoteFilterSelect', function(event, data) {
                var remoteValue = '';
                if (data.filters.some(function(v) {
                    if (v.id === scope.filter.id) {
                        remoteValue = v.value;
                        return remoteValue;
                    }})
                ) {
                    if (scope.filter.data.length) {
                        scope.filter.data.some(function(v) {
                            var val = v.toLowerCase().replace(' ','');
                            if (val === remoteValue) {
                                remoteValue = v;
                                return remoteValue;
                            }
                        });
                    }
                    scope.select(remoteValue, true);
                }
            });

            scope.$on('handleClosed', function() {
                scope.filter.opened = false;
            });

            scope.checkSelected = function(obj) {
                return scope.filter.value.some(function(v) {
                    return (scope.filter.trackBy !== '' && v[scope.filter.trackBy] === obj[scope.filter.trackBy]) ||
                        v === obj;
                });
            };

            scope.handleOpen = function() {
                if (promise) $timeout.cancel(promise);
                var promise = $timeout( function(){
                    scope.filter.opened = !scope.filter.opened;
                    if (scope.filter.opened) {
                        scope.call('filterSearch', {filterName: scope.filter.id, query: scope.filter.search_value || ''});
                    }
                    promise = null;
                }, 500);

            };

            scope.handleClose = function() {
                scope.filter.opened = false;
            };

            scope.call = function(name, params) {
                scope.filter.loading = true;
                ScreenerService.call({
                    name: name,
                    params: params
                });
            };

            scope.clear = function() {
                ScreenerService.collapseAccordion();
                scope.filter.value = [];
                scope.filter.search_value = null;
                scope.updateFilter(scope.filter.type);
                scope.$parent.updateFilters();
                scope.call('filterSearch', {filterName: scope.filter.id, query: ''});
            };

            switch (scope.filter.type) {
                case 'toggle':
                    scope.call('filterSearch', {filterName: scope.filter.id, query: ''});
                    scope.width = Math.floor(12 / scope.filter.values.length);
                    break;
                case 'search':
                    if (scope.filter.id.indexOf('request_status') > -1) {
                        scope.call('filterSearch', {filterName: scope.filter.id, query: ''});
                    }
                    break;
                default:
                    break;
            }

            scope.updateFilter();
        }
    };
}

angular
    .module('app.directives')
    .directive('screenerFilter', screenerFilter);
