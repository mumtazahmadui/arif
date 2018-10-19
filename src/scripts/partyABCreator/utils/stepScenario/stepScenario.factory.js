angular.module('partyABCreator.utils').factory('partyABCreator.utils.stepScenario', [
    'partyABCreator.utils.step',
    function (
        Step
    ) {

        var create = function (config, inputData) {
            var steps = _.map(config.steps, function(stepConfig, index){
                var getPrevFunc = function() {
                    if (index === 0) {
                        return null;
                    }
                    var prevStep = steps[index-1];
                    while (prevStep && prevStep.fields.showIf && !prevStep.fields.showIf(inputData)) {
                        prevStep = prevStep.getPrev();
                    }
                    return prevStep;
                };
                var getNextFunc = function() {
                    if (index === config.steps.length - 1) {
                        return null;
                    }
                    var nextStep = steps[index+1];
                    while (nextStep && nextStep.fields.showIf && !nextStep.fields.showIf(inputData)) {
                        nextStep = nextStep.getNext();
                    }
                    return nextStep;
                }
                return new Step(stepConfig, getPrevFunc, getNextFunc);
            });
            
            return steps[0];
        };

        return {
          create:create
        };
    }
]);