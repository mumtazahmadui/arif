/**
 * Service for broadcasting data beetween components
 * @author IvanPanarin <ipanarin@luxoft.com>
 */

// @ngInject
var broadcasting = function($rootScope) {
    var broadcast = {};
    broadcast.data = {};

    broadcast.prepForBroadcast = function(data) {
        this.data = data;
        this.broadcastItem();
    };

    broadcast.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return broadcast;
};

angular
    .module("app.services")
    .factory('broadcasting', broadcasting);