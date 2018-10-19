(function(){
    angular
        .module('app.services')
        .factory('isParent', function() {
            return function(p, o) {
                if (o && o.parentNode) {
                    var el = o.parentNode;
                    do {
                        if (el === p) {
                            return true;
                        }
                    } while(el = el.parentNode);
                }
                return false;
            };
        });
})();