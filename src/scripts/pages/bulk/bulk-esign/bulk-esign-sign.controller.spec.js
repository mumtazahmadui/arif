describe('controller: BulkEsignSignController', function(){
    var $scope, 
        $q, 
        $location, 
        user,
        rfas,
        BulkEsignService, 
        modalsService, 
        $modal,
        appConfig;
    beforeEach(function(){
        module('ui.router');
        module('app.bulk.esign');        
    });
    beforeEach(inject(function($rootScope, $controller, _$q_){
        $q = _$q_;
        $scope = $rootScope.$new();
        $location = {path:sinon.spy()};
        rfas = [{validRfaId:'101'},{validRfaId:'102'}];
        user={};
        BulkEsignService = {sign: sinon.spy($q.when)};
        modalsService = {open:sinon.spy(), setPopupPosition: sinon.spy()};
        $modal = {open:sinon.spy(function(){return {result:$q.reject()};})};
        appConfig = {api_host: 'rest_api_host'};
        $controller('BulkEsignSignController as vm', {
            $scope: $scope,
            $location: $location, 
            user: user,
            rfas: rfas,
            appConfig: appConfig,
            BulkEsignService: BulkEsignService, 
            modalsService: modalsService,
            $modal: $modal
        });
    }));
    it('should set rfas scope field from dependency', function(){
        expect($scope.rfas).toEqual(rfas);
    });
    it('should set data.date in scope to current date when accepted field changes to true', function(){
        $scope.vm.accepted = true;
        $scope.$digest();
        expect($scope.vm.data.date).toEqual(jasmine.any(Date));
    });
    describe('method: setAccepted', function(){
        it('should set previewVisible scope field to true and load a signature image if argument is true', function(){
            $scope.vm.setAccepted(true);
            expect($scope.previewVisible).toBe(true);
            expect($scope.esignImage).toBeTruthy();
        });
        it('should go to home page if argument is false', function(){
            $scope.vm.setAccepted(false);
            expect($location.path.calledOnce).toBe(true);
        });
    });
    describe('scope method: showPreview', function(){
        it('should set previewVisible scope field to true and load a signature image if argument is true', function(){
            $scope.showPreview();
            expect($scope.previewVisible).toBe(true);
            expect($scope.esignImage).toBeTruthy();
        });
    });
    describe('scope method: showTermsOfUse', function(){
        it('should open terms of use modal', function(){
            $scope.showTermsOfUse();
            expect(modalsService.open.calledOnce).toBe(true);
        });
    });
    describe('scope method: saveChanges', function(){
        it('should call BulkEsignService.sign with signature, rfas and user data and then show success message and return to home page', function(){
            $scope.showPreview();
            $scope.saveChanges();
            expect(BulkEsignService.sign.calledOnce).toBe(true);
            expect(BulkEsignService.sign.args[0][0]).toEqual(rfas);
            expect(BulkEsignService.sign.args[0][1].signStyle).toEqual(1);
            expect(BulkEsignService.sign.args[0][2]).toEqual(user);
            $scope.$digest();
            expect($modal.open.calledOnce).toBe(true);
            expect($location.path.calledOnce).toBe(true);
        });
    });
});