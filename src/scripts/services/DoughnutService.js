// @ngInject
function doughnutService($rootScope) {
    /* jshint validthis: true */
    return {
        update: update,
        updated: updated
    };

    function update() {
        $rootScope.$broadcast('doughnutUpdate');
    }

    function updated(data) {
        $rootScope.$broadcast('doughnutUpdated', data);
    }
}

angular
    .module('app.services')
    .service('DoughnutService', doughnutService);
