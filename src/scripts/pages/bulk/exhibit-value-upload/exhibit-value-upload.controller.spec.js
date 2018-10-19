describe("exhibitValueUploadController:Controller", function () {

    var $q,
        $scope,
        $controller,
        evuController,
        AmendmentLettersSpy,
        rfaFileDownloadSpy,
        ExhibitValueUploadService,
        modalSpy,
        stateSpy;

    /* mock data */
    var validRows = [{
            validRfaId: 10
        },
        {
            validRfaId: 12
        }
    ]


    function createNewControllerInstance() {
        evuController = $controller("exhibitValueUploadController", {
            $scope: $scope,
            $stateParams: {
                rfaIds: [10, 11, 12]
            },
            AmendmentLetter: AmendmentLettersSpy,
            rfaFileDownload: rfaFileDownloadSpy,
            $modal: modalSpy,
            $state: stateSpy,
            $window: {},
            CredentialsService: {
                get: function () {
                    return $q.when({
                        data: {
                            companyId: 1
                        }
                    });
                }
            }
        });
    }

    beforeEach(module("app"), module("app.bulk.exhibitValueUploadr"));

    beforeEach(inject(function ($injector, $rootScope, _$controller_, _$q_, _ExhibitValueUploadService_) {
        $q = _$q_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        ExhibitValueUploadService = _ExhibitValueUploadService_;

        AmendmentLettersSpy = {
            getAmendmentLetters: function (hoho) {
                return $q.when({
                    data: {
                        rows: validRows
                    }
                });
            }

        };

        stateSpy = {
            go: sinon.spy()
        };

        modalSpy = {
            open: function () {
                return {
                    result: $q.when({
                        fileId: 100500
                    })
                }
            }
        };

        rfaFileDownloadSpy = {
            downloadFile: sinon.spy()
        };
    }));

    xit("Checking, is contrller initialized", function () {
        var p = $q.defer();
        AmendmentLettersSpy.getAmendmentLetters = sinon.spy(function () {
            return p.promise;
        });
        createNewControllerInstance();
        p.resolve({
            data: {
                data: {
                    rows: validRows
                }
            }
        });
        expect(AmendmentLettersSpy.getAmendmentLetters.calledOnce).toBe(true);
        $scope.$digest();
    });

    xit("Checking selected count", function () {
        createNewControllerInstance();
        // $scope.$digest();
        expect(evuController.selectedCount()).toBe(0);
    });

    xit("Checking is error file download", function () {
        createNewControllerInstance();
        // $scope.$digest();
        evuController.errorRFAs = 'dsad';
        evuController.downloadError();
        expect(rfaFileDownloadSpy.downloadFile.calledOnce).toBe(true);
    });

    xit("Checking is download template", function () {
        AmendmentLettersSpy.getDownloadExhibitTemplate = sinon.spy(function () {
            return {
                then: sinon.spy(function (f) {
                    f({
                        headers: sinon.stub().returns('daa')
                    })
                })
            }
        })
        createNewControllerInstance();
        evuController.downloadTemplate();
        expect(rfaFileDownloadSpy.downloadFile.calledOnce).toBe(true);
    });

    xit("Checking is download preview", function () {
        createNewControllerInstance();
        evuController.uploadExhibit();
        evuController.downloadPreview();
        expect(rfaFileDownloadSpy.downloadFile.calledOnce).toBe(true);
    });

    xit("Checking is complete done", function () {
        createNewControllerInstance();
        evuController.uploadExhibit();
        $scope.$digest();
        var p = $q.defer();
        ExhibitValueUploadService.updateExhibit = sinon.spy(function () {
            return p.promise
        });
        p.resolve({});
        evuController.complete();
        $scope.$digest();
        expect(ExhibitValueUploadService.updateExhibit.calledOnce).toBe(true);
    });
});