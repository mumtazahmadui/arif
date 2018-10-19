describe("rfaFileDownload:Service", function(){
    beforeEach(module('rfa.components'));

    var service, rootScope;

    beforeEach(inject(function($injector, $rootScope){
        service = $injector.get('rfaFileDownload');
        rootScope = $rootScope;
    }));

    it("check is service works", function(done){
        var url = "about:blank",
            res = service.downloadFile(url);

        res.then(function(iframe){
            expect(iframe[0].src).toBe(url);
            done();
        });

        setTimeout(function(){
            rootScope.$digest();
        });

    });
});
