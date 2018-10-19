describe('Controller: bulkNtfToSignModalController', function () {
    var scope,
        q,
        mockedAmendmData,
        AmendmentLetter,
        CredentialsService,
        downloadService,
        bulkActionSubmit,
        mockedCtrlData,
        createController,
        controller,
        expect = chai.expect;

    beforeEach(function () {
        module('rfa.dashboard');
    });

    beforeEach(inject(function ($rootScope, $controller, _$q_) {
        scope = $rootScope.$new();
        q = _$q_;
        mockedAmendmData = {
            data: {
                rows: []
            }
        };
        AmendmentLetter = {
            getAmendmentLetters: function () {
                sinon.spy();
                var defer = q.defer();
                defer.resolve(mockedAmendmData);

                return defer.promise;
            }
        };
        CredentialsService = {
            getUsers: function () {
                sinon.spy();
                var defer = q.defer();
                defer.resolve({
                    data: []
                });

                return defer.promise;
            },
            hasPermission: sinon.spy()
        };
        downloadService = {
            'downloadFile': sinon.spy()
        };
        bulkActionSubmit = {
            ntfToSignatories: function () {
                sinon.spy();
                var defer = q.defer();
                defer.resolve({
                    data: []
                });

                return {
                    $promise: defer.promise
                };
            }
        };
        mockedCtrlData = {
            RFAs: ['213', '456', '8978']
        };
        createController = function () {
            var controller = $controller('bulkNtfToSignModalController', {
                '$scope': scope,
                'AmendmentLetter': AmendmentLetter,
                'CredentialsService': CredentialsService,
                'appConfig': {},
                'rfaFileDownload': downloadService,
                '$q': q,
                'bulkActionSubmit': bulkActionSubmit,
                'modalsService': {},
                'data': mockedCtrlData
            });
            scope.$digest();

            return controller;
        };

        controller = createController();
    }));

    xit('should define inner data', function () {
        controller.save();
    });

    xit('should have download file func', function () {
        expect(controller.downloadError).to.exist;
    });

    xit('download File should use service for download', function () {
        controller.downloadError();
        expect(downloadService.downloadFile.called).to.equal(true);
    });

    xit('should have checkEnabled func', function () {
        expect(controller.checkEnabled).to.exist;
        expect(controller.checkEnabled()).to.equal(0);
    });
});