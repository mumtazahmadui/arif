angular
    .module('app.services')
    .factory('queueAjaxService', function() {
        return function() {
            this.tasks = [];
            this.isRun = false;

            this.createWrapper = function(callback) {
                return function(callback, response) {
                    callback(response.data);
                    this.isRun = false;
                    this.checkTasksAndRun();
                }.bind(this, callback);
            };

            this.checkTasksAndRun = function() {
                if (this.isRun) {
                    return this;
                }
                if (this.tasks.length) {
                    this.isRun = true;
                    var task = this.tasks.shift();
                    task();
                }
                return this;
            };

            this.createTask = function(runFunction, callback) {
                var task = function() {
                    var resultCallback = this.createWrapper(callback);
                    runFunction()
                        .then(resultCallback, resultCallback);
                }.bind(this);
                this.tasks.push(task);
            };

            this.addTask = function(runFunction, callback) {
                this.createTask(runFunction, callback);
                this.checkTasksAndRun();
                return this;
            };
        };
    });
