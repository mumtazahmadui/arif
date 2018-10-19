xdescribe('controller: rfaViewer', function(){
    var $scope, 
        $timeout, 
        rfaId, 
        rfaIdsList, 
        appConfig,
        ctrl;
    beforeEach(function(){
        module('ui.router','app.bulk.esign');
    });
    beforeEach(inject(function($rootScope, $controller){
        $scope = $rootScope.$new();
        $timeout = sinon.spy(function(callback){callback();});
        rfaId = '00101010';
        rfaIdsList = ['00101001','00101010','00101011'];
        appConfig = {api_host: 'rest-api-host/'};
        $controller('rfaViewer as viewer', {
            $scope: $scope,
            $timeout: $timeout, 
            rfaId: rfaId, 
            rfaIdsList: rfaIdsList, 
            appConfig: appConfig
        });
        ctrl = $scope.viewer;
    }));
    it('should set rfaId field to current RFA ID and src field to corresponding URL', function(){
        expect(ctrl.rfaId).toEqual(rfaId);
        expect(ctrl.src).toEqual('rest-api-host/amendmentLetters/'+rfaId+'/actions/rfaid_pdf');
    });
    describe('method: next', function(){
        it('should change rfaId field to next RFA ID and src field to corresponding URL if there is next RFA', function(){
            ctrl.next();
            expect(ctrl.rfaId).toEqual(rfaIdsList[2]);
            expect(ctrl.src).toEqual('rest-api-host/amendmentLetters/'+rfaIdsList[2]+'/actions/rfaid_pdf');
        });
        it('should do nothing if there is no next RFA', function(){
            ctrl.next();
            ctrl.next();
            expect(ctrl.rfaId).toEqual(rfaIdsList[2]);
            expect(ctrl.src).toEqual('rest-api-host/amendmentLetters/'+rfaIdsList[2]+'/actions/rfaid_pdf');
        });
    });
    describe('method: prev', function(){
        it('should change rfaId field to previous RFA ID and src field to corresponding URL if there is next RFA', function(){
            ctrl.prev();
            expect(ctrl.rfaId).toEqual(rfaIdsList[0]);
            expect(ctrl.src).toEqual('rest-api-host/amendmentLetters/'+rfaIdsList[0]+'/actions/rfaid_pdf');
        });
        it('should do nothing if there is no next RFA', function(){
            ctrl.prev();
            ctrl.prev();
            expect(ctrl.rfaId).toEqual(rfaIdsList[0]);
            expect(ctrl.src).toEqual('rest-api-host/amendmentLetters/'+rfaIdsList[0]+'/actions/rfaid_pdf');
        });
    });
});