describe("ExhibitValueUploadService:Service", function () {
    beforeEach(module("app"), module("app.services"));

    var service, http;

    beforeEach(inject(function ($rootScope, $httpBackend, ExhibitValueUploadService) {
        service = ExhibitValueUploadService;
        http = $httpBackend;
    }));

})