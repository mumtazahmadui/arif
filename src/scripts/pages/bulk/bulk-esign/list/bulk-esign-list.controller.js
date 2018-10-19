// @ngInject
(function () {
    angular.module('app.bulk.esign')
        .controller('BulkEsignListController', BulkEsignListController);

    function BulkEsignListController($scope, $q, $modal, $state, side, BulkEsignService, modalsService, rfaFileDownload, appConfig) {
        angular.extend($scope, {
            loaded: false,
            selectedRFAs: $state.params.rfaIds,
            notificationText: 'Loading...',
            showTermsOfUse: showTermsOfUse,
            side: side,
            confirmAll: confirmAll,
            allConfirmed: {
                checked: false
            },
            viewDocument: viewDocument,
            getSelected: getSelected,
            downloadErrorsDocument: downloadErrorsDocument,
            setSignatureTextDate: setSignatureTextDate,
            proceed: proceed
        });
        $scope.$on('$viewContentLoaded', init());
        $scope.$watch('getSelected().length', function (value) {
            if (!value) {
                $scope.allConfirmed.checked = false;
            }
        });

        function showTermsOfUse() {
            modalsService.open({
                template: 'esign/modal/TermsOfUse',
                controller: 'TermsOfUse',
                class: 'terms-of-use'
            });
        }

        function viewDocument(rfaId) {
            modalsService.setPopupPosition();
            $modal.open({
                templateUrl: '/scripts/pages/bulk/bulk-esign/modal/rfa-viewer.html',
                controller: 'rfaViewer as viewer',
                resolve: {
                    rfaId: function () {
                        return rfaId;
                    },
                    rfaIdsList: function () {
                        return _.map($scope.amendments, function (amendment) {
                            return amendment.validRfaId
                        });
                    }
                },
                windowClass: 'rfa-viewer'
            });
        }

        function confirmAll() {
            _.each($scope.amendments, function (amendment) {
                amendment.selected = $scope.allConfirmed.checked;
            });
        }

        function getSelected() {
            return _.filter($scope.amendments, function (amendment) {
                return amendment.selected;
            });
        }

        function downloadErrorsDocument() {
            rfaFileDownload.downloadFile(appConfig.api_host + $scope.errorFile.replace('v1/', ''));
        }

        function setSignatureTextDate(rfa) {
            rfa.signTextDate = new Date();
        }

        function proceed() {
            $state.go('rfa.bulk.esign-sign', {
                rfas: getSelected()
            });
        }

        function init() {
            $scope.loaded = false;
            BulkEsignService.getSignatureDetails($scope.selectedRFAs).then(function (amendments) {
                var requestedLength = $scope.selectedRFAs ? $scope.selectedRFAs.split(',').length : 0;
                angular.extend($scope, {
                    errorFile: amendments.headers('error-location'),
                    amendments: amendments.data.data.rows,
                    nonEligibleCount: requestedLength - amendments.data.data.rows.length
                });
            })['finally'](function () {
                $scope.loaded = true;
            });
        }
    }
})();