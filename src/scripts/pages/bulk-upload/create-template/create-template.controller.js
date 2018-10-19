(function () {
    'use strict';

    angular.module('app.bulk.upload')
        .controller('createTemplateController', createTemplateController);

    function createTemplateController($scope,$rootScope,
        $q,
        $stateParams,
        $state,
        exhibitService,
        modalsService,
        defaultTemplateUploadModel,
        BulkUploadService,
        rulesService) {
        var vm = this;

        angular.extend(vm, {
            templateModel: angular.copy(defaultTemplateUploadModel),
            rules: {},
            originTemplate: {},
            exhibits: exhibitService.exhibits,
            mode: 'create',
            loading: true,
            checkPartyBAliases: ['PartyBLegalName', 'PartyBClient'],
            checkSleeveAliases: ['sleeveTrueLegalName', 'Sleeve'],
            templateId: $stateParams.templateId,
            //** functions */
            init: init,
            save: save,
            cancel: cancel,
            isRequiredIdentifier: isRequiredIdentifier,
            removeExhibit: removeExhibit,
            hideAtrribute: hideAtrribute,
            addExhibit: addExhibit,
            showPopupAddAttribute: showPopupAddAttribute,
            checkExhibitsDuplicate: checkExhibitsDuplicate,
            allAttributesAdded: allAttributesAdded,
            isDisabled: isDisabled,
            checkboxSelect: checkboxSelect
        });
        vm.init();

        function init() {
            var requests = getAllRequest(vm.templateId);
            $q.all(requests)
                .then(
                    function (response) {
                        var exhibits = [];
                        setRulesModel(response);
                        if (response.templateModel) {
                            setTemplateModel(response, exhibits);
                        }
                        exhibitService.setExhibits(exhibits);
                    },
                    angular.noop)
                .finally(function () {
                    vm.loading = false;
                });

        }

        function getAllRequest(tempalateId) {
            var requests = {
                rules: BulkUploadService.getUploadTempalateRules().$promise,
                templateModel: null
            };
            if (tempalateId) {
                var params = {
                    templateId: tempalateId
                };
                requests.templateModel = BulkUploadService.getUploadTempalate(params).$promise;
            }
            return requests;
        }

        function setRulesModel(data) {
            vm.rules = data.rules;
            setDefaultRules();
        }

        function setDefaultRules() {
            vm.templateModel.forEach(function (row) {
                var attrRule = vm.rules[row.fieldRuleIdentifier];
                if (attrRule !== undefined) {
                    row.rule = attrRule.defaultValue;
                }
            });
        }

        function setTemplateModel(data, exhibits) {
            vm.originTemplate = data.templateModel;
            data.templateModel.templateFields.forEach(function (row) {
                if (row.fieldIdentifier.indexOf('Exhibit Column') > -1) {
                    exhibits.push(row);
                }
                else {
                    vm.templateModel.forEach(function (model) {
                        if (model.fieldIdentifier === row.fieldIdentifier) {
                            row.isShow = true;
                            model = angular.extend(model, row);
                        }
                    });
                }
            });
        }

        function save() {
            setSubmittedForm();
            if ($scope.uploadTemplateForm.$invalid) {
                showWarningAlert();
            } else if (checkForAddingAttr()) {
                modalsService.openWarningPopup({
                    body: 'Masterlist Identifier is selected as ‘Optional’. Add Investment Manager attribute?',
                    title: 'Warning',
                    successBtn: 'Ok',
                }).result.then(function () {
                    vm.templateModel.forEach(function(item) {
                        if (item.alias === 'InvestmentManager') {
                            item.isShow = true;
                        }
                    });
                }, angular.noop);
            } else if(isSomeSleeveAttrVisible(vm.checkSleeveAliases) && !isSomeChecked(vm.checkSleeveAliases)){
                 showWarningAlert()
            } else if (!vm.originTemplate.templateName){
                showPopupToSetTemaplateName();
            } else {
                sendToSave(vm.originTemplate.templateName);
            }
        }

        function setSubmittedForm() {
            $scope.uploadTemplateForm.$setSubmitted();
            vm.checkExhibitsDuplicate();
        }

        function checkForAddingAttr() {
            var masterlistIdentifier = vm.templateModel.filter(function(item) {
                return item.alias === 'masterlistIdentifier'
            });
            var investmentManager = vm.templateModel.filter(function(item) {
                return item.alias === 'InvestmentManager'
            });
            if (masterlistIdentifier[0].rule === 'Optional' && !investmentManager[0].isShow) {
                return true;
            } else {
                return false;
            }
        }

        function showWarningAlert(warningMsg) {
            var warningMsg = '';
            var isSleeveNeedToCheck = isSomeSleeveAttrVisible(vm.checkSleeveAliases);
            var missedAttributeLabelValue = vm.templateModel.filter(function(elem) {
                return !elem.fieldLabel && elem.isShow && !isDisabled(elem);
            });
            var missedExhibitLabelValue = vm.exhibits.filter(function(elem) {
                return !elem.fieldLabel;
            });
            if (missedAttributeLabelValue.length > 0 || missedExhibitLabelValue.length > 0) {
                warningMsg = 'All attributes and exhibits must have label and defined rules.';
            }
            if(checkExhibitsDuplicate()) {
                warningMsg += ' Labels and alias labels can not be duplicated.';
            }
            if ((isSleeveNeedToCheck && !isSomeChecked(vm.checkSleeveAliases))) {
                warningMsg += ' Sleeve Client Identifier needs to be checked as Sleeve Entity Identifier.';
            } else if (!isSomeChecked(vm.checkPartyBAliases)) {
                warningMsg += ' Either Entity True Legal Name or Entity Client Identifier must be selected as Entity Identifier.';
            }
            warningMsg += ' Please fix the error.';
            modalsService.alert({
                class: 'modal-rfa upload-template',
                body: warningMsg
            }).result;
        }

        function showPopupToSetTemaplateName() {
            var popupData = {
                templateName : vm.originTemplate.templateName
            };
            modalsService.open({
                template: 'bulk-upload/create-template/modal/template-name/template-name',
                controller: 'addTemplateName',
                controllerAs: 'vm',
                templateModel: popupData,
                backdrop: 'static'
            }).result.then(sendToSave);
        }

        function sendToSave(templateName) {
            vm.loading = true;
            var uploadTemplateData = {
                template: vm.templateModel,
                exhibits: vm.exhibits,
                templateName: templateName
            };
            if (vm.templateId) {
                uploadTemplateData.templateId = vm.templateId;
                BulkUploadService.putUploadTempalate(uploadTemplateData).$promise.then(response).finally(loadingOff);
            } else {
                BulkUploadService.postUploadTempalate(uploadTemplateData).$promise.then(response).finally(loadingOff);
            }
        }

        function loadingOff() {
            vm.loading = false;
        }

        function response(response) {
            if (response.data && response.data.message && response.data.message.length > 0) {
                modalsService.alert({
                    class: 'modal-rfa upload-template',
                    body: response.data.message
                }).result;
            } else {
                $state.go('rfa.bulk-upload.template');
            }
        }

        function cancel() {
            if ($scope.uploadTemplateForm.$dirty) {
                modalsService.openWarningPopup({
                    body: 'No changes will be saved. Confirm action.',
                    title: 'Warning'
                }).result.then(function () {
                    back();
                }, angular.noop);
            } else {
                back();
            }
        }

        function allAttributesAdded() {
            var notSelectedAttributes = vm.templateModel.filter(function(elem) {
                return elem.isShow === false;
            });
            return notSelectedAttributes.length === 0;
        }

        function isDisabled(row) {
            if (row.fieldIdentifier === 'Action' && row.rule !== 'Blank') {
                row.fieldLabel = '';
                return true;
            }
            return false;
        }

        function checkboxSelect(row) {
            var index, aliasArray, deselected;
            if (vm.checkSleeveAliases.indexOf(row.alias) > -1) {
                index = vm.checkSleeveAliases.indexOf(row.alias);
                aliasArray = angular.copy(vm.checkSleeveAliases);
                aliasArray.splice(index, 1);
                deselected = aliasArray[0];
            } else if (vm.checkPartyBAliases.indexOf(row.alias) > -1) {
                index = vm.checkPartyBAliases.indexOf(row.alias);
                aliasArray = angular.copy(vm.checkPartyBAliases);
                aliasArray.splice(index, 1);
                deselected = aliasArray[0];
            }
            vm.templateModel.forEach(function(elem) {
                if (elem.alias === deselected) {
                    elem.entityIdentifier = false;
                }
            });
        }

        function showPopupAddAttribute() {
            rulesService.showPopup(vm.templateModel)
                .then(
                    rulesService.showAttribute.bind(this, vm.templateModel)
                );
        }

        function removeExhibit(exhibit) {
            exhibitService.removeExhibit(exhibit);
        }

        function addExhibit() {
            exhibitService.addExhibit();
        }

        function hideAtrribute(attr) {
            attr.entityIdentifier = null;

            rulesService.hideAtrribute(attr);
        }

        function checkExhibitsDuplicate() {
            return exhibitService.setDuplicateExhibits($scope.uploadTemplateForm);
        }

        function isRequiredIdentifier(attr) {
            if (vm.checkSleeveAliases.indexOf(attr.alias) > -1) {
                var isRequired = isSomeChecked(vm.checkSleeveAliases);
                return !isRequired;
            } else if (vm.checkPartyBAliases.indexOf(attr.alias) > -1) {
                var isRequired = isSomeChecked(vm.checkPartyBAliases);
                return !isRequired;
            } else {
                return true;
            }
        }

        function isSomeChecked(checkingAliases) {
            var isEitherChecked = vm.templateModel.filter(function (model) {
                return checkingAliases.indexOf(model.alias) > -1 && !!model.entityIdentifier;
            }).length > 0;
            return isEitherChecked;
        }

        function isSomeSleeveAttrVisible() {
            var isVisible = vm.templateModel.filter(function (model) {
                return vm.checkSleeveAliases.indexOf(model.alias) > -1 && !!model.isShow;
            }).length > 0;
            return isVisible;
        }

        function back() {
            $state.go('rfa.bulk-upload.template');
        }

        $rootScope.$on('scannerStarted', function(event, args) {
            var notSelectedAttributes = vm.templateModel.filter(function(elem) {
                if (elem.fieldIdentifier === 'Sleeve Client Identifier') {
                    elem.entityIdentifier = true;
                }
            });
        });
    }
})();

