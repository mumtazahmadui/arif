(function(){
    'use strict';

    angular.module('app.bulk', ['app.bulk.exhibitValueUpload', 'app.bulk.esign'])
        .config(function($stateProvider){
            $stateProvider
                .state('rfa.bulk', {
                    url: '/bulk',
                    abstract: true,
                    template: '<ui-view></ui-view>'
                })
            ;
        })
    ;
})();
