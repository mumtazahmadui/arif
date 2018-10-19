angular.module('partyABCreator').factory('partyABCreator.utils.step', [
    function() {
        /**
         *
         * @param fields
         * @param prev
         * @param next
         * @constructor
         */
        var STATE_NOT_DONE = 0,
            STATE_PENDING = 1,
            STATE_RESOLVED = 2;

        function step(fields, getPrevFunc, getNextFunc) {
            this.fields = fields;
            this.data = null;
            this.state = STATE_NOT_DONE;
            this.getPrevFunc = getPrevFunc;
            this.getNextFunc = getNextFunc;
        }

        /**
         *
         * @param initData
         */

        step.prototype.getFields = function() {
            return angular.extend({state: this.state},this.fields);
        };

        step.prototype.getPrev = function() {
            return this.getPrevFunc();
        };
        step.prototype.getNext = function() {
            return this.getNextFunc();
        };

        step.prototype.hasNext = function() {
            return !!this.getNext();
        };
        
        step.prototype.hasPrev = function() {
            return !!this.getPrev();
        }

        step.prototype.setState = function(state) {
            this.state = state;
            return this;
        };
        step.prototype.getState = function() {
            return this.state;
        };
        step.prototype.start = function(data) {
            this.setState(STATE_PENDING);
            this.setData(data);
            return this;
        };

        /**
         *
         * @param data
         */
        step.prototype.setData = function(data) {
            this.data = data;
            return this;
        };
        step.prototype.getData = function() {
            return this.data;
        };
        /**
         *
         * @param data
         * @returns {*}
         */
        step.prototype.forward = function(data) {
            this.setData(data);
            this.setState(STATE_RESOLVED);
            var nextStep = this.getNext();
            if (nextStep) {
                nextStep.setState(STATE_PENDING);
                nextStep.setData(data);
                return nextStep;
            }
            return this;
        };
        /**
         *
         * @returns {*}
         */
        step.prototype.back = function() {
            this.setState(STATE_NOT_DONE);
            var prevStep = this.getPrev();
            if (prevStep) {
                prevStep.setState(STATE_PENDING);
                return prevStep;
            }
            return this;
        };
        return step;
    }
]);
