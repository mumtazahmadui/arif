describe('MasterlistController: ', function () {
    var masterlistTabsConfig,
        createController;
    beforeEach(function () {
        module('ui.router');
        module('rfa.masterlist');
    });

    beforeEach(inject(function ($controller) {
        masterlistTabsConfig = [];
        createController = function () {
            return $controller('MasterlistController', {
                masterlistTabsConfig: masterlistTabsConfig
            });
        };
    }));


    it('should copy masterlistTabsConfig into tabsConfig ', function () {
        masterlistTabsConfig = [1, 2];
        var vm = createController();
        expect(vm.tabsConfig).toEqual(masterlistTabsConfig);
        expect(vm.tabsConfig).not.toBe(masterlistTabsConfig);
    });
});