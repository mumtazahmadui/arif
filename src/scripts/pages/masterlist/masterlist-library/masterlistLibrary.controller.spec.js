describe('masterlistLibraryController: ', function () {
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
        module('rfa.masterlist.library');
    });

    beforeEach(inject(function ($controller, $rootScope, $q) {
        deffered = {
            rows: $q.defer(),
            filter: $q.defer(),
            delete: $q.defer(),
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
            getRows: sinon.stub().returns({
                $promise: deffered.rows.promise
            }),
            filterSearch: sinon.stub().returns({
                $promise: deffered.filter.promise
            }),
            deleteMasterlist: sinon.stub().returns({
                $promise: deffered.delete.promise
            })
        };
        modalsService = {
            openRemovePopup: sinon.stub().returns({
                result: deffered.openRemove.promise
            }),
            open: sinon.stub().returns({
                result: deffered.open.promise
            })
        };
        createController = function () {
            return $controller('masterlistLibraryController', {
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
            deffered.rows.resolve('new data');
            scope.$digest();
            expect(vm.data.table.data).toBe('new data');
            expect(vm.data.loading).toBeFalsy();
            expect(ScreenerService.set.called).toBeTruthy();
        });
        it('should do nothing if data not received', function () {
            var vm = createController();
            vm.update();
            deffered.rows.reject('new data');
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
            deffered.filter.resolve({data: [17, 18]});
            scope.$digest();
            expect(vm.data.filters[1].data).toEqual([17, 18]);
        });
    });
    it('exportXCL: should open PDF', function () {
        var vm = createController();
        vm.exportXCL({fileId: 45});
        expect(window.open.called).toBeTruthy();
        expect(window.open.args[0][0]).toBe('localhost:1111/company/55/master_list/45/export');
    });
    it('exportPartyBMap: should open PDF', function () {
        var vm = createController();
        vm.exportPartyBMap({fileId: 45});
        expect(window.open.called).toBeTruthy();
        expect(window.open.args[0][0]).toBe('localhost:1111/company/55/master_list/45/mcpm_partyb_mapping/export');
    });
    it('open: should open document', function () {
        var vm = createController();
        vm.open({fileId: 45});
        expect(window.open.called).toBeTruthy();
        expect(documentsService.openFile.called).toBeTruthy();
    });
    describe('removeMasterlist: ', function () {
        var vm;
        beforeEach(function () {
            vm = createController();
        });
        it('should call BE is user decided to remove masterlist and update screener on success', function () {
            vm.removeMasterlist({});
            deffered.openRemove.resolve();
            scope.$digest();
            expect(rfaApiMasterlist.deleteMasterlist.called).toBeTruthy();
            expect(rfaApiMasterlist.getRows.called).toBeFalsy();
            deffered.delete.resolve({});
            scope.$digest();
            expect(rfaApiMasterlist.getRows.called).toBeTruthy();
        });
        it('should call BE is user decided to remove masterlist and do nothing on error', function () {
            vm.removeMasterlist({});
            deffered.openRemove.resolve();
            scope.$digest();
            expect(rfaApiMasterlist.deleteMasterlist.called).toBeTruthy();
            expect(rfaApiMasterlist.getRows.called).toBeFalsy();
            deffered.delete.reject({});
            scope.$digest();
            expect(rfaApiMasterlist.getRows.called).toBeFalsy();
        });
        it('should do nothing is user didn\'t accept popup', function () {
            vm.removeMasterlist({});
            deffered.openRemove.reject();
            scope.$digest();
            expect(rfaApiMasterlist.deleteMasterlist.called).toBeFalsy();
        });
    });
    it('editAgreementType: should update screener after editing agreement type', function () {
        var vm = createController();
        vm.editAgreementType({});
        deffered.open.resolve();
        scope.$digest();
        expect(rfaApiMasterlist.getRows.called).toBeTruthy();
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
                id: 'Masterlist'
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
