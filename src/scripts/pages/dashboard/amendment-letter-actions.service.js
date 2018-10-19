(function () {
    angular.module('app.services')
        .service('AmendmentLetterActions', AmendmentLetterActions);

    function AmendmentLetterActions($state, $q, $http, appConfig, modalsService, AmendmentLetter, bulkActionSendErrors, bulkActionSubmit,myStatusService) {
        var defer = $q.defer(),
            promise = defer.promise;

        return {
            notificationToSignatory: function (selectedRows) {
                if (nothingSelected(selectedRows, 'ntfToSign')) return promise;
                openModal({
                    selectedRows: selectedRows
                });
            },
            notificationOnboarding: function(selectedRows) {
                if (nothingSelected(selectedRows, 'ntfOnBoarding') || checkStatus(selectedRows,'Onboarding','SS')) return promise;
                openModalNotification({
                    rows: selectedRows
                });
            },
            notificationKyc: function(selectedRows) {
                if (nothingSelected(selectedRows, 'ntfkyc') || checkStatus(selectedRows,'KYC','SS')) return promise;
                openModalkyc({
                    rows: selectedRows
                });
            },
            notificationTax: function(selectedRows) {
                if (nothingSelected(selectedRows, 'ntftax')) return promise;
                openModaltax({
                    rows: selectedRows
                });
            },
            notificationCredit: function(selectedRows) {
                if (nothingSelected(selectedRows, 'ntfcredit') || checkStatus(selectedRows,'Credit','SS')) return promise;
                openModalcredit({
                    rows: selectedRows
                });
            },
            notificationLegal: function(selectedRows) {
                if (nothingSelected(selectedRows, 'ntflegal') || checkStatus(selectedRows,'Legal','SS')) return promise;
                openModallegal({
                    rows: selectedRows
                });
            },
            notificationOperations: function(selectedRows) {
                if (nothingSelected(selectedRows, 'ntfoperations')) return promise;
                openModaloperations({
                    rows: selectedRows
                });
            },
            notificationManager: function(selectedRows) {
                if (nothingSelected(selectedRows, 'ntfmanager')) return promise;
                openModalmanager({
                    rows: selectedRows
                });
            },
            notificationBslegal: function (selectedRows) {
                if (nothingSelected(selectedRows, 'ntfBslegal') || checkStatus(selectedRows,'bsdesk1','BS')) return promise;
                openModalBslegal({
                    rows: selectedRows
                });
            },
            notificationBsManager: function (selectedRows) {
                if (nothingSelected(selectedRows, 'ntfBsmanager') || checkStatus(selectedRows,'bsdesk2','BS')) return promise;
                openModalBsManager({
                    rows: selectedRows
                });
            },
            electronicSignature: function (selectedRows) {
                if (nothingSelected(selectedRows, 'eSign')) return promise;

                var amendmentIds = _.reduce(selectedRows, function (memo, item) {
                    return memo + (memo ? ',' : '') + item.id;
                }, '');
                $state.go('rfa.bulk.esign-list', {
                    rfaIds: amendmentIds
                });
            },
            exhibitValueUpload: function (selectedRows) {
                if (nothingSelected(selectedRows, 'exhibitUpload')) return promise;

                var RFAs = _.map(selectedRows, function (item) {
                    return item.id;
                });
                $state.go('rfa.bulk.exhibitValueUpload', {
                    rfaIds: RFAs
                });

            },
            sendNotificationChaser: function (selectedRows) {
                return sendAction(selectedRows, 'chaser', 'sending chaser.');
            },
            sendRFA: function (selectedRows) {
                return sendAction(selectedRows, 'send', 'submission.');
            },
            downloadAndPrint: function (selectedRows) {
                if (nothingSelected(selectedRows, 'downloadAndPrint')) return promise;
                var amendmentIds = selectedRows.map(function (row) {
                    return row.id;
                });
                //console.log('downloadAndPrint', amendmentIds);
                return $http({
                    method: 'POST',
                    url: appConfig.api_host + 'amendmentLetters/actions/rfaid_pdf',
                    data: {
                        amendmentIds: amendmentIds,
                        isDownloadable: true
                    },
                    responseType: 'arraybuffer'
                }).then(function (response) {
                    var filename = "";
                    var matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(response.headers('content-disposition'));
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    } else {
                        filename = "download";
                    }
                    var blob = new Blob([response.data], {type: response.headers('content-type')});
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                });
            },
            uploadSignedRFA: function (selectedRows) {
                if (!Array.isArray(selectedRows)) {
                    if (selectedRows == 'multiSelected') {
                        if (multipleSelected(selectedRows, 'uploadSignedMultipleRFA')) return promise;
                    } else {
                        if (nothingSelected([], selectedRows)) return promise;
                    }
                } else {
                    if (nothingSelected(selectedRows, 'uploadSignedNoRFA')) return promise;
                    if (multipleSelected(selectedRows, 'uploadSignedMultipleRFA')) return promise;
                    return modalsService.open({
                        template: 'dashboard/modal/upload-rfa/upload-rfa',
                        controller: 'UploadRFA',
                        controllerAs: 'vm',
                        class: 'modal-mst-title',
                        backdrop: 'static',
                        size: 'sm',
                        data: {
                            selectedRows: selectedRows
                        }
                    }).result.then(function () {
                        //console.log('UploadRFAModalController done');
                    });
                }
            },
            customNotification: function (selectedRows) {
                if (nothingSelected(selectedRows, 'ntfcustom')) return promise;
                openModalCustomNotification({
                    rows: selectedRows
                });
            }
        };

        function sendAction(rows, action, txt) {
            if (nothingSelected(rows, action)) {
                return promise;
            }
            defer = $q.defer();
            promise = defer.promise;

            var RFAs = rows.map(function (row) {
                    return row.id;
                }),
                request;
            AmendmentLetter.getAmendmentLetters({
                ids: RFAs,
                action: (action + '&validate')
            }).then(function (res) {
                var result = res.data;
                var notEligibCount = result.errorCount;
                var validRFAIds = result.data.rows.map(function (row) {
                        return parseInt(row.validRfaId, 10);
                    }),
                    actionSent = false;

                if (notEligibCount) {
                    var popupConfig = {
                        RFAs: RFAs,
                        link: res.headers('Error-Location'),
                        notEligibCount: notEligibCount,
                        validationAction: action,
                        controller: 'bulkActionSend',
                        controllerAs: 'blkAct',
                        template: 'dashboard/modal/bulk-actions/common/send-action-error',
                        txt: txt,
                        class: 'bulk-action-send small-popup send-action-error'
                    };

                    openErrorModal(popupConfig).result.then(function () {
                    }, function () {
                        if (actionSent) {
                            $('.modal-backdrop').addClass('white');
                            showSuccess();
                        }
                    });
                }

                if (validRFAIds.length) {
                    if (action === 'send') {
                        request = bulkActionSubmit.sendRFA({
                            action: 'bulk-send-rfa',
                            rfaIds: validRFAIds
                        }).$promise;
                    } else {
                        request = bulkActionSubmit.ntfChaser({
                            type: 'chaser',
                            ids: validRFAIds
                        }).$promise;
                    }

                    request.then(function () {
                        if (action === 'send') {
                            defer.resolve();
                        } else {
                            defer.reject();
                        }

                        actionSent = true;

                        if (!$('body').hasClass('modal-open')) {
                            showSuccess();
                        }
                    });
                } else {
                    defer.reject();
                }
            });

            return promise;
        }

        function nothingSelected(rows, action) {
            var customMsg = false;
            var message = null
            if (action === 'ntfBslegal' || action === 'ntfBsmanager') {
                customMsg = true;
                if (action === 'ntfBslegal') message = 'Please select Party B for notification to ' + myStatusService.mystatus.getDesk1Name
                if (action === 'ntfBsmanager') message = 'Please select Party B for notification to ' + myStatusService.mystatus.getDesk2Name
            }
            if (!rows.length) {
                defer.reject();
                openErrorModal({
                    title: 'Error',
                    html:  customMsg ? message :  bulkActionSendErrors[action]
                });

                return true;
            }
        }


        function checkStatus(selectedRows,deskName,userType) {
        	var validStatus=[];
        	if(userType=='SS'){
        		validStatus = ['Received','Partially Completed'];
        	}else if(userType=='BS'){
        		validStatus = ['Draft'];

        		if (deskName === 'bsdesk1'){
                	deskName = myStatusService.mystatus.getDesk1Name;
                }else if (deskName === 'bsdesk2'){
                	deskName = myStatusService.mystatus.getDesk2Name;
                }
        	}

            var isError = false;
            angular.forEach(selectedRows, function (element) {
                if(validStatus.indexOf(element.amendmentStatus) === -1) {
                    isError = true;
                }
            })
            if (isError) {
                defer.reject();
                openErrorModal({
                    title: 'Error',
                    html:  'Selected Account(s) cannot be notified for '+deskName
                });
                return true;
            } else {
                return false;
            }
        }

        function multipleSelected(rows, action) {
            if (rows.length > 1) {
                defer.reject();
                openErrorModal({
                    title: 'Error',
                    html: bulkActionSendErrors[action]
                });

                return true;
            }
        }

        function openErrorModal(configExt) {
            var popupConfig = {
                template: 'dashboard/modal/bulk-actions/common/error',
                class: 'bulk-action-send small-popup',
                backdrop: 'static'
            };
            angular.extend(popupConfig, configExt);

            return modalsService.open(popupConfig);
        }

        function openModal(configExt) {
            var popupConfig = {
                template: 'dashboard/modal/bulk-actions/notification-to-signatory/bulk-notifications-to-signatories',
                controller: 'bulkNtfToSign',
                controllerAs: 'blkNtf',
                class: 'bulk-action-send',
                backdrop: 'static'
            };
            angular.extend(popupConfig, configExt);
            modalsService.open(popupConfig);
        }

        function openModalNotification(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-onboarding/bulk-notifications-to-onboarding',
                controller: 'onboarding',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModalkyc(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-kyc/bulk-notifications-to-kyc',
                controller: 'kyc',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModaltax(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-tax/bulk-notifications-to-tax',
                controller: 'tax',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModalcredit(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-credit/bulk-notifications-to-credit',
                controller: 'credit',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModallegal(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-legal/bulk-notifications-to-legal',
                controller: 'legal',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModaloperations(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-operations/bulk-notifications-to-operations',
                controller: 'operations',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModalmanager(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-manager/bulk-notifications-to-manager',
                controller: 'manager',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModalBslegal(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notification-to-bslegal/bulk-notifications-to-bslegal',
                controller: 'bslegal',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function openModalBsManager(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notification-to-bsmanager/bulk-notifications-to-bsmanager',
                controller: 'bsmanager',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        }

        function showSuccess() {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/common/bulk-completion-saving',
                class: 'bulk-action-send',
                backdropClass: 'white',
                backdrop: 'static'
            });
        }

       /*  function openModalCustomNotification(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/notication-to-operations/bulk-notifications-to-operations',
                controller: 'operations',
                data: configExt,
                class: 'bulk-action-common',
                backdrop: 'static'
            });
        } */

        function openModalCustomNotification(configExt) {
            modalsService.open({
                template: 'dashboard/modal/bulk-actions/custom-notication/custom-notification',
                controller: 'notification',
                data: configExt,
                class: 'csnotification',
                backdrop: 'static'
            });
        }

    }
})();