// @ngInject
(function(){
    angular.module('app.bulk.esign')
        .controller('rfaViewer', rfaViewer);
    function rfaViewer($scope, $timeout, rfaId, rfaIdsList, appConfig) {
        var vm = this,
            currentIndex;
        angular.extend(vm, {
            rfaId: rfaId,
            hasNext: hasNext,
            hasPrev: hasPrev,
            next: next,
            prev: prev
        });
        vm.src = getSrc();
        currentIndex = getCurrentIndex();

        getPdf();

        function getPdf() {
            vm.loading = true;
            currentIndex = getCurrentIndex();
            $(document).find('#pdf-holder').html('');
            PDFJS.getDocument(getSrc()).then(function(results) {
                var pdf = results,
                    pagesCount = pdf.numPages,
                    i;
                $scope.totalPages = pagesCount;
                for (i = 0; i < pagesCount; i++) {
                    showPage(pdf, i + 1);
                }

                $('#pdf-holder canvas').css('zoom', $scope.minZoom);
                $timeout(function() {
                    var canvas = $('canvas'),
                        canvasFirst = canvas.first(),
                        canvasCount = canvas.length,
                        canvasZoom = canvasFirst.css('zoom') * 1,
                        canvasWidth = canvasFirst.width(),
                        canvasHeight = canvasFirst.height(),
                        pdfHeight = canvasZoom * canvasHeight * canvasCount;
                    // on long doc, cant accept and needed x-scroll || CPM-15807
                    if ((pdfHeight < 400 && canvasZoom < 0.6) ||
                        canvasWidth > $('#pdf-holder').width()) {
                        canvas.css('zoom', '1');
                        $('#pdf-holder').css('overflow-x','auto');
                    }
                    vm.loading = false;
                },100);
            });
        }

        function showPage(pdf, Num) {
            pdf.getPage(Num).then(function(page) {
                var viewport = page.getViewport(1);

                // Prepare canvas using PDF page dimensions
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                //IE10 fix for set pixel points in canvas
                if(window.CanvasPixelArray && !CanvasPixelArray.set) {
                    CanvasPixelArray.prototype.set = function(arr) {
                        var l=this.length, i=0;

                        for(;i<l;i++) {
                            this[i] = arr[i];
                        }
                    };
                }

                var scale = $('#pdf-holder').width() / viewport.width;
                if (scale < $scope.minZoom) {
                    $scope.$apply(function() {
                        $scope.minZoom = scale;
                    });
                }
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);

                document.getElementById('pdf-holder').appendChild(canvas);
                $('#pdf-holder canvas').css('zoom', $scope.minZoom < 1 ? 1 : $scope.minZoom);
            });
        }


        function getCurrentIndex() {
            return _.indexOf(rfaIdsList, vm.rfaId);
        }
        function hasNext() {
            return currentIndex < (rfaIdsList.length-1);
        }
        function hasPrev() {
            return currentIndex > 0;
        }
        function getSrc() {
            return appConfig.api_host+'amendmentLetters/'+vm.rfaId+'/actions/rfaid_pdf';
        }
        function next() {
            $(".btn").blur(); 
            if (!hasNext()) {
                return;
            }
            vm.rfaId = rfaIdsList[currentIndex+1];
            getPdf();
        }
        function prev() {
            $(".btn").blur();
            if (!hasPrev()) {
                return;
            }
            vm.rfaId = rfaIdsList[currentIndex-1];
            getPdf();
        }
    }
})();