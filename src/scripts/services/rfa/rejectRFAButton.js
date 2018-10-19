(function() {
    angular
        .module('app.services')
        .service('RejectRFAButton', [
        'AmendmentLetter',
        'modalsService',
        'ScreenerService',
        'toastr',
        '$q',
        'DoughnutService',
        function(AmendmentLetter, modalsService, ScreenerService, toastr, $q, DoughnutService) {
            /* jshint validthis: true */
            var rejectRFAReasonPopup = function(specificData, data) {
                var defer = $q.defer();

                var rejectionReasonModal = modalsService.open({
                    template: 'dashboard/modal/rejection-reason/rejection-reason',
                    controller: 'RejectionReason',
                    class: 'modal-rfa modal-rfa_type_rejectReason',
                    backdrop: 'static'
                });
                rejectionReasonModal.result.then(function(modalResult) {
                    AmendmentLetter.rejectionReason({
                        id: data.id,
                        reason: modalResult.reason
                    }).success(function() {
                        ScreenerService.set(specificData, true);
                        DoughnutService.update();
                    }).error(function() {
                        ScreenerService.set(specificData, true);
                        DoughnutService.update();
                    });

                    defer.resolve(true);
                }, function() {
                    defer.reject('Cancel');
                });

                return defer.promise;
            };

            return {
                run: rejectRFAReasonPopup
            };
        }]);
})();
