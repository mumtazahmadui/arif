xdescribe('controller: partyBEntitySelection.ctrl', function(){
    var $scope,
        ctrl,
        entities,
        entityService,
        sleeves,
        sleevesService,
        modificationFilter,
        $stateParams,
        modalsService;
    beforeEach(function(){
        module('partyABCreator');
    });
    beforeEach(inject(function($rootScope, $controller, $q){
        $scope = $rootScope.$new();
        $scope.inputData = {
            flow: 'sleeves',
            selectedPartyA: [{id:'10101010'}],
            selectPartyB:[],
            selectedSleeves:[],
            ignoreSleeveIndex:[],
            ignoreIndex: []
        };
        entities = [{id:'10101'},{id:'101010'}];
        entityService = {put: sinon.spy(function(){
            var promise = {
                    success: function(callback){callback({data:entities});return this;},
                    error: function(){},
                };
            return promise;
        })};
        sleeves = [{},{}];
        sleevesService = {getForEntities: sinon.spy(function(){
            return $q.when(sleeves);
        })};
        modificationFilter = {filter: sinon.spy()};
        $stateParams = {};
        modalsService = {open:sinon.spy()};
        $controller('partyBEntitySelection.ctrl as ctrl', {
            $scope: $scope,
            entityService: entityService,
            sleevesService: sleevesService,
            modificationFilter: modificationFilter,
            $stateParams: $stateParams,
            modalsService: modalsService
        });
        ctrl = $scope.ctrl;
        $scope.$digest();
    }));
    describe('method: toPartyB', function(){
        it('should check for existing sleeves if second argument is false and the flow is "sleeves"', function(){
            ctrl.toPartyB(entities[0], false);
            expect(sleevesService.getForEntities.args[0][0]).toEqual(entities[0].id);
            expect(sleevesService.getForEntities.args[0][1]).toEqual($scope.inputData.selectedPartyA[0].id);
            $scope.$digest();
            expect($scope.inputData.selectedSleeves.length).toEqual(1);
        });
    });
    describe('method: fromPartyB', function(){
        it('should remove corresponding sleeves from $scope.inputData.selectedSleeves', function(){
            ctrl.toPartyB(entities[0], false);
            $scope.$digest();
            expect($scope.inputData.selectedSleeves.length).toEqual(2);
            ctrl.fromPartyB($scope.inputData.selectPartyB[0]);
            expect($scope.inputData.selectedSleeves.length).toEqual(0);
        });
    });
});