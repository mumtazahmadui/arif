(function () {
    angular.module('rfa.dashboard')
        .factory('rfaApiBulkUploadAdapter', rfaApiBulkUploadAdapter);

    function rfaApiBulkUploadAdapter() {
        var defaultObj = {
            "fieldIdentifier": null,
            "fieldLabel": null,
            "rules": null,
            "aliasLabel": null,
            "entityIdentifier": null
        };
        return {
            postData: posUploadTemplatetData
        };

        function posUploadTemplatetData(params) {
            var transformData = {
                templateFields: [],
                templateName: params.templateName
            }, templateFields = [];

            angular.forEach(params.template, function (row) {
                if (row.isShow) {
                    var templateData = {
                        "fieldIdentifier": row.fieldIdentifier,
                        "fieldLabel": row.fieldLabel,
                        "rule": row.rule,
                        "aliasLabel": null,
                        "entityIdentifier": row.entityIdentifier && 1 || 0,
                        "isRequired": (isRequired(row) || row.entityIdentifier) ? 1 : 0
                    };
                    templateFields.push(templateData);
                }
            });
            if (params.exhibits.length > 0) {
                angular.forEach(params.exhibits, function (row) {
                    var exhibitsData = {
                        "fieldIdentifier": row.fieldIdentifier,
                        "fieldLabel": row.fieldLabel,
                        "rule": null,
                        "aliasLabel": row.aliasLabel || null,
                        "entityIdentifier": 0,
                        "isRequired": 0
                    };
                    templateFields.push(exhibitsData);

                });
            }
            transformData.templateFields = templateFields;
            return transformData;
        }

        function isRequired(row) {
            var requiredAlias = ["agreementType", "refMasterAgrmDate", "Dealer"];
            if (requiredAlias.indexOf(row.alias) > -1 ||
                row.alias === 'InvestmentManager' && row.isShow ||
                row.alias === 'masterlistIdentifier' && (row.rule === 'Mandatory' || row.rule === 'Ref Table') ||
                row.alias === 'action' && row.rule === 'Blank' ) {
                return true;
            } else {
                return false;
            }
        }
    }
})();