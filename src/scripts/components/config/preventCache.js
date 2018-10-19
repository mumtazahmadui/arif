(function() {
    angular
        .module('app.configs')
        .config(['$httpProvider',preventCache]);
    function preventCache($httpProvider) {
        navigator.sayswho = (function() {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem != null) {
                    return tem.slice(1).join(' ').replace('OPR', 'Opera');
                }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
            }
            return M.join(' ');
        })();

        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
            $httpProvider.defaults.headers.get.Accept = 'application/json';
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
        $httpProvider.interceptors.push('notification');
        $httpProvider.interceptors.push('ie9fix');
    }
})();
