(function() {

    angular.module('app.directives')
        .controller('exhibitTableController', [
            '$scope', '$base64', 'AmendmentLetter', '$stateParams', 'tableWithLineBreaks', '$rootScope', '$sce',
        function($scope, $base64, AmendmentLetter, $stateParams, tableWithLineBreaks, $rootScope, $sce) {
            $scope.exhibitTable = [[]];
            $scope.exhibitTextContent = '';
            $scope.exhibitHTMLContent = '';

            $scope.queueService.addTask(load, render);
            $scope.trustAsHtml = function(string) {
                return $sce.trustAsHtml(string);
            };
            function load() {
                return AmendmentLetter
                    .getExhibit({
                        exhibitId: $stateParams.exhibitId,
                        amendmentId: $stateParams.contentId
                    });
            }

            $scope.showCell = function (key, index, table, item) {
                if (key.splitter) {
                    return false;
                }
                if (index <= table.INDEX_OF_LAST_UNMERGED_COLUMN) {
                    return true;
                }
                return item.rowspan !== 0;
            };

            $scope.getRowspan = function (index, table, item) {
                if (index <= table.INDEX_OF_LAST_UNMERGED_COLUMN) {
                    return 1;
                }
                return item.rowspan;
            };

            function render(data) {
                $scope.exhibitHTMLContent = decodeURIComponent($base64.decode(data.exhibitHTMLContent));
                $scope.exhibitTextContent = decodeURIComponent($base64.decode(data.exhibitTextContent));
                $scope.exhibitTable = tableWithLineBreaks.createTableData(data);
                // ExhibitRenderer.setExhibitRenderedData(angular.element('#exhibitTable').html());
            }
        }])
        // .service('ExhibitRenderer', ExhibitRenderer);

        // function ExhibitRenderer($scope){
        //     $scope.renderedData = '';

        //     function setExhibitRenderedData(data){
        //         $scope.renderedData = data;
        //     } 

        //     function getExhibitRenderedData(data){
        //         return $scope.renderedData;
        //     } 
                
        // }

})();
