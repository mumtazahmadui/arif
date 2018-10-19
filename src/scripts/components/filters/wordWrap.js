(function(){
    // @ngInject
    function wordWrap() {
        return function(long, truncateTo) {
            if(!!long){
                if(long.length > truncateTo){
                    var parts = [],
                        word,
                        wordBreaker;
                    wordBreaker = "\n\r";
                    while(long.length){
                        word = long.slice(0, (truncateTo || 30));
                        long = long.slice(truncateTo || 30,long.length);
                        parts.push(word);
                    }
                    return parts.join(wordBreaker);
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
        .filter('wordwrap', wordWrap);
})();