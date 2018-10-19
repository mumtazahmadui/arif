(function () {
    'use strict';

    angular.module('app.bulk.exhibitValueUpload')
        .controller('exhibitValueUploadController', [
            '$scope',
            '$stateParams',
            '$state',
            'AmendmentLetter',
            'rfaFileDownload',
            'appConfig',
            '$modal',
            'ExhibitValueUploadService',
            'CredentialsService',
            '$window',
            exhibitValueUploadController
        ]);

    function exhibitValueUploadController(
        $scope,
        $stateParams,
        $state,
        AmendmentLetter,
        rfaFileDownload,
        appConfig,
        modal,
        ExhibitValueUploadService,
        CredentialsService,
        $window
    ) {
        var rfaIds = $stateParams.rfaIds,
            _showSuccessMessage = function () {
                var ml = modal.open({
                    templateUrl: '/scripts/pages/dashboard/modal/bulk-actions/common/bulk-completion-saving.html',
                    class: 'bulk-action-send small-popup modal-rfa',
                    backdropClass: 'white',
                    backdrop: 'static'
                });
                ml.result.then(function () {
                    $state.go('rfa.dashboard');
                }, function () {
                    $state.go('rfa.dashboard');
                });
            };

        var vm = this,
            init = function () {
                vm.loaded = false;
                AmendmentLetter.getAmendmentLetters({
                    ids: rfaIds,
                    action: "exhibit-value&validate"
                }).then(function (data) {
                    var res = data;
                    var result = data.data;
                    vm.loaded = true;
                    vm.items = result.data.rows;
                    if (result.errorCount > 0) {
                        vm.errorRFAs = res.headers('error-location');
                        vm.errorCount = result.errorCount;
                    } else {
                        vm.errorRFAs = '';
                        vm.errorCount = false;
                    }
                    vm.setSelectedIds();
                });
            },
            selectedCount = function () {
                var res = Object.keys(vm.selected).reduce(function (value, key) {
                    return vm.selected[key] ? ++value : value;
                }, 0);
                return res;
            },
            setSelectedIds = function () {
                vm.items.forEach(function (item) {
                    vm.selected[item.validRfaId] = item.validRfaId;
                }, this);
            },
            getActualIds = function () {
                return vm.items.map(function (item) {
                    return item.validRfaId;
                });
            },
            getSelectedIds = function () {
                return Object.keys(vm.selected).filter(function (key) {
                    return vm.selected[key];
                });
            },
            showPdfRfa = function (rfaId) {
                modal.open({
                    templateUrl: '/scripts/pages/bulk/bulk-esign/modal/rfa-viewer.html',
                    controller: 'rfaViewer as viewer',
                    resolve: {
                        rfaId: function () {
                            return rfaId;
                        },
                        rfaIdsList: function () {
                            return [];
                        }
                    },
                    windowClass: 'rfa-viewer'
                });
            },
            downloadError = function () {
                rfaFileDownload.downloadFile(appConfig.api_host + vm.errorRFAs.replace('/v1', ''));
            },
            showPdfError = function () {
                if (vm.uploadExists && vm.uploadExists.errorFileId) {

                    var companyId = CredentialsService.companyId(),
                        errorLink = 'company/' + companyId + '/files/download_file/' + vm.uploadExists.errorFileId;
                    rfaFileDownload.downloadFile(appConfig.api_host + errorLink);
                }
            },
            downloadPreview = function () {
                if (vm.uploadExists) {
                    CredentialsService.get().then(function (userData) {
                        var previewLink = 'company/' + userData.data.companyId + '/files/download_file/' + vm.uploadExists.fileId;
                        rfaFileDownload.downloadFile(appConfig.api_host + previewLink);
                    })
                }
            },
            complete = function () {
                if (vm.uploadExists) {
                    vm.loaderMessage = 'Saving Exhibit Value...';
                    vm.processing = true;
                    ExhibitValueUploadService.updateExhibit({
                        fileId: vm.uploadExists.fileId,
                        fileName: vm.uploadExists.fileName,
                        rfaIds: getSelectedIds()
                    }).then(function () {
                        vm.processing = false;
                        _showSuccessMessage();
                    });
                }
            },
            downloadTemplate = function () {
                AmendmentLetter.getDownloadExhibitTemplate(getSelectedIds()).then(function (res) {
                    rfaFileDownload.downloadFile(appConfig.api_host + res.headers('location').replace('/v1', ''));
                })
            },
            uploadExhibit = function () {
                var mod = modal.open({
                    templateUrl: '/scripts/pages/bulk/exhibit-value-upload/modal/exhibit-value-file-upload.html',
                    controller: 'ExhibitValueFileUploadModalController as ExValueFileUploadCtrl',
                    windowClass: 'modal-rfa',
                    resolve: {
                        data: function () {
                            return {
                                ids: getActualIds()
                            }
                        }
                    }
                });

                mod.result.then(function (data) {
                    vm.errorMessage = data.errorMessage;
                    vm.uploadExists = data;
                });
            };

        if (!(rfaIds instanceof Array)) rfaIds = [rfaIds];

        function back() {
            $window.history.back();
        }
        vm.loaderMessage = 'Loading...';
        vm.selectedCount = selectedCount;
        vm.downloadError = downloadError;
        vm.downloadTemplate = downloadTemplate;
        vm.uploadExhibit = uploadExhibit;
        vm.downloadPreview = downloadPreview;
        vm.showPdfRfa = showPdfRfa;
        vm.showPdfError = showPdfError;
        vm.setSelectedIds = setSelectedIds;
        vm.complete = complete;
        vm.back = back;
        vm.loaded = true;
        vm.selected = {};
        init();
    }
})();