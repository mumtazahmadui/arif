(function () {
    angular.module('app.services')
        .factory('BulkEsignService', ['$http',
            '$q',
            'appConfig',
            'CredentialsService',
            'rfaFileDownload',
            function ($http,
                $q,
                appConfig,
                CredentialsService,
                rfaFileDownload) {
                return {
                    getSignatureDetails: getSignatureDetails,
                    downloadErrorsDocument: downloadErrorsDocument,
                    sign: sign
                };
                // 
                /**
                 *note amendment request IDs are passed as comma-separated string, not JS array 
                 * @param {String} requestIds 
                 * @returns 
                 */
                function getSignatureDetails(requestIds) {
                    var ids = requestIds.split(',').map(function (id) {
                        return parseInt(id, 10);
                    });
                    return $q.all({
                            rfas: $http.post(appConfig.api_host + 'amendmentLetters?action=e-sign&validate', JSON.stringify(ids)),
                            credentials: CredentialsService.get()
                        })
                        .then(function (data) {
                            var placeholderCountField = CredentialsService.companyType() === 'BS' ? 'BS_PLACEHOLDER_COUNT' : 'SS_PLACEHOLDER_COUNT',
                                rfas = data.rfas;
                            if (!rfas || !rfas.data || !rfas.data.data.rows) {
                                return [];
                            }
                            _.each(rfas.data.data.rows, function (row) {
                                row.placeholders = [];
                                var placeholderCount = parseInt(row[placeholderCountField]);
                                if (!placeholderCount) {
                                    return;
                                }
                                for (var i = 0; i < placeholderCount; i++) {
                                    row.placeholders.push({
                                        selected: true
                                    });
                                }
                                if (!row.signatureDetails) {
                                    return;
                                }
                                var placeholders = {},
                                    signatureStrings = row.signatureDetails.match(/( ?\| ?[^\|]*){3}/g);
                                _.each(signatureStrings, function (signatureString) {
                                    var fields = signatureString.match(/ ?\| ?([^\|]*) ?\| ?([^\|]*) ?\| ?([^\|]*)/),
                                        index = fields[1].trim(),
                                        name = fields[2].trim(),
                                        date = fields[3].trim();
                                    if (!placeholders[index]) {
                                        placeholders[index] = [];
                                        row.placeholders[parseInt(index) - 1].prevSignatures = placeholders[index];
                                    }
                                    placeholders[index].push({
                                        name: name,
                                        date: date
                                    });
                                });
                            });
                            return rfas;
                        });
                }
                // note amendment request IDs are passed as comma-separated string, not JS array
                function downloadErrorsDocument(requestIds) {
                    return rfaFileDownload.downloadFile(appConfig.api_host + 'amendmentLetters/error-pdf?rfaIds=' + requestIds + '&action=e-sign');
                }

                function sign(rfas, signatureData, user) {
                    var requestData = {
                        data: _.map(rfas, function (rfa) {
                            var placeholdersSigned = _.reduce(rfa.placeholders, function (memo, item, index) {
                                if (item.selected) {
                                    memo.push(index + 1);
                                }
                                return memo;
                            }, []);
                            return angular.extend({}, signatureData, {
                                placeholdersSigned: placeholdersSigned,
                                sellSide: CredentialsService.companyType() !== 'BS',
                                signTextDate: rfa.signTextDate ? rfa.signTextDate : signatureData.acceptDate,
                                signText: rfa.customTextBlock,
                                amendmentId: rfa.validRfaId,
                                userId: user.userId,
                                companyId: user.companyId,
                                companyName: user.companyName,
                                createdBy: user.userId,
                                modifiedBy: user.userId
                            });
                        })
                    };
                    return $http({
                        method: 'POST',
                        url: appConfig.api_host + 'amendmentLetters/actions/bulk-sign',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: requestData.data
                    });
                }
            }
        ]);
})();