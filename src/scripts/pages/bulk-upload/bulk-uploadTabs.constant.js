(function() {
    angular.module('app.bulk.upload')
        .constant('bulkUploadTabsConfig', [
            {
                caption: 'Uploaded Files',
                href: 'rfa.bulk-upload.files',
                active: false
            },
            {
                caption: 'Upload Template',
                href: 'rfa.bulk-upload.template',
                permission: 'ops.edit',
                active: false
            }
        ]);
})();