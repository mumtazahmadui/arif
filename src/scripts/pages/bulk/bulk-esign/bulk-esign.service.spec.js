describe('service: BulkEsignService', function () {
    var BulkEsignService,
        $q,
        $httpBackend,
        appConfig,
        CredentialsService,
        hasBSPermission,
        rfaFileDownload;
    beforeEach(function () {
        module('app.services');
        module('rfa.components');
        module(function ($provide) {

            appConfig = {
                api_host: '/rest_api_host/'
            };
            CredentialsService = {
                get: function () {
                    return $q.when()
                },
                post: function () {
                    return $q.when()
                },
                hasPermission: sinon.spy(function () {
                    return hasBSPermission
                }),
                companyType: sinon.spy(function () {
                    return hasBSPermission
                })
            };
            hasBSPermission = false;
            rfaFileDownload = {
                downloadFile: sinon.spy()
            };
            $provide.service('CredentialsService', function () {
                return CredentialsService;
            });
            $provide.service('rfaFileDownload', function () {
                return rfaFileDownload;
            });
            $provide.constant('appConfig', appConfig);
        })
    });

    beforeEach(inject(function (_BulkEsignService_, _$q_, _$httpBackend_) {
        BulkEsignService = _BulkEsignService_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
    }));
    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    describe('method: getSignatureDetails', function () {
        beforeEach(function () {
            var body = {
                data: {
                    rows: [{
                            SS_PLACEHOLDER_COUNT: 2,
                            BS_PLACEHOLDER_COUNT: 4,
                            signatureDetails: '| 1 | John Johnson | 01-Mar-2016'
                        },
                        {
                            SS_PLACEHOLDER_COUNT: 1,
                            BS_PLACEHOLDER_COUNT: 3,
                            signatureDetails: '| 1 | John Johnson | 01-Mar-2016'
                        }
                    ]
                }
            };
            $httpBackend.expectPOST('/rest_api_host/amendmentLetters?action=e-sign&validate')
                .respond(200, body);
        });

        it('should call validation endpoint and CredentialsService and then return array of eligible rfas', function () {
            var response;
            BulkEsignService.getSignatureDetails('101,102,103').then(function (data) {
                response = data.data;
            });
            $httpBackend.flush();
            expect(response.data.rows.length).toBe(2);
        });
        it('should add information on placeholders to each rfa', function () {
            var response;
            BulkEsignService.getSignatureDetails('101,102,103').then(function (data) {
                response = data.data.data.rows;
            });
            $httpBackend.flush();
            expect(response[0].placeholders.length).toBe(2);
            expect(response[1].placeholders[0].prevSignatures[0].date).toEqual('01-Mar-2016');
        });
        xit('should get number of placeholders from a backend response field corresponding to permission', function () {
            hasBSPermission = true;
            var response;
            BulkEsignService.getSignatureDetails('101,102,103').then(function (data) {
                response = data.data.data.rows;
            });
            $httpBackend.flush();
            expect(response[0].placeholders.length).toBe(4);
            expect(CredentialsService.hasPermission.args[0][0]).toEqual('bs.rfa.signatory');
        });
    });
    describe('method: downloadErrorsDocument', function () {
        it('should call rfaFileDownload.downloadFile with proper url argument', function () {
            BulkEsignService.downloadErrorsDocument('101,102,103');
            expect(rfaFileDownload.downloadFile.args[0][0]).toEqual('/rest_api_host/amendmentLetters/error-pdf?rfaIds=101,102,103&action=e-sign')
        });
    });
    describe('method: sign', function () {
        var requestPayload;
        beforeEach(function () {
            $httpBackend.expectPOST('/rest_api_host/amendmentLetters/actions/bulk-sign')
                .respond(function (method, url, data) {
                    requestPayload = JSON.parse(data);
                    return [200, ''];
                });
        });
        it('should POST to bulk esign endpoint a JSON with signature data', function () {
            var rfas = [{
                        signTextDate: new Date(),
                        customTextBlock: 'customTextBlock',
                        validRfaId: '101'
                    },
                    {
                        validRfaId: '102',
                        placeholders: [{
                            selected: true
                        }]
                    }
                ],
                signatureData = {
                    acceptDate: new Date()
                },
                user = {
                    userId: '12345'
                };
            BulkEsignService.sign(rfas, signatureData, user);
            $httpBackend.flush();
            expect(requestPayload.length).toEqual(2);
            expect(requestPayload[1].amendmentId).toEqual(rfas[1].validRfaId);
            expect(requestPayload[1].placeholdersSigned[0]).toEqual(1);
        });
    });
});