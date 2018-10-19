(function () {
    angular.module('rfa.dashboard')
        .controller('bulkActionSendModalController', bulkActionSendController);

    function bulkActionSendController(data, appConfig, rfaFileDownload) {
        this.txt = data.txt;
        this.RFAs = data.RFAs;
        this.notEligibCount = data.notEligibCount;
        this.actionSent = false;
        this.downloadError = downloadError;
        if (data.link) {
            this.link = data.link.replace('/v1', '');
        }

        function downloadError() {
            rfaFileDownload.downloadFile(appConfig.api_host + this.link);
        }
    }
})();