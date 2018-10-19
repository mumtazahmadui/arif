(function() {
    angular.module('rfa.masterlist')
        .constant('masterlistTabsConfig', [
            {
                caption: 'Masterlist',
                href: 'rfa.masterlist.library',
                active: false
            },
            {
                caption: 'Masterlist Template',
                href: 'rfa.masterlist.template',
                permission: 'ops.edit',
                active: false
            }
        ]);
})();