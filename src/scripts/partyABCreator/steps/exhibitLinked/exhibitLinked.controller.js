angular.module('partyABCreator').controller('exhibitLinked.ctrl',[
    '$scope',
    function(
        $scope
    ) {
        this.back = function() {
            $scope.$emit('step.back',{data: $scope.inputData});
        };
        this.next = function() {
            $scope.$emit('step.next',{data: $scope.inputData});
        };
        this.finish = function() {
            $scope.$emit('step.finish',{data: $scope.inputData});
        };

    }]);
