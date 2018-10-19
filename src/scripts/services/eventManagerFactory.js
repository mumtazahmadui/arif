(function() {
    var rootScope;

    function eventManager() {
        this.events = {};
    }

    eventManager.prototype.triggerEvent = function(eventName, value) {
        var event = this.events[eventName];
        if (!event) {
            return this;
        }

        var res = rootScope.$broadcast(eventName, value);
        if (res.defaultPrevented) {
            return false;
        }

        if (res.result !== undefined) {
            return res.result && event(value);
        }

        return event(value);
    };

    eventManager.prototype.on = function(eventName, handler) {
        if (handler) {
            this.events[eventName] = handler;
        }
        return this;
    };

    eventManager.prototype.off = function(eventName) {
        delete this.events[eventName];
        return this;
    };

    angular.module('app.services')
        .factory('eventManagerFactory', function($rootScope) {
            rootScope = $rootScope;
            return eventManager;
        });
})();
