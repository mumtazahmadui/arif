/**
 * Task pending widget for dashboard
 * @author IvanPanarin <ipanarin@luxoft.com>
 */

// @ngInject
function tasksPending(ScreenerService, $rootScope, taskPendingConfigs, CredentialsService) {

    function taskTitle(task) {
        return taskPendingConfigs.titleLookup[task.id];
    }

    return {
        restrict: 'E',
        templateUrl: '/views/directives/TasksPending.html',
        scope: {
            ngModel: '='
        },
        link: function(scope) {
            scope.title = taskTitle(scope.ngModel);
            scope.value = scope.ngModel.value;
            scope.id = scope.ngModel.id;

            scope.screener = ScreenerService.get();

            scope.clearTasks = function() {
                scope.screener.task = null;
            };

            scope.$on('doughnutUpdate', function() {
                scope.screener = ScreenerService.get();
            });

            scope.$on('remoteTasksWipe', function() {
                scope.clearTasks();
            });

            scope.selectTask = function(input) {
                var task;
                switch (input) {
                    case 'pendingEsign':
                        task = 'Signature';
                        break;
                    case 'pendingExhibitComplete':
                        task = 'Exhibit Completion';
                        break;
                    case 'pendingResponse':
                        task = 'Response';
                        break;
                    case 'sendRFA':
                        task = CredentialsService.companyType() === 'BS' ?
                                'BS_SEND_RFA'
                                : 'SS_SEND_RFA';
                        break;
                    default:
                        task = null;
                        break;
                }

                $rootScope.$broadcast('remoteFiltersWipe');
                scope.screener.task = task;
                scope.screener.pages.page = 1;
                ScreenerService.set(scope.screener, true);
            };
        }
    };
}

angular
    .module('app.directives')
    .directive('tasksPending', tasksPending);
