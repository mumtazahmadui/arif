(function() {
    angular.module('app.controllers')
        .controller('TermsOfUseModalController', termsOfUseModalController);

    function termsOfUseModalController(
        $scope,
        appConfig,
        $modalInstance
    ) {
        $scope.pdfLink = appConfig.api_host + 'termsOfUse?version=1';
        $scope.loaded = false;

        PDFJS.getDocument($scope.pdfLink).then(function(pdf) {
            pdf.getPage(1).then(function(page) {
                var canvas = document.createElement('canvas');
                var container = $('#pdfContainer');
                var viewport = page.getViewport(1);

                // Prepare canvas using PDF page dimensions
                var context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = 450 < viewport.height ? 450 : viewport.height;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);

                container.append(canvas);
                $scope.loaded = true;
                $scope.$apply();
            });

        });

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    }
})();

