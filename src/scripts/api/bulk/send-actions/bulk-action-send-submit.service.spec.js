describe('Service: bulkActionSubmit', function() {
    var CredentialsService, appConfig, bulkActionSubmit, expect = chai.expect;
    beforeEach(function() {
        module('rfa.dashboard');
        module(function($provide){
            CredentialsService = {
                userId: sinon.spy(),
                companyId: sinon.spy()
            };
            appConfig = {api_host: '/rest_api_host/'};
            $provide.service('CredentialsService', function(){
                return CredentialsService;
            });
            $provide.constant('appConfig', appConfig);
            $provide.value('$resource', function(url, params, options) {
                sinon.spy();

                return options;
            });
        });
    });

    beforeEach(inject(function(_bulkActionSubmit_){
        bulkActionSubmit = _bulkActionSubmit_;
    }));

    it('transformRequest in ntfToSignatories', function() {
        var mockedData = {
            option: 'test'
        };

        var returnedData = bulkActionSubmit.ntfToSignatories.transformRequest(mockedData);
        expect(JSON.parse(returnedData).data.option).to.equal(mockedData.option);
    });
});