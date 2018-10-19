describe('factory: partyABCreator.utils.stepScenario', function(){
    var stepScenario,
        step;
    beforeEach(function(){
        module('partyABCreator');
    });
    beforeEach(inject(function($injector){
        stepScenario = $injector.get('partyABCreator.utils.stepScenario');
    }));
    it('should create step objects corresponding to config items and pass to constructor the functions to navigate between steps', function(){
        var showFirst = true,
            showSecond = false,
            config = {steps:[{showIf: function(){return showFirst;}}, {showIf: function(){return showSecond;}}]},
            data = {},
            firstStep = stepScenario.create(config);
        expect(firstStep.getNext()).toBe(null);
        expect(firstStep.getPrev()).toBe(null);
        showSecond = true;
        expect(firstStep.getNext()).toBeTruthy();
        var secondStep = firstStep.getNext();
        expect(secondStep.getPrev()).toBe(firstStep);
        expect(secondStep.getNext()).toBe(null);
        showFirst = false;
        expect(secondStep.getPrev()).toBe(null);
    });
});