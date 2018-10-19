describe('masterlistTemplateLibraryController: ', function () {
    var deffered,
        appConfig,
        scope,
        ScreenerService,
        CredentialsService,
        window,
        documentsService,
        createController,
        rfaApiMasterlist,
        modalsService;
    beforeEach(function () {
        module('ui.router');
        module('rfa.masterlist.template');
    });

    beforeEach(inject(function ($controller, $rootScope, $q) {
        deffered = {
            getRowsTemplates: $q.defer(),
            filterTemplateSearch: $q.defer(),
            deleteTemplate: $q.defer(),
            open: $q.defer(),
            openRemove: $q.defer()
        };
        scope = $rootScope.$new();
        ScreenerService = {
            get: sinon.stub().returns({
                pages: {
                    items_per_page: 10,
                    page: 1
                },
                table: {
                    sortBy: 'Template Name',
                    desc: 'asc'
                },
                filters: [{
                    id: 'name'
                }, {
                    id: 'age'
                }]
            }),
            set: sinon.spy()
        };
        CredentialsService = {
            companyId: sinon.stub().returns('55')
        };
        appConfig = {
            api_host: 'localhost:1111/'
        };
        window = {
            open: sinon.spy()
        };
        documentsService = {
            openFile: sinon.spy()
        };
        rfaApiMasterlist = {
            getRowsTemplates: sinon.stub().returns({
                $promise: deffered.getRowsTemplates.promise
            }),
            filterTemplateSearch: sinon.stub().returns({
                $promise: deffered.filterTemplateSearch.promise
            }),
            deleteTemplate: sinon.stub().returns({
                $promise: deffered.deleteTemplate.promise
            })
        };
        modalsService = {
            openWarningPopup: sinon.stub().returns({
                result: deffered.openRemove.promise
            }),
            open: sinon.stub().returns({
                result: deffered.open.promise
            })
        };
        createController = function () {
            return $controller('masterlistTemplateLibraryController', {
                appConfig: appConfig,
                $scope: scope,
                ScreenerService: ScreenerService,
                CredentialsService: CredentialsService,
                $window: window,
                documentsService: documentsService,
                rfaApiMasterlist: rfaApiMasterlist,
                modalsService: modalsService
            });
        };
    }));

    it('should call ScreenerService.get on init and set loading state until got data', function () {
        var vm = createController();
        expect(ScreenerService.get.called).toBeTruthy();
        expect(vm.data.loading).toBeTruthy();
    });

    describe('update: ', function () {
        it('should send getRows request, and change table on response', function () {
            var vm = createController();
            vm.update();
            deffered.getRowsTemplates.resolve('new data');
            scope.$digest();
            expect(vm.data.table.data).toBe('new data');
            expect(vm.data.loading).toBeFalsy();
            expect(ScreenerService.set.called).toBeTruthy();
        });
        it('should do nothing if data not received', function () {
            var vm = createController();
            vm.update();
            deffered.getRowsTemplates.reject('new data');
            scope.$digest();
            expect(vm.data.table.data).toBeUndefined();
            expect(vm.data.loading).toBeTruthy();
            expect(ScreenerService.set.called).toBeFalsy();
        });
    });

    describe('filterSearch: ', function () {
        it('should call filterSearch and set filter values for user', function () {
            var vm = createController();
            vm.filterSearch({filterName: 'age'});
            deffered.filterTemplateSearch.resolve({data: [17, 18]});
            scope.$digest();
            expect(vm.data.filters[1].data).toEqual([17, 18]);
        });
    });
    it('exportTemplate: should open file', function () {
        var vm = createController();
        vm.exportTemplate({mlTemplateId : 45});
        expect(window.open.called).toBeTruthy();
        expect(window.open.args[0][0]).toBe('localhost:1111/masterlist_template/45/export');
    });
    describe('remove: ', function () {
        var vm;
        beforeEach(function () {
            vm = createController();
        });
        it('should call BE is user decided to remove masterlist and update screener on success', function () {
            vm.remove({});
            deffered.openRemove.resolve();
            scope.$digest();
            expect(rfaApiMasterlist.deleteTemplate.called).toBeTruthy();
            expect(rfaApiMasterlist.getRowsTemplates.called).toBeFalsy();
            deffered.deleteTemplate.resolve({});
            scope.$digest();
            expect(rfaApiMasterlist.getRowsTemplates.called).toBeTruthy();
        });
        it('should call BE is user decided to remove masterlist and do nothing on error', function () {
            vm.remove({});
            deffered.openRemove.resolve();
            scope.$digest();
            expect(rfaApiMasterlist.deleteTemplate.called).toBeTruthy();
            expect(rfaApiMasterlist.getRowsTemplates.called).toBeFalsy();
            deffered.deleteTemplate.reject({});
            scope.$digest();
            expect(rfaApiMasterlist.getRowsTemplates.called).toBeFalsy();
        });
        it('should do nothing is user didn\'t accept popup', function () {
            vm.remove({});
            deffered.openRemove.reject();
            scope.$digest();
            expect(rfaApiMasterlist.deleteTemplate.called).toBeFalsy();
        });
    });
    it('screenerUpdate: if updated masterlist screener, should update data', function () {
        ScreenerService = {
            get: sinon.stub().returns({
                pages: {
                    items_per_page: 10,
                    page: 1
                },
                table: {
                    sortBy: 'Template Name',
                    desc: 'asc'
                },
                filters: [{
                    id: 'name'
                }, {
                    id: 'age'
                }],
                id: 'MasterlistTemplate'
            })
        };
        var vm = createController();
        vm.update = sinon.spy();
        scope.$emit('screenerUpdate', {});
        scope.$digest();
        expect(vm.update.called).toBeTruthy();
    });
    it('screenerUpdate: if updated screener, and this isn\'t masterlist screener, should do nothing', function () {
        var vm = createController();
        vm.update = sinon.spy();
        scope.$emit('screenerUpdate', {});
        scope.$digest();
        expect(vm.update.called).toBeFalsy();
    });
    it('screenerCall: should do nothing if there is no such function', function () {
        var vm = createController();
        vm.someFunc = sinon.spy();
        scope.$emit('screenerCall', {
            name: 'prop',
            params: 'some'
        });
        scope.$digest();
        expect(vm.someFunc.called).toBeFalsy();
    });
    it('screenerCall: should call function', function () {
        var vm = createController();
        vm.someFunc = sinon.spy();
        scope.$emit('screenerCall', {
            name: 'someFunc',
            params: 'some'
        });
        scope.$digest();
        expect(vm.someFunc.called).toBeTruthy();
    });
});
