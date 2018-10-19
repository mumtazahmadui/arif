describe('masterlistTitleModalController: ', function () {
    var scope,
        state,
        data,
        rfaApiMasterlist,
        createController,
        createDeffered;
    beforeEach(function () {
        module('ui.router');
        module('app.controllers');
    });

    beforeEach(inject(function ($controller, $q, $rootScope) {
        createDeffered = $q.defer();
        scope = $rootScope.$new();
        state = {
            go: sinon.spy()
        };
        data = {};
        rfaApiMasterlist = {
            createTemplate: sinon.stub().returns({
                $promise: createDeffered.promise
            })
        };
        createController = function () {
            return $controller('masterlistTitleModalController', {
                $scope: scope,
                $state: state,
                data: data,
                rfaApiMasterlist: rfaApiMasterlist
            });
        };
    }));

    it('should assign model on init', function () {
        data.templateModel = [{foo: 'bar'}];
        var vm = createController();
        expect(vm.masterlistModel).toBe(data.templateModel);
    });

    describe('save: ', function () {
        beforeEach(function () {
            data.templateModel = [{
                fieldIdentifier: 'one',
                fieldLabel: 'tow',
                fieldVisibility: 1,
                fieldOrder: '1',
                smthElse: 'fdksjf',
                ableToOrder: true
            }, {
                fieldIdentifier: 'two',
                ableToOrder: true
            }, {
                fieldIdentifier: 'hello',
                fieldVisibility: 0,
                ableToOrder: true
            }, {
                fieldIdentifier: 'category',
                category: true
            }];
        });
        it('should send transformed for BE data', function () {
            var vm = createController();
            vm.templateName = 'tmpl1';
            var dataToSend = {
                templateName: 'tmpl1',
                templateFields: [{
                    fieldIdentifier: 'one',
                    fieldLabel: 'tow',
                    fieldVisibility: 1,
                    fieldOrder: '1'
                }, {
                    fieldIdentifier: 'two',
                    fieldLabel: 'two',
                    fieldVisibility: 1,
                    fieldOrder: '2'
                }, {
                    fieldIdentifier: 'hello',
                    fieldLabel: 'hello',
                    fieldVisibility: 0,
                    fieldOrder: null
                }]
            };
            vm.save();
            expect(vm.loading).toBeTruthy();
            expect(rfaApiMasterlist.createTemplate.args[0][0].templateName).toEqual(dataToSend.templateName);
            expect(rfaApiMasterlist.createTemplate.args[0][0].templateFields[0]).toEqual(dataToSend.templateFields[0]);
            expect(rfaApiMasterlist.createTemplate.args[0][0].templateFields[1]).toEqual(dataToSend.templateFields[1]);
            expect(rfaApiMasterlist.createTemplate.args[0][0].templateFields[2]).toEqual(dataToSend.templateFields[2]);
            expect(rfaApiMasterlist.createTemplate.args[0][0]).toEqual(dataToSend);
        });
        it('should change state on success', function () {
            var vm = createController();
            vm.save();
            expect(vm.loading).toBeTruthy();
            createDeffered.resolve({});
            scope.$digest();
            expect(vm.loading).toBeFalsy();
            expect(vm.errorOccurred).toBeFalsy();
            expect(state.go.called).toBeTruthy();
        });
        it('should show error on success', function () {
            var vm = createController();
            vm.save();
            expect(vm.loading).toBeTruthy();
            createDeffered.reject();
            scope.$digest();
            expect(vm.loading).toBeFalsy();
            expect(vm.errorOccurred).toBeTruthy();
            expect(state.go.called).toBeFalsy();
        });
    });
});
