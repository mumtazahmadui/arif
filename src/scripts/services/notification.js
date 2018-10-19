(function() {
    angular
        .module('app.services')
        .factory('notification', notification);

    if (typeof(String.prototype.startsWith) === 'undefined') {
        String.prototype.startsWith = function(str) {
            return this.slice(0, str.length) === str;
        };
    }

    function notification() {
        var responseInterceptor = {
            response: function(res) {
                if (res.data.toString() !== '[object Object]' && res.config.url.startsWith('/mc-web/rfa/v1/')) {
                    res.status = 500;
                }
                return res;
            }
        };

        return responseInterceptor;
    }
})();
