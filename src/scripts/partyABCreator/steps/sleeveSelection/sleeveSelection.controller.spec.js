describe('controller: sleeveSelection.ctrl', function(){
    var $scope,
        ctrl,
        sleeves,
        $stateParams,
        sleevesService;
    beforeEach(function(){
        module('partyABCreator');
    });
    beforeEach(inject(function($rootScope, $controller, $q){
        $scope = $rootScope.$new();
        sleeves = [{id:'10101'},{id:'101010'}];
        sleevesService = {search: sinon.spy(function(){
            return $q.when(sleeves);
        })};
        $scope.inputData = {
            flow: 'sleeves',
            selectedPartyA: [{id:'10101010'}],
            selectPartyB:[],
            selectedSleeves:[],
            ignoreSleeveIndex:[]
        };
        $stateParams = {};
        $controller('sleeveSelection.ctrl as ctrl', {
            $scope: $scope,
            sleevesService: sleevesService,
            $stateParams: $stateParams
        });
        ctrl = $scope.ctrl;
        $scope.$digest();
    }));
    it('should search for sleeves with empty search string and push records to $scope.inputData.availableSleeves', function(){
        expect(sleevesService.search.args[0][0]).toEqual('');
        expect($scope.inputData.availableSleeves).toEqual(sleeves);
    });
    describe('method: selectSleeve', function(){
        it('should add item to $scope.inputData.selectedSleeves and its id to $scope.inputData.ignoreSleeveIndex', function(){
            ctrl.selectSleeve(sleeves[0], false);
            expect($scope.inputData.selectedSleeves.length).toEqual(1);
            expect($scope.inputData.selectedSleeves[0].isAdded).toEqual(false);
            expect($scope.inputData.selectedSleeves[0].entity).toEqual(sleeves[0]);
            expect($scope.inputData.ignoreSleeveIndex[0]).toEqual(sleeves[0].id);
        });
    });
    describe('method: getAdditionSleeves', function(){
        it('should return selected sleeves which were added with second parameter as true', function(){
            ctrl.selectSleeve(sleeves[0], false);
            ctrl.selectSleeve(sleeves[1], true);
            var result = ctrl.getAdditionSleeves();
            expect(result[0].entity).toEqual(sleeves[1]);
            expect(result.length).toEqual(1);
        });
    });
    describe('method: getRemovalSleeves', function(){
        it('should return selected sleeves which were added with second parameter as false', function(){
            ctrl.selectSleeve(sleeves[0], false);
            ctrl.selectSleeve(sleeves[1], true);
            var result = ctrl.getRemovalSleeves();
            expect(result[0].entity).toEqual(sleeves[0]);
            expect(result.length).toEqual(1);
        });
    });
    describe('method: deselectSleeve', function(){
        it('should remove added sleeves from $scope.inputData.selectedSleeves and their ids from $scope.inputData.ignoreSleeveIndex', function(){
            ctrl.selectSleeve(sleeves[0], false);
            ctrl.selectSleeve(sleeves[1], true);
            ctrl.deselectSleeve($scope.inputData.selectedSleeves[0]);
            ctrl.deselectSleeve($scope.inputData.selectedSleeves[0]);
            expect($scope.inputData.selectedSleeves.length).toEqual(0);
        });
        it('if sleeve have id, should mark it as deleted', function(){
            var sleeve = {
                id: '10101',
                deleted: 0,
                entity: {
                    deleted: 0
                }
            };
            ctrl.deselectSleeve(sleeve);
            expect(sleeve.deleted).toBe(1);
            expect(sleeve.entity.deleted).toBe(1);
        });
    });
    describe('method: back', function(){
        it('should emit step.back event', function(){
            var eventHandler = sinon.spy();
            $scope.$on('step.back', eventHandler);
            ctrl.back();
            expect(eventHandler.calledOnce).toEqual(true);
        });
    });
    describe('method: next', function(){
        it('should emit step.next event', function(){
            var eventHandler = sinon.spy();
            $scope.$on('step.next', eventHandler);
            ctrl.next();
            expect(eventHandler.calledOnce).toEqual(true);
        });
    });
});