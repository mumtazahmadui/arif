angular.module('app.services').factory('saveEditorStream', [
    'textEditorFilterOut',
    function(textEditorFilterOut) {
        var wrapper = function(process, params) {
            return function() {
                var done = _.last(arguments);
                var args = Array.prototype.splice.apply(arguments, [0, arguments.length - 1]);
                params && args.push(params);

                process.apply(
                    null, args
                ).then(function(result) {
                    done(null, result);
                }, function(error) {
                    done(error);
                });
            };
        };

        var prepareData = function(data) {
            return function(callbak) {
                callbak(null, textEditorFilterOut(data));
            };
        };

        return function(data) {
            var queue = [prepareData(data)];

            this.clean = function() {
                queue = [];
            };

            this.getQueue = function() {
                return queue;
            };

            this.pipe = function(process, params) {
                if (!process) {
                    return this;
                }
                queue.push(wrapper(process, params));
                return this;
            };

            this.execute = function(callback) {
                async.waterfall(queue, callback);
            };
        };
    }
]);
