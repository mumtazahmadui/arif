(function(){
    'use strict';

    angular.module('app.bulk.exhibitValueUpload')
        .controller('ExhibitValuePdfErrorController', [
            '$scope',
            'content',
            'appConfig',
            '$http',
            ExhibitValuePdfErrorController
        ])
    ;    


    function ExhibitValuePdfErrorController($scope, content, appConfig, $http){
        var vm = this;
        $http.get("images/rfa_demo.pdf", {responseType: "arraybuffer"}).then(function(data){
            vm.content = data.data;
        });

    }
})();
