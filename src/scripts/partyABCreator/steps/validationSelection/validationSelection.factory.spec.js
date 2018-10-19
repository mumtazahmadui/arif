describe('service: partyABCreator.validationSelection', function () {
    var validationSelection,
        CredentialsService,
        AmendmentLetter,
        modificationFilter,
        $q,
        user;
    beforeEach(function () {
        var user = {
            userId: 10101,
            companyId: 101010
        };
        module('partyABCreator');
        module(function ($provide) {
            CredentialsService = {
                userId: sinon.spy(function () {
                    return user.userId
                }),
                companyId: sinon.spy(function () {
                    return user.companyId
                })
            }
            AmendmentLetter = {
                validate: sinon.spy(function () {
                    return $q.when();
                })
            }
            modificationFilter = {
                filter: sinon.spy(function () {
                    return [];
                }),
                modified: sinon.spy(function () {
                    return false;
                })
            }
            $provide.service('CredentialsService', function () {
                return CredentialsService;
            });
            $provide.service('AmendmentLetter', function () {
                return AmendmentLetter;
            });
            $provide.service('modificationFilter', function () {
                return modificationFilter;
            });
            $provide.service('ContenAdapter', {});
        });
    });
    beforeEach(inject(function (_$q_, $injector) {
        $q = _$q_;
        validationSelection = $injector.get('partyABCreator.validationSelection');
    }));
    describe('method: transformIn', function () {
        xit('should return object with empty lists in selectedSleeves and autoRemovedSleeves fields when provided with empty object', function () {
            var result = validationSelection.transformIn({});
            expect(result.selectedSleeves.length).toEqual(0);
            expect(result.autoRemovedSleeves.length).toEqual(0);
        });
        xit('should divide partyBEntities field in input data to sleeves and party Bs', function () {
            var data = {
                    RFA: [{
                        partyBEntities: [{
                            entity: {}
                        }, {
                            entity: {
                                isSleeve: true
                            }
                        }]
                    }]
                },
                result = validationSelection.transformIn(data);
            expect(result.selectedSleeves[0]).toEqual(data.RFA[0].partyBEntities[1]);
            expect(result.selectPartyB[0]).toEqual(data.RFA[0].partyBEntities[0]);
        });
    });
    describe('method: transformOut', function () {
        xit('should add copies of items in selectedSleeves to party B arrays for each party A', function () {
            var data = {
                selectedPartyA: [{
                        masterAgreement: {}
                    },
                    {
                        masterAgreement: {}
                    }
                ],
                selectPartyB: [{}],
                selectedSleeves: [{
                    entity: {},
                    someField: 'some-field-value'
                }]
            };
            var result = validationSelection.transformOut(data);
            expect(result.data[0].partyBEntities[1].someField).toEqual(data.selectedSleeves[0].someField);
        });
    });
});