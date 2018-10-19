angular.module('partyABCreator').controller('partyBEntitySelection.ctrl', [
    '$scope',
    'entityService',
    'sleevesService',
    'modificationFilter',
    '$stateParams',
    'modalsService',
    function($scope,
              entityService,
              sleevesService,
              modificationFilter,
              $stateParams,
              modalsService) {
        var vm = this;
        vm.loaded = false;
        this.toPartyB = toPartyB;
        this.fromPartyB = fromPartyB;
        this.toModificationPartyB = toModificationPartyB;
        this.fromModificationPartyB = fromModificationPartyB;
        this.entitiesFilter = '';
        this.filterAddition = filterAddition;
        this.filterRemoval = filterRemoval;
        this.filterModification = modificationFilter.filter;
        $scope.inputData.loadings = {};

        var extendedData = $scope.inputData;

        init();

        function init() {
            if (isSleeveFlow() && extendedData.selectPartyB && extendedData.selectPartyB.length) {
                var partiesBToRemove = extendedData.selectPartyB.filter(function (item) {
                    return !item.isAdded;
                });
                if (partiesBToRemove.length) {
                    $scope.inputData.loadings.removePartyB = true;
                    extendedData.selectedSleeves = extendedData.selectedSleeves.filter(function (sleeve) {
                        return !sleeve.autoAdded;
                    });
                    partiesBToRemove.forEach(function (item) {
                        findSleeves(item);
                    });
                }
            }
        }

        extendedData.availablePartyB = extendedData.availablePartyB || [];

        this.back = function() {
            if ($scope.inputData.flow === 'b') {
                modalsService.open({
                    'backdrop': 'static',
                    'template': 'modal/CreateNewRFA',
                    'controller': 'CreateNewRFA',
                    'class': 'modal-rfa'
                });
            }
            $scope.$emit('step.back', {data: $scope.inputData});
        };
        this.next = function() {
            $scope.$emit('step.next', {data: $scope.inputData});
        };
        this.loadEntities = loadEntities;

        loadEntities('');

        function filterAddition(item) {
            return !item.isModified && !item.deleted && item.isAdded;
        }

        function filterRemoval(item) {
            return !item.deleted && !item.isAdded && !item.isModified;
        }

        function toPartyB(Entity, isAdded) {
            if (extendedData.ignoreIndex.indexOf(Entity.id) < 0) {

                var Item = _.find(extendedData.selectPartyB, function(item) {
                    return item.entity.id === Entity.id;
                });
                var newItem;
                if (Item === undefined) {
                    newItem = {
                        'entity': Entity,
                        'isAdded': isAdded,
                        isModified: false,
                        amendmentId: +$stateParams.contentId,
                        amendmentStatus: null,
                        createdBy: null,
                        createdDate: null,
                        acknowledgementStatus: null,
                        modifiedBy: null,
                        modifiedDate: null,
                        reason: null
                    };
                } else {
                    newItem = angular.copy(Item);
                    delete newItem.id;
                    newItem.deleted = 0;
                    newItem.isModified = false;
                    newItem.entity.deleted = 0;
                    newItem.isAdded = isAdded;
                    if (!isAdded) {
                        newItem.exhibitValueChange = null;
                        newItem.fundNameChange = null;
                    }
                    
                }
                if (isSleeveFlow() && (!isAdded)) {
                    $scope.inputData.loadings.removePartyB = true;
                    findSleeves(newItem);
                }
                extendedData.selectPartyB.push(newItem);
                extendedData.ignoreIndex.push(Entity.id);
            }
        }
        
        function findSleeves(partyBItem) {
            var masterListIds = _.map(extendedData.selectedPartyA, function(partyA){
                return partyA.id;
            });
            sleevesService.getForEntities(partyBItem.entity.id, masterListIds.join(','))
            .then(function(data){
                if (data && data.length) {
                    partyBItem.sleeveItems = [];
                    _.each(data, function(Entity){
                        var Item = _.find(extendedData.selectedSleeves, function(sleeve) {
                                return sleeve.entity.id === Entity.id;
                            }),
                            newSleeveItem;
                        
                        if (Item === undefined) {
                            newSleeveItem = {
                                'entity': Entity,
                                'isAdded': false,
                                amendmentId: +$stateParams.contentId,
                                amendmentStatus: null,
                                createdBy: null,
                                createdDate: null,
                                acknowledgementStatus: null,
                                modifiedBy: null,
                                modifiedDate: null,
                                reason: null
                            };
                        } else {
                            newSleeveItem = angular.copy(Item);
                            delete newSleeveItem.id;
                            newSleeveItem.deleted = 0;
                            newSleeveItem.entity.deleted = 0;
                            newSleeveItem.isAdded = false;
                            newSleeveItem.exhibitValueChange = null;
                            newSleeveItem.fundNameChange = null;
                            
                        }
                        newSleeveItem.autoAdded = true;
                        removePreviousBeforeAdding(newSleeveItem);
                        partyBItem.sleeveItems.push(newSleeveItem);
                        extendedData.ignoreSleeveIndex.push(Entity.id);
                    });
                } else {
                    partyBItem.sleeveItems = undefined;
                }
                $scope.inputData.loadings.removePartyB = false;
            });
        }

        function removePreviousBeforeAdding(newSleeve) {
            extendedData.selectedSleeves = extendedData.selectedSleeves.filter(function (sleeve) {
                return sleeve.entity.id !== newSleeve.entity.id;
            });
            extendedData.selectedSleeves.push(newSleeve);
        }
        
        function fromPartyB(entity) {
            if ((extendedData.flow === 'editB' || extendedData.flow === 'editSleeve') && entity.id) {
                entity.deleted = 1;
                entity.entity.deleted = 1;
            } else {
                extendedData.selectPartyB.splice(extendedData.selectPartyB.indexOf(entity), 1);
            }
            extendedData.ignoreIndex.splice(extendedData.ignoreIndex.indexOf(entity.entity.id), 1);
            if (isSleeveFlow() && (!entity.isAdded) && entity.sleeveItems) {
                removeSleeves(entity);
            }
        }
        
        function removeSleeves(entity) {
            _.each(entity.sleeveItems, function(sleeveItem){
                extendedData.ignoreSleeveIndex = _.without(extendedData.ignoreSleeveIndex, sleeveItem.entity.id);
                extendedData.selectedSleeves = _.without(extendedData.selectedSleeves, sleeveItem);
            });
        }
        
        //Modification functionality for select party B  Accounts Step
        function fromModificationPartyB(entity) {
            if ((extendedData.flow === 'editB' || extendedData.flow === 'editSleeve') && entity.id) {
                entity.deleted = 1;
                entity.entity.deleted = 1;
            } else {
                extendedData.selectPartyB.splice(extendedData.selectPartyB.indexOf(entity), 1);
            }
            extendedData.ignoreIndex.splice(extendedData.ignoreIndex.indexOf(entity.entity.id), 1);
        }

        function toModificationPartyB(entity) {
            var isModified = true;
            if (extendedData.ignoreIndex.indexOf(entity.id) < 0) {

                var Item = _.find(extendedData.selectPartyB, function(item) {
                    return item.entity.id === entity.id;
                });

                if (Item === undefined) {
                    extendedData.selectPartyB.push({
                        'entity': entity,
                        'isModified': isModified,
                        isAdded: true,
                        amendmentId: +$stateParams.contentId,
                        amendmentStatus: null,
                        createdBy: null,
                        createdDate: null,
                        acknowledgementStatus: null,
                        modifiedBy: null,
                        modifiedDate: null,
                        reason: null
                    });
                } else {
                    var newItem = angular.copy(Item);
                    delete newItem.id;
                    newItem.deleted = 0;
                    newItem.entity.deleted = 0;
                    newItem.isModified = isModified;
                    newItem.isAdded = true;
                    extendedData.selectPartyB.push(newItem);
                }
                extendedData.ignoreIndex.push(entity.id);
            }
        }

        function loadEntities(entityFilter) {
            entityService.put({
                'pageSize': 500,
                'offSet': 1,
                'searchString': entityFilter
            })
                .success(function(data) {
                    extendedData.availablePartyB = data.data;
                    vm.loaded = true;
                })
                .error(function() {

                });
        }

        function isSleeveFlow() {
            return extendedData.flow === 'sleeves' || extendedData.flow === 'editSleeve';
        }
    }
]);
