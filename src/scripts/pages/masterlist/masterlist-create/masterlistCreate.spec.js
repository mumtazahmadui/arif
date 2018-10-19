describe('masterlistCreateController: ', function () {
    var defaultMasterlistModel,
        modalsService,
        createController,
        scope,
        state,
        deffered;
    beforeEach(function () {
        module('ui.router');
        module('app.controllers');
    });

    beforeEach(inject(function ($controller, $rootScope, $q) {
        deffered = {
            openWarningPopup: $q.defer()
        };
        scope = $rootScope.$new();
        state = {
            go: sinon.spy()
        };
        defaultMasterlistModel = [];
        modalsService = {
            open: sinon.spy(),
            openWarningPopup: sinon.stub().returns({
                result: deffered.openWarningPopup.promise
            }),
            error: sinon.spy()
        };
        createController = function () {
            return $controller('masterlistCreateController', {
                defaultMasterlistModel: defaultMasterlistModel,
                modalsService: modalsService,
                $scope: scope,
                $state: state
            });
        };
    }));


    it('should copy defaultMasterlistModel into template model', function () {
        defaultMasterlistModel = [1, 2];
        var vm = createController();
        expect(vm.templateModel).toEqual(defaultMasterlistModel);
        expect(vm.templateModel).not.toBe(defaultMasterlistModel);
    });

    it('clearValuesOnHide: should remove order and label input on hide', function () {
        var vm = createController();
        var row = {
            fieldOrder: '1',
            notFilledClass: true,
            fieldLabel: 'someLabel'
        };
        vm.clearValuesOnHide(row);
        expect(row.fieldOrder).toBeUndefined();
        expect(row.fieldLabel).toBeUndefined();
    });

    it('clearValuesOnHide: should do nothing if field is required', function () {
        var vm = createController();
        var row = {
            fieldOrder: '1',
            notFilledClass: true,
            fieldLabel: 'someLabel',
            required: true
        };
        vm.clearValuesOnHide(row);
        expect(row.fieldOrder).toBe('1');
        expect(row.fieldLabel).toBe('someLabel');
    });

    describe('checkForInvalidOrder: ', function () {
        beforeEach(function () {
            scope.masterlistForm = {
                firstOrder: {
                    $modelValue: '1',
                    $setValidity: sinon.spy()
                },
                secondOrder: {
                    $modelValue: '2',
                    $setValidity: sinon.spy()
                },
                thirdOrder: {
                    $modelValue: '3',
                    $setValidity: sinon.spy()
                },
                fourthOrder: {
                    $modelValue: '4',
                    $setValidity: sinon.spy()
                }
            };
        });
        it('should call $setValidity with true, when everything is correct', function () {
            var vm = createController();
            vm.checkForInvalidOrder();
            angular.forEach(scope.masterlistForm, function (value) {
                expect(value.$setValidity.args[0][1]).toBe(true);
                expect(value.$setValidity.args[0][0]).toBe('sameOrder');
            });
        });
        it('should call $setValidity with false, when everything is correct', function () {
            scope.masterlistForm.firstOrder.$modelValue = '2';
            var vm = createController();
            vm.checkForInvalidOrder();
            expect(scope.masterlistForm.firstOrder.$setValidity.args[0][1]).toBe(false);
            expect(scope.masterlistForm.secondOrder.$setValidity.args[0][1]).toBe(false);
        });
        it('should call $setValidity only for orders', function () {
            scope.masterlistForm.someLabel = {
                $modelValue: '4',
                $setValidity: sinon.spy()
            };
            var vm = createController();
            vm.checkForInvalidOrder();
            expect(scope.masterlistForm.someLabel.$setValidity.called).toBeFalsy();
        });
        it('should call $setValidity with true, when forms don\'t have values', function () {
            angular.forEach(scope.masterlistForm, function (value) {
                value.$modelValue = undefined;
            });
            var vm = createController();
            vm.checkForInvalidOrder();
            angular.forEach(scope.masterlistForm, function (value) {
                expect(value.$setValidity.args[0][1]).toBe(true);
                expect(value.$setValidity.args[0][0]).toBe('sameOrder');
            });
        });
    });

    it('isDisabled: should check if field required and hidden', function () {
        var vm = createController();
        var row = {
            fieldVisibility: 0
        };
        expect(vm.isDisabled(row)).toBeTruthy();
        row.required = true;
        expect(vm.isDisabled(row)).toBeFalsy();
        row.fieldVisibility = 1;
        expect(vm.isDisabled(row)).toBeFalsy();
    });

    describe('isInputRequired: ', function () {
        var row;
        beforeEach(function () {
            row = {
            };
        });
        it('if row have dependency on other field, and this field does not have value, should return true', function () {
            row.labelDependency = 'some';
            scope.masterlistForm = {
                someLabel: {
                }
            };
            var vm = createController();
            expect(vm.isInputRequired(row)).toBeTruthy();
        });
        it('in special case, when showHide disabled by default, should return false', function () {
            row.disabledShowHide = true;
            row.fieldVisibility = 0;
            var vm = createController();
            expect(vm.isInputRequired(row)).toBeFalsy();
        });
        it('should return true, if field required', function () {
            row.required = true;
            var vm = createController();
            expect(vm.isInputRequired(row)).toBeTruthy();
        });
        it('should return fieldVisibility', function () {
            row.fieldVisibility = true;
            var vm = createController();
            expect(vm.isInputRequired(row)).toBeTruthy();
            row.fieldVisibility = false;
            expect(vm.isInputRequired(row)).toBeFalsy();
        });
    });

    describe('isShowHideRequired: ', function () {
        var row;
        beforeEach(function () {
            row = {};
        });
        it('if row required, should return true', function () {
            row.required = true;
            var vm = createController();
            expect(vm.isShowHideRequired(row)).toBeTruthy();
        });
        it('should return true, if order available and filled', function () {
            row.ableToOrder = true;
            row.fieldOrder = '2';
            var vm = createController();
            expect(vm.isShowHideRequired(row)).toBeTruthy();
        });
        it('should return true, if label available and filled', function () {
            row.showLabel = true;
            row.fieldLabel = 'Sokfkdjas';
            var vm = createController();
            expect(vm.isShowHideRequired(row)).toBeTruthy();
        });
        it('should return false, if label not showed, order not showed and field not required', function () {
            var vm = createController();
            expect(vm.isShowHideRequired(row)).toBeFalsy();
        });
    });

    describe('isOrderRequired: ', function () {
        var row;
        beforeEach(function () {
            row = {};
        });
        it('if label available and filled, should return true', function () {
            row.showLabel = true;
            row.fieldLabel = 'jfldas';
            var vm = createController();
            expect(vm.isOrderRequired(row)).toBeTruthy();
        });
        it('if label not available or not filled, should look at show/hide button', function () {
            row.fieldVisibility = true;
            var vm = createController();
            expect(vm.isOrderRequired(row)).toBeTruthy();
            row.fieldVisibility = false;
            expect(vm.isOrderRequired(row)).toBeFalsy();
        });
    });

    describe('showWarning: ', function () {
        it('if there is no change in form, should go back', function () {
            scope.masterlistForm = {
                $dirty: false
            };
            var vm = createController();
            vm.showWarning();
            expect(state.go.called).toBeTruthy();
        });
        it('if there is no change in form, should show confirmation popup, and go away if user confirms', function () {
            scope.masterlistForm = {
                $dirty: true
            };
            var vm = createController();
            vm.showWarning();
            expect(state.go.called).toBeFalsy();
            expect(modalsService.openWarningPopup.called).toBeTruthy();
            deffered.openWarningPopup.resolve({});
            scope.$digest();
            expect(state.go.called).toBeTruthy();
        });
        it('if there is no change in form, should show confirmation popup, and do nothing if user changed his mind', function () {
            scope.masterlistForm = {
                $dirty: true
            };
            var vm = createController();
            vm.showWarning();
            expect(state.go.called).toBeFalsy();
            expect(modalsService.openWarningPopup.called).toBeTruthy();
            deffered.openWarningPopup.reject();
            scope.$digest();
            expect(state.go.called).toBeFalsy();
        });
    });

    describe('save: ', function () {
        var errorArr;
        beforeEach(function () {
            scope.masterlistForm = {};
            modalsService.error = sinon.spy(function (obj) {
                errorArr = obj.body;
            });
        });
        it('should show popup with saving title if masterlist valid', function () {
            scope.masterlistForm.$valid = true;
            var vm = createController();
            vm.save();
            expect(modalsService.open.called).toBeTruthy();
        });
        it('if invalid order, should show popup with correct message ', function () {
            scope.masterlistForm.$error = {
                pattern: true
            };
            var vm = createController();
            vm.save();
            expect(modalsService.error.called).toBeTruthy();
            expect(errorArr).toEqual(['Please correct the order']);
        });
        it('if same order, should show popup with correct message', function () {
            scope.masterlistForm.$error = {
                sameOrder: true
            };
            var vm = createController();
            vm.save();
            expect(modalsService.error.called).toBeTruthy();
            expect(errorArr).toEqual(['Please correct the order']);
        });
        it('if required not filled, should show popup with correct message', function () {
            scope.masterlistForm.$error = {
                required: true
            };
            var vm = createController();
            vm.save();
            expect(modalsService.error.called).toBeTruthy();
            expect(errorArr).toEqual(['Please provide input']);
        });
    });
});
