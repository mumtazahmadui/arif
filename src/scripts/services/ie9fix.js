(function(){
    angular
        .module('app.services')
        .factory('ie9fix', ie9fix);

    function ie9fix() {

        function isIE () {
            var myNav = navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
        }

        if (typeof(String.prototype.startsWith) === 'undefined') {
            String.prototype.startsWith = function(str) {
                return this.slice(0, str.length) === str;
            };
        }

        var responseInterceptor = {
            response: function(res){
                if (res.data.toString() !== '[object Object]' && isIE() === 9 && res.config.url.startsWith('/mc-web/rfa/v1/')) {
                    var data = res.data;
                    data = angular.fromJson(data.map(function(code){
                        return String.fromCharCode(code);
                    }).join(''));
                    res.data = data;
                }
                return res;
            }
        };

        return responseInterceptor;
    }
})();