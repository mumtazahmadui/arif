(function(){
    // @ngInject
    function truncate() {
        return function(long, truncateTo) {
            if(!!long){
                if(long.length > truncateTo){
                    return long.slice(0, (truncateTo || 30)) + "...";
                }
                else{
                    return long;
                }
            }
            else{
                return long;
            }

        };
    }

    angular
        .module('app.filters')
        .filter('truncate', truncate);
})();