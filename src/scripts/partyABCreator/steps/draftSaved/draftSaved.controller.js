angular.module('partyABCreator').controller('draftSaved.ctrl',[
    '$scope',
    'partyABCreator.draftSaved',
    function(
        $scope,
        draftSaved
    ) {
        var vm = this;
        vm.loaded = false;
        var extendedData = $scope.inputData;

        this.back = function() {
            $scope.$emit('step.back',{data: $scope.inputData});
        };
        this.next = function() {
            $scope.$emit('step.next',{data: $scope.inputData});
        };
        this.finish = function() {
            $scope.$emit('step.finish',{data: $scope.inputData});
        };

        draftSaved.save(extendedData.preparedData).then(
            function(data) {
                extendedData.savedRFA = data.data;
                vm.loaded = true;
                vm.next();
            },
            function() {
                vm.loaded = true;
            });

    }
]);
