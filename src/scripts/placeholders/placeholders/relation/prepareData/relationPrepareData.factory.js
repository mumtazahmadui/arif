angular.module('app.placeholders')
    .factory('app.placeholders.relationPrepareData', [
        '$base64',
        function($base64) {
            return function() {
                this.prepareSendData = function(args) {
                    if (_.isEmpty(args) || !_.isString(args.data.partyAText)) {
                        return '';
                    }
                    return {
                        partyAText: $base64.encode(args.data.partyAText)
                    };
                };

                this.prepareGetData = function(data) {
                    data = JSON.parse(data);
                    if (_.isEmpty(data.partyAText) || !_.isString(data.partyAText)) {
                        return '';
                    }
                    data.partyAText = decodeURIComponent($base64.decode(data.partyAText).replace(/\+/g, ' '));
                    return data;
                };
            };
        }]);
