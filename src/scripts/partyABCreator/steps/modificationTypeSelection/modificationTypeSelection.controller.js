angular.module('partyABCreator').controller('modificationTypeSelection.ctrl',[
    '$scope',
    'masterAgreementService',
    'toastr',
    'modificationFilter',
    function(
        $scope,
        masterAgreementService,
        toastr,
        modificationFilter
    ) {
        var vm = this;
        vm.loaded = false;
        var extendedData = $scope.inputData;

        this.modificationTypes = [
            {name: 'fundNameChange',label: 'Fund Name Change'},
            {name: 'exhibitValueChange',label: 'Exhibit Value Change'},
            {name: 'both',label: 'Both'}
        ];

        angular.forEach(extendedData.selectPartyB,function(item) {
            if (modificationFilter.filter(item) && !item.changeType) {
                item.changeType = null;
                if (item.fundNameChange && item.exhibitValueChange)
                    item.changeType = 'both';
                else if (item.exhibitValueChange)
                    item.changeType =  'exhibitValueChange';
                else if (item.fundNameChange)
                    item.changeType = 'fundNameChange';
            }
        });

        this.back = function() {
            $scope.$emit('step.back',{data: $scope.inputData});
        };
        this.next = function(e) {
            e.preventDefault();
            $scope.$emit('step.next',{data: $scope.inputData});
        };

        this.filterModification = modificationFilter.filter;

        function onFundNameChange(entity) {
            if (!entity.fundNameChange) {
                entity.fundNameChange = {};
                //default values
                entity.fundNameChange.oldLei = entity.entity.lei;
                entity.fundNameChange.currentLei = entity.fundNameChange.oldLei;
                entity.fundNameChange.oldTrueLegalName = entity.entity.trueLegalName;
                entity.fundNameChange.currentTrueLegalName = entity.entity.trueLegalName;
                entity.fundNameChange.oldClientIdentifier = entity.entity.clientIdentifier;
                entity.fundNameChange.currentClientIdentifier = entity.entity.clientIdentifier;
            }
        }

        this.onModificationTypeChange = function(modificationType, entity) {
            switch (modificationType){
                case 'fundNameChange':
                case 'both':
                    onFundNameChange(entity);
                    break;
                case 'exhibitValueChange':
                    break;
                default:
                    break;
            }
        };

    }
]);
