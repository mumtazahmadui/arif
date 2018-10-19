angular.module('partyABCreator').controller('sleeveSelection.ctrl',[
    '$scope',
    'sleevesService',
    '$stateParams',
    function(
        $scope,
        sleevesService,
        $stateParams
    ) {
        var vm = this;
        vm.loaded = false;
        var extendedData = $scope.inputData;
        angular.extend(this, {
            back: back,
            next: next,
            loadSleeves: loadSleeves,
            selectSleeve: selectSleeve,
            deselectSleeve: deselectSleeve,
            getAdditionSleeves: getAdditionSleeves,
            getRemovalSleeves: getRemovalSleeves
        });
        
        loadSleeves('');
        
        
        function back() {
            $scope.$emit('step.back', {data: $scope.inputData});
        }
        
        function next() {
            $scope.$emit('step.next', {data: $scope.inputData});
        }
        
        function loadSleeves(filterString) {
            sleevesService.search(filterString)
            .then(function(sleeves) {
                extendedData.availableSleeves = sleeves;
                vm.loaded = true;
            }, function() {

            });
        }
        
        function selectSleeve(Entity, forAddition) {
            if (extendedData.ignoreSleeveIndex.indexOf(Entity.id) < 0) {

                extendedData.selectedSleeves.push({
                    'entity': Entity,
                    'isAdded': forAddition,
                    isModified: false,
                    amendmentId: +$stateParams.contentId,
                    amendmentStatus: null,
                    createdBy: null,
                    createdDate: null,
                    acknowledgementStatus: null,
                    modifiedBy: null,
                    modifiedDate: null,
                    reason: null
                });
                extendedData.ignoreSleeveIndex.push(Entity.id);
            }
        }
        
        function getAdditionSleeves() {
            return _.filter(extendedData.selectedSleeves, function(item){
                return !item.deleted && item.isAdded;
            });
        }
        
        function getRemovalSleeves() {
            var selectedForRemoval = _.filter(extendedData.selectedSleeves, function(item){
                return !item.deleted && !item.isAdded;
            });
            return selectedForRemoval;
        }
        
        function deselectSleeve(Entity) {
            if(Entity.id) {
                Entity.deleted = 1;
                Entity.entity.deleted = 1;
            } else {
                extendedData.selectedSleeves = _.without(extendedData.selectedSleeves, Entity);
                extendedData.ignoreSleeveIndex = _.without(extendedData.ignoreSleeveIndex, Entity.entity.id);                
            }
        }
    }
]);
