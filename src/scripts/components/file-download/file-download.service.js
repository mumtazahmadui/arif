(function(){
    angular.module('rfa.components')
        .service('rfaFileDownload', function($document, $q) {
            var iframe = false;
            var init = function() {
                if (iframe) {
                    return iframe;
                }

                iframe = angular.element('<iframe>');
                iframe.attr({
                    id: 'rfa.components.download.iframe',
                    src: ''
                });
                iframe.css({
                    width: 0,
                    height: 0,
                    display: 'none',
                    border: 'none'
                });

                $document
                    .find('body')
                    .append(iframe);

                return iframe;
            };

            var downloadFile = function(url) {
                var iframe = init();
                var defer = $q.defer();

                iframe.find('document').ready(function() {
                    defer.resolve(iframe);
                });

                iframe.attr({
                    src: url
                });

                return defer.promise;
            };

            return {
                downloadFile: downloadFile
            };
        }
    );
})();
