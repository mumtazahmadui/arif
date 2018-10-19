/**
 * RFA E-Sign Sell Side
 * ### Used for:
 *
 *     RFA
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

// @ngInject
function rfaESignSellsideController(toastr,
                                    $scope,
                                    CredentialsService,
                                    documentsService,
                                    appConfig,
                                    $location,
                                    $stateParams,
                                    AmendmentLetter,
                                    modalsService,
                                    $interval,
                                    $filter,
                                    $window,
                                    $timeout,
                                    $q,
                                    $http
) {
    /* jshint validthis: true */

    $scope.loaded = false;
    $scope.notificationText = 'Loading...';
    $scope.PDFLink = documentsService.openFileForESign({
        amendmentId: $stateParams.amendmentId
    });
    $scope.PDFLinkClick = documentsService.openFileForESignClick({
        amendmentId: $stateParams.amendmentId
    });
    $scope.PDFLinkWet = documentsService.openFileForWSignConsolidated({
        amendmentId: $stateParams.amendmentId
    });
    $scope.showESignForm = false;
    $scope.userPermission = [];
    $scope.accepted = false;
    $scope.privewShown = false;
    $scope.saveChanges = saveChanges;
    $scope.showPreview = showPreview;
    $scope.loadSign = loadSign;
    $scope.companyName = '';
    $scope.esignImage = '';
    $scope.minZoom = 1;
    $scope.docsReaded = false;
    $scope.errorPdf = false;
    $scope.goBack = goBack;
    $scope.showTermsOfUse = showTermsOfUse;
    $scope.changeSignPlaceholders = changeSignPlaceholders;
    $scope.uploadSignedRFA = uploadSignedRFA;
    $scope.downloadRFA = downloadRFA;

    // Initial data
    var vm = this;
    vm.data = {};
    vm.imagetStack = [];
    vm.signatoryStyle = '';
    vm.signaturesPH = [];

    $scope.$on('$viewContentLoaded', init());
    $scope.$watch('vm.accepted', function () {
        if (!vm.accepted)
            return;
        initDate();
    });

    function initDate() {
        vm.data.date = new Date();
    }

    function saveChanges() {
        $scope.loaded = false;

        var data = {
            style: vm.data.esignStyle,
            contactNumber: vm.data.phone,
            title: vm.data.title,
            signText: vm.data.signText,
            date: vm.data.date,
            email: vm.data.mail,
            name: vm.data.name,
            companyName: vm.companyName,
            rfaId: $stateParams.amendmentId,
            placeholdersSigned: [],
            changeDates: {
                signatureDate: new Date()
            },
            sellSide: true
        };

        angular.extend(data.changeDates, vm.data.changeDates);

        vm.signaturesPH.forEach(function (value, index) {
            value && data.placeholdersSigned.push(index + 1);
        });

        AmendmentLetter.sign(data)
            .success(function () {
                $location.url('/rfa/company/amendmentLetter');
                $scope.loaded = true;
            })
            .error(function () {
                $scope.loaded = true;
            });
    }

    function showTermsOfUse() {
        if (!$scope.docsReaded) {
            return;
        }
        modalsService.open({
            template: 'esign/modal/TermsOfUse',
            controller: 'TermsOfUse',
            class: 'terms-of-use'
        });
    }

    function changeSignPlaceholders() {
        var oatleast = vm.atleastOnePlaceholders;
        vm.atleastOnePlaceholders = !!vm.signaturesPH.reduce(function (pre, item) {
            return item && pre + 1 || pre;
        }, 0);
        if (!oatleast && vm.atleastOnePlaceholders && vm.accepted) {
            showPreview();
        }
    }

    function showPreview() {
        $scope.privewShown=true;
        loadSign(1);
    }

    function goBack() {
        $window.history.back();
    }

    function loadSign(id) {
        if ($scope.privewShown) {
            vm.signatoryStyle = 'sign-style-' + id;
            vm.data.esignStyle = id;
            $scope.esignImage = appConfig.api_host +
                'signature/image?certifierName=' + encodeURIComponent(vm.data.name) +
                '&signatureStyle=' + vm.data.esignStyle +
                '&title=' + encodeURIComponent(vm.data.title || '') +
                '&emailId=' + (vm.data.mail || '') +
                '&signatureStamp=' + encodeURIComponent(vm.data.signText || '')
            ;
            if (vm.imagetStack.indexOf($scope.esignImage) === -1) {
                vm.imagetStack.push($scope.esignImage);
            }
        }
    }

    function showRealPDF() {
        AmendmentLetter.getAmendmentSignaturePlaceholers({amendmentLetterId: $stateParams.amendmentId}).then(function (signatures) {
            for (var i = 0; i < parseInt(signatures.data.bs_placeholder_count); i++) {
                vm.signaturesPH.push(false);
            }
        });
        $scope.docsReaded = true;
        $scope.errorPdf = true;
        $('#pdf-holder').html('<iframe src=\'' + $scope.PDFLink + '#view=FitH\' frameborder=\'0\' height=\'400\' width=\'100%\' scrolling=\'no\' style=\'overflow:hidden\'></iframe>');
        $scope.loaded = true;
    }

    function init() {
        $scope.loaded = false;

        vm.data.esignStyle = '1';
        vm.data.changeDates = {};

        vm.setAccepted = function (value) {
            this.accepted = value;
            if (value) {
                vm.changeDate('accept');
                vm.data.name = vm.data.originName;
                if (vm.atleastOnePlaceholders) {
                    showPreview();
                }
            } else {
                $scope.goBack();
            }
        };

        vm.setEsignDate = function () {
            $scope.eSignForm.date.$pristine = false;
            vm.changeDate('calendar');
        };

        vm.changeDate = function (item) {
            vm.data.changeDates[item + 'Date'] = new Date();
        };

        vm.checkIsError = function () {
            if (!$scope.docsReaded) {
                $scope.showError = true;
            }
        };

        CredentialsService.get().success(function (data) {
            vm.companyName = data.data.companyName;
            vm.data.name = '';
            vm.data.originName = data.data.fullName || '';
            vm.data.title = data.data.title || '';
            vm.data.phone = data.data.phone || '';
            vm.data.mail = data.data.email || '';
            $scope.userPermission = data.data.permissions;
        });

        // PDF
        $q.all([
            PDFJS.getDocument($scope.PDFLink),
            AmendmentLetter.getAmendmentSignaturePlaceholers({amendmentLetterId: $stateParams.amendmentId}),
        ]).then(function (results) {
            drawPdf(results[0], results[1], 'pdf-holder', '');
        }, function() {
            showRealPDF();
        });

        $('#pdf-holder').on('scroll', function () {
            if ($('#pdf-holder')[0].scrollHeight - 50 <= $('#pdf-holder').height() + $('#pdf-holder').scrollTop()) {
                $scope.$apply(function () {
                    $scope.docsReaded = true;
                });
            }
        });
        $scope.changeSignPlaceholders();
    };

    function drawPdf(pdf, signatures, selector, type) {
        var pagesCount = pdf.numPages;
        $scope['totalPages' + type] = pagesCount;
        for (var i = 0; i < pagesCount; i++) {
            showPage(pdf, i + 1, selector);
        }
        ;

        for (i = 0; i < parseInt(signatures.data.ss_placeholder_count); i++) {
            vm.signaturesPH.push(false);
        }

        $('#' + selector + ' canvas').css('zoom', $scope.minZoom);
        $timeout(function () {
            var canvas = $('canvas'),
                canvasFirst = canvas.first(),
                canvasCount = canvas.length,
                canvasZoom = canvasFirst.css('zoom') * 1,
                canvasWidth = canvasFirst.width(),
                canvasHeight = canvasFirst.height(),
                pdfHeight = canvasZoom * canvasHeight * canvasCount;
            // on long doc, cant accept and needed x-scroll || CPM-15807
            if ((pdfHeight < 400 && canvasZoom < 0.6) ||
                canvasWidth > $('#' + selector).width()) {
                canvas.css('zoom', '1');
                $('#' + selector).css('overflow-x', 'auto');
            }
            $scope.loaded = true;
        }, 100);

        if (vm.data.name)
            showPreview(type);

    }

    function showPage(pdf, Num, selector) {
        pdf.getPage(Num).then(function (page) {
            var viewport = page.getViewport(1);

            // Prepare canvas using PDF page dimensions
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            var scale = $(selector).width() / viewport.width;
            if (scale < $scope.minZoom) {
                $scope.minZoom = scale;
            }

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            page.render(renderContext);

            document.getElementById(selector).appendChild(canvas);
        });
    }

    function uploadSignedRFA() {
        return modalsService.open({
            template: 'dashboard/modal/upload-rfa/upload-rfa',
            controller: 'UploadRFA',
            controllerAs: 'vm',
            class: 'modal-mst-title',
            backdrop: 'static',
            data: {
                selectedRows: [{id: $stateParams.amendmentId}]
            }
        }).result.then(function () {
            //console.log('UploadRFAModalController done');
        });
    }

    function downloadRFA() {
        $scope.loaded = false;
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'amendmentLetters/actions/rfaid_pdf',
            data: {
                amendmentIds: [$stateParams.amendmentId],
                isDownloadable: true
            },
            responseType: 'arraybuffer'
        }).then(function (response) {
            var filename = "";
            var matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(response.headers('content-disposition'));
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            } else {
                filename = "download";
            }
            var blob = new Blob([response.data], {type: response.headers('content-type')});
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        }).finally(function () {
            $scope.loaded = true;
        });
    }
}

angular
    .module('app.controllers')
    .controller('RFAESignSellsideController', rfaESignSellsideController);
