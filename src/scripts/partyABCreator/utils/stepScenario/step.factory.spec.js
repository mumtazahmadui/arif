describe('factory: partyABCreator.utils.step', function(){
    var Step;
    beforeEach(function(){
        module('partyABCreator');
    });
    beforeEach(inject(function($injector){
        Step = $injector.get('partyABCreator.utils.step');
    }));
    it('should return constructor function which sets "fields" field from first argument', function(){
        var fields = {},
            step = new Step(fields);
        expect(step.fields).toEqual(fields);
    });
    describe('constructed object method: getPrev', function(){
        it('should return result of calling second argument of constructor call', function(){
            var fields = {},
                getPrevFnReturns = {},
                getPrevFn = function(){return getPrevFnReturns},
                step = new Step(fields, getPrevFn),
                result = step.getPrev();
            expect(result).toEqual(getPrevFnReturns);
        });
    });
    describe('constructed object method: getNext', function(){
        it('should return result of calling third argument of constructor call', function(){
            var fields = {},
                getNextFnReturns = {},
                getNextFn = function(){return getNextFnReturns},
                step = new Step(fields, null, getNextFn),
                result = step.getNext();
            expect(result).toEqual(getNextFnReturns);
        });
    });
    describe('constructed object method: getFields', function(){
        it('should return copied first argument of constructor call with added state field', function(){
            var fields = {someField:'someFieldValue'},
                step = new Step(fields),
                result = step.getFields();
            expect(result.someField).toEqual(fields.someField);
            expect(result.state).toEqual(0);
        });
    });
    describe('constructed object method: start', function(){
        it('should change state field to 1 and data field to first argument and return itself', function(){
            var fields = {},
                step = new Step(fields),
                data = {},
                result = step.start(data);
            expect(result.state).toEqual(1);
            expect(result.data).toEqual(data);
            expect(result).toEqual(step);
        });
    });
    describe('constructed object method: forward', function(){
        it('should set data field to first argument, state field to 2', function(){
            var fields = {},
                getNextFnReturns = {setState: function(){}, setData: function(){}},
                getNextFn = function(){return getNextFnReturns},
                step = new Step(fields, null, getNextFn),
                data = {};
            step.forward(data);
            expect(step.state).toEqual(2);
            expect(step.data).toEqual(data);
        });
        it('should call third argument of constructor call, return result if it is truthy', function(){
            var fields = {},
                getNextFnReturns = {setState: function(){}, setData: function(){}},
                getNextFn = function(){return getNextFnReturns},
                step = new Step(fields, null, getNextFn),
                data = {},
                result = step.forward(data);
            expect(result).toEqual(getNextFnReturns);
        });
        it('should return itself if result of calling constructor third argument is falsy', function(){
            var fields = {},
                getNextFn = function(){},
                step = new Step(fields, null, getNextFn),
                data = {},
                result = step.forward(data);
            expect(result).toEqual(step);
        });
    });
    describe('constructed object method: back', function(){
        it('should set state field to 0', function(){
            var fields = {},
                getPrevFnReturns = {setState: function(){}},
                getPrevFn = function(){return getPrevFnReturns},
                step = new Step(fields, getPrevFn);
            step.back();
            expect(step.state).toEqual(0);
        });
        it('should call second argument of constructor call, return result if it is truthy', function(){
            var fields = {},
                getPrevFnReturns = {setState: function(){}},
                getPrevFn = function(){return getPrevFnReturns},
                step = new Step(fields, getPrevFn);
                result = step.back();
            expect(result).toEqual(getPrevFnReturns);
        });
        it('should return itself if result of calling constructor third argument is falsy', function(){
            var fields = {},
                getPrevFnReturns = {setState: function(){}},
                getPrevFn = function(){},
                step = new Step(fields, getPrevFn);
                result = step.back();
            expect(result).toEqual(step);
        });
    });
});