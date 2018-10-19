(function() {
    angular
        .module('app.services')
        .service('signatureReviewEditor', [
        'AmendmentLetter', '$q',
        function(AmendmentLetter, $q) {
            var TYPE = {
                bs: 'BS',
                ss: 'SS'
            };

            var load = function(data) {
                data.onStart && data.onStart();

                var method = 'getSSSignaturePlaceHolders';
                if (TYPE.bs === data.type) {
                    method = 'getBSSignaturePlaceHolders';
                }

                return AmendmentLetter[method]({
                        amendmentLetterId: data.amendmentLetterId,
                        placeHolderId: data.placeHolderId
                    });
            };

            return {
                getData: function(data) {
                    var deferred  = $q.defer();
                    var resolveFunction =  function(data) {
                        deferred.resolve(data);
                    };
                    if (data.queueService) {
                        data.queueService.addTask(load.bind(null, data), resolveFunction);
                    } else {
                        load(data).then(resolveFunction, resolveFunction);
                    }
                    return deferred .promise;
                }
            };
        }]);
})();

