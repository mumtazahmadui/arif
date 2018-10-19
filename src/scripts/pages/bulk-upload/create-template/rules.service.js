(function () {
    angular.module('app.bulk.upload')
        .factory('rulesService', rulesService);

    function rulesService(modalsService) {

        return {
            hideAtrribute: hideAtrribute,
            showPopup: showPopup,
            showAttribute: showAttribute
        };

        function showAttribute(model, selectedAttribute) {
            model.forEach(function (row) {
                if (selectedAttribute.indexOf(row.fieldIdentifier) > -1) {
                    row.isShow = true;
                }
            });
        }

        function showPopup(model) {
            return modalsService.open({
                template: 'bulk-upload/create-template/modal/add-attribute/add-attribute',
                controller: 'addAttribute',
                controllerAs: 'vm',
                templateModel: angular.copy(model),
                backdrop: 'static'
            }).result;
        }

        function hideAtrribute(row) {
            if (row.rule && row.rule.length > 0 ||
                row.fieldLabel && row.fieldLabel.length > 0
            ) {
                modalsService.openWarningPopup({
                    body: 'Unsaved information will be lost. Please confirm.',
                    title: 'Warning'
                }).result.then(function () {
                    hideAttribute(row)
                }, angular.noop);
            } else {
                hideAttribute(row)
            }
        }

        function hideAttribute(row) {
            row.isShow = !row.isShow;
            row.rule = '',
            row.fieldLabel = '';
        }
    }
})();