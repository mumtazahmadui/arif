angular.module('partyABCreator').factory('partyABCreator.validationSelection', [
    'CredentialsService',
    'AmendmentLetter',
    'modificationFilter',
    'ContenAdapter',
    '$q',
    function (CredentialsService,
        AmendmentLetter,
        modificationFilter,
        ContenAdapter,
        $q) {

        function transformIn(data) {
            var inputData = {
                    savedRFA: data.RFA === undefined ? [] : data.RFA
                },
                partyBsAndSleeves = inputData.savedRFA[0] ? inputData.savedRFA[0].partyBEntities : [],
                partyBEntities = _.filter(partyBsAndSleeves, function (item) {
                    return !item.entity.isSleeve;
                }),
                sleeveEntities = _.filter(partyBsAndSleeves, function (item) {
                    return item.entity.isSleeve;
                });

            if (sleeveEntities.length) {
                inputData.showSleevesSelection = true;
            }
            inputData.selectPartyB = mergePartiesB(partyBEntities);
            inputData.selectedSleeves = sleeveEntities;
            inputData.autoRemovedSleeves = [];
            inputData.ignoreIndex = inputData.savedRFA !== undefined ?
                _.map(inputData.selectPartyB, function (entity) {
                    return entity.entity.id;
                }) : [];
            inputData.ignoreSleeveIndex = _.map(inputData.selectedSleeves, function (entity) {
                return entity.entity.id;
            });
            inputData.flow = data.flow;

            return inputData;
        }

        function getPartyBToMerge(arr, selectPartyBItem) {
            return _.find(arr, function (partyB) {
                    return partyB.entity.id === selectPartyBItem.entity.id;
            });
        }

        function mergePartiesB(selectPartyB) {
            var returnData = [];
            for (var y = 0, l = selectPartyB.length; y < l; y++) {
                if (!modificationFilter.filter(selectPartyB[y])) {
                    returnData.push(selectPartyB[y]);
                    continue;
                }

                var partyBToMerge = getPartyBToMerge(returnData, selectPartyB[y]);
                if (partyBToMerge) {
                    if (partyBToMerge.fundNameChange) {
                        partyBToMerge.exhibitValueChange = selectPartyB[y].exhibitValueChange;
                        partyBToMerge.eid = selectPartyB[y].id;
                    } else {
                        partyBToMerge.fundNameChange = selectPartyB[y].fundNameChange;
                        partyBToMerge.fid = selectPartyB[y].id;
                    }
                } else {
                    if (selectPartyB[y].fundNameChange) {
                        selectPartyB[y].fid = selectPartyB[y].id;
                    } else {
                        selectPartyB[y].eid = selectPartyB[y].id;
                    }
                    returnData.push(selectPartyB[y]);
                }
            }
            return returnData;
        }

        function unmergePartiesB(selectPartyB) {
            var returnParties = angular.copy(selectPartyB, []);
            _.each(returnParties, function (partyB) {
                delete partyB.sleeveItems;
            });
            for (var y = 0, l = returnParties.length; y < l; y++) {
                if (modificationFilter.modified(returnParties[y])) {
                    if (returnParties[y].fundNameChange && returnParties[y].exhibitValueChange) {
                        var duplicateEntity = angular.copy(returnParties[y]);
                        if (returnParties[y].changeType === 'exhibitValueChange') {
                            duplicateEntity.deleted = 1;
                            duplicateEntity.entity.deleted = 1;
                            duplicateEntity.id = duplicateEntity.fid;
                            returnParties[y].id = returnParties[y].eid;
                            delete returnParties[y].fundNameChange;
                            delete duplicateEntity.exhibitValueChange;
                        } else if (returnParties[y].changeType === 'fundNameChange') {
                            duplicateEntity.deleted = 1;
                            duplicateEntity.entity.deleted = 1;
                            duplicateEntity.id = duplicateEntity.eid;
                            returnParties[y].id = returnParties[y].fid;
                            delete returnParties[y].exhibitValueChange;
                            delete duplicateEntity.fundNameChange;
                        } else {
                            duplicateEntity.id = duplicateEntity.eid;
                            returnParties[y].id = returnParties[y].fid;
                            delete returnParties[y].exhibitValueChange;
                            delete duplicateEntity.fundNameChange;
                        }
                        delete duplicateEntity.fid;
                        delete duplicateEntity.eid;
                        if (duplicateEntity.id || duplicateEntity.changeType === 'both') {
                            returnParties.push(duplicateEntity);
                        }
                        delete duplicateEntity.changeType;
                    }
                    delete returnParties[y].fid;
                    delete returnParties[y].eid;
                    delete returnParties[y].changeType;
                }
            }
            return returnParties;
        }

        function getSelectedPartyA(extendedData) {
            return (extendedData.savedRFA && extendedData.savedRFA.length) ?
                extendedData.savedRFA :
                extendedData.selectedPartyA;
        }

        function createItemOfSelectedPartyA(selectedPartyA, selectPartyB) {
            var partyA = {};
            angular.copy(selectedPartyA, partyA);
            var partyAObject = {
                'content': recognizedContent(partyA.content, selectPartyB),
                'createdBy': CredentialsService.userId(),
                'isDummy': false,
                'masterAgreement': partyA.masterAgreement ?
                    partyA.masterAgreement : partyA,
                'partyBEntities': selectPartyB,
                'agreed': partyA.agreed,
                id: partyA.id
            };
            if (partyA.letterTemplateId !== undefined) {
                partyAObject.letterTemplateId = partyA.letterTemplateId;
            }
            delete partyAObject.masterAgreement.selected;
            delete partyAObject.masterAgreement.requestName;
            delete partyAObject.masterAgreement.letterTemplateName;
            delete partyAObject.masterAgreement.letterTemplateId;
            delete partyAObject.masterAgreement.content;
            return partyAObject;
        }

        function getSelectedSleeves(extendedData) {
            return _.map(extendedData.selectedSleeves, function (item) {
                var sleeve = angular.copy(item);
                sleeve.is_sleeve = true;
                sleeve.entity.is_sleeve = true;
                return sleeve;
            });
        }

        function transformOut(extendedData) {
            var partyAdata = [];
            var selectedPartyA = getSelectedPartyA(extendedData),
                selectedSleeves = getSelectedSleeves(extendedData),
                selectPartyB = unmergePartiesB(extendedData.selectPartyB)
                .concat(selectedSleeves);
            for (var i = 0; i < selectedPartyA.length; i++) {
                var item = createItemOfSelectedPartyA(selectedPartyA[i], selectPartyB);
                partyAdata.push(item);
            }

            return {
                'userId': CredentialsService.userId(),
                'data': partyAdata,
                'companyId': CredentialsService.companyId()
            };
        }

        /**
         * Check if partyB has the sleeve, will be added the placeholder for the content
         * @param {String} content 
         * @param {Object} partyB 
         * @returns {String}
         */
        function recognizedContent(content, partyB) {
            var isSleeve = false;
            angular.forEach(partyB, function (row) {
                if (!isSleeve && row.is_sleeve !== undefined)
                    isSleeve = true;
            });
            return isSleeve ? getContentWithSleeve(content) : content;

        }

        /**
         * Adaptee content for sleeve
         * @param {Object} content 
         * @returns {String}
         */
        function getContentWithSleeve(content) {
            var adapter = new ContenAdapter(content);
            adapter.adapteeContent();
            return adapter.getBase64Content();
        }
        /**
         *
         * @param data
         * @returns {string}
         */
        function validateRFA(data) {
            var defer = $q.defer();
            AmendmentLetter.validate({
                    'data': data
                })
                .success(function (data) {
                    defer.resolve(data);
                })
                .error(function () {
                    defer.reject();
                });
            return defer.promise;

        }

        return {
            transformIn: transformIn,
            transformOut: transformOut,
            validateRFA: validateRFA
        };
    }
]);