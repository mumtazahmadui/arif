describe('Controller: bulkActionSendModalController', function () {
    var scope,
        expect = chai.expect,
        mockedData,
        downloadService,
        createController,
        controller;

    beforeEach(function() {
        module('rfa.dashboard');
    });

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        mockedData = {
            'txt': 'testTxt',
            'RFAs': ['123', '456', '789'],
            'validationAction': 'send'};
        downloadService = {
            'downloadFile': sinon.spy()
        };
        createController = function() {
            var controller = $controller('bulkActionSendModalController', {
                'data': mockedData,
                'appConfig': {},
                'rfaFileDownload': downloadService
            });
            scope.$digest();

            return controller;
        };

        controller = createController();
    }));

    it('should define inner data', function() {
        expect(controller.txt).to.equal(mockedData.txt);
        expect(controller.RFAs).to.equal(mockedData.RFAs);
    });

    it('should have download file func', function() {
        expect(controller.downloadError).to.exist;
    });

    it('download File should use service for download', function() {
        controller.downloadError();
        expect(downloadService.downloadFile.called).to.equal(true);
    });
    
});