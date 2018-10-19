// @ngInject
function amendmentLetter($http, appConfig, CredentialsService, textEditorFilterOut, $q, $base64) {
    /* jshint validthis: true */
    return {
        search: search,
        getAmendmentLetters: getAmendmentLetters,
        filterSearch: filterSearch,
        validate: validate,
        save: save,
        update: update,
        updateLetter: updateLetter,
        recall: recall,
        withdrawn: withdrawn,
        rejectionReason: rejectionReason,
        editRFA: editRFA,
        get: get,
        getAmendmentDraft: getAmendmentDraft,
        getPartyBAdditionalContent: getPartyBAdditionalContent,
        getSleeveAdditionalContent: getSleeveAdditionalContent,
        getPartyBRemovalContent: getPartyBRemovalContent,
        getSleeveRemovalContent: getSleeveRemovalContent,
        getPartyBExhibitValueChangeContent: getPartyBExhibitValueChangeContent,
        getPartyBFundNameChangeContent: getPartyBFundNameChangeContent,
        getPartyARelationsContent: getPartyARelationsContent,
        getDatePinnedContent: getDatePinnedContent,
        getHistory: getHistory,
        getAmendmentSignaturePlaceholers: getAmendmentSignaturePlaceholers,
        sendRFA: sendRFA,
        sign: sign,
        getExhibit: getExhibit,
        updateExhibit: updateExhibit,
        setOnboardingReview: setOnboardingReview,
        setLegalReview: setLegalReview,
        getReviewInfo: getReviewInfo,
        getContent: getContent,
        getPartyBAdditionPlaceHolder: getPartyBAdditionPlaceHolder,
        getPartyBRemovalPlaceHolder: getPartyBRemovalPlaceHolder,
        getSleeveAdditionPlaceHolder: getSleeveAdditionPlaceHolder,
        getSleeveRemovalPlaceHolder: getSleeveRemovalPlaceHolder,
        getPartyBExhibitValueChangePlaceHolder: getPartyBExhibitValueChangePlaceHolder,
        getPartyBFundNameChangePlaceHolder: getPartyBFundNameChangePlaceHolder,
        getPartyAPlaceHolder: getPartyAPlaceHolder,
        getDatePinned: getDatePinned,
        updatePartyBAddition: updatePartyBAddition,
        updateSleeveAddition: updateSleeveAddition,
        updatePartyBRemoval: updatePartyBRemoval,
        updateSleeveRemoval: updateSleeveRemoval,
        updateBExhibitValue: updateBExhibitValue,
        updateBFundName: updateBFundName,
        getBSSignaturePlaceHolders: getBSSignaturePlaceHolders,
        getSSSignaturePlaceHolders: getSSSignaturePlaceHolders,
        getDownloadExhibitTemplate: getDownloadExhibitTemplate,
        saveAmendmentContent: saveAmendmentContent,
        updateExhibitSS: updateExhibitSS,
        getLegendItems: getLegendItems,
        gridSearch:gridSearch,
        deleteRfa: deleteRfa
    };

    function getAmendmentLetters() {
        var search = arguments[0],

            url = appConfig.api_host + 'amendmentLetters',
            queryParams = [];

        _.each(search, function (val, key) {
            if (key !== 'ids')
                queryParams.push(key + '=' + val);
        });
        return $http({
            method: 'POST',
            url: url + '?' + queryParams.join('&'),
            data: search.ids,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    //region getBSAndSSSignaturePlaceHolders
    function getBSAndSSSignaturePlaceHolders(params, typeUrl) {
        var url = appConfig.api_host + '/amendmentLetters/' + params.amendmentLetterId +
            typeUrl + params.placeHolderId;
        return $http({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function getAmendmentSignaturePlaceholers(params) {
        var url = appConfig.api_host + '/amendmentLetters/' + params.amendmentLetterId + '/signaturePlaceholders';
        return $http({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function getBSSignaturePlaceHolders(params) {
        return getBSAndSSSignaturePlaceHolders(params, '/buySideSignaturePlaceHolders/');
    }

    function getSSSignaturePlaceHolders(params) {
        return getBSAndSSSignaturePlaceHolders(params, '/sellSideSignaturePlaceHolders/');
    }
    //endregion

    function updatePartyBRemoval(id, data) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBRemovalPlaceHolder/ssResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function updateSleeveRemoval(id, data) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/sleeveRemovalPlaceHolder/ssResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function updateBFundName(id, data) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBFundNameChangePlaceHolder/ssResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function updateBExhibitValue(id, data) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBExhibitValueChangePlaceHolder/ssResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function updatePartyBAddition(id, data) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBAdditionPlaceHolder/ssResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function updateSleeveAddition(id, data) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/sleeveAdditionPlaceHolder/ssResponses',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function getDatePinned(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/datePinnedPlaceHolder'
        });
    }

    function getPartyAPlaceHolder(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyAPlaceHolder'
        });
    }

    function getPartyBAdditionPlaceHolder(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBAdditionPlaceHolder'
        });
    }

    function getSleeveAdditionPlaceHolder(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/sleeveAdditionPlaceHolder'
        });
    }

    function getPartyBExhibitValueChangePlaceHolder(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBExhibitValueChangePlaceHolder'
        });
    }

    function getPartyBRemovalPlaceHolder(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBRemovalPlaceHolder'
        });
    }

    function getSleeveRemovalPlaceHolder(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/sleeveRemovalPlaceHolder'
        });
    }

    function search(params) {
        var data = {
            'userId': CredentialsService.userId(),
            'companyId': CredentialsService.companyId(),
            'companyType': 'BS',
            'task': params.data.task || null,

            'agreementDate': params.data.filters[0].value || null,
            'masterlistIdentifier': params.data.filters[1].value || null,
            'partyA': params.data.filters[2].value || null,
            'partyBAccount': params.data.filters[3].value || null,
            'partyBClientIdentifier': params.data.filters[4].value || null,
            'partyBLei': params.data.filters[5].value || null,
            'actionOnPartyB': params.data.filters[6].value || null,
            'requestStatus': params.data.filters[7].value || null,
            'rfaIds': params.data.filters[8].value || null,
            'agreementType': params.data.filters[9].value || null,
            "submitDate": params.data.filters[10].value || null,

            // 'actionOnPartyB': params.data.filters[4].value || null,
            
            
            
           
            

            'sortBy': params.sortBy || null,
            'sortOrder': params.desc || null,
            'pageSize': params.items_per_page,
            'offSet': params.page
        };

        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/search',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function gridSearch(id) {
        return $http({
            method: 'GET',
            cache: false,
            url: appConfig.api_host + 'filter/grid/' + id
        });
    };

    function sendRFA(data) {
        return $http({
            method: 'POST',
            cache: false,
            url: appConfig.api_host + 'amendmentLetters/' + data.id + '/actions/send_amendment_letter'
        });
    }

    function filterSearch(params) {
        return $http({
            method: 'GET',
            cache: false,
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter_filter/' + params.filterName + '?filterString=' + params.filterString
        });
    };

    function validate(params) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letters/validation',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });
    }

    function get(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/exhibit/' + params.exhibitId
        });
    }

    function getAmendmentDraft(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.id
        });
    }

    function getContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '?fields=content'
        });
    }

    function getPartyBAdditionalContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/partyBAdditionPlaceHolder'
        });
    }

    function getSleeveAdditionalContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/sleeveAdditionPlaceHolder'
        });
    }

    function getPartyBRemovalContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/partyBRemovalPlaceHolder'
        });
    }

    function getSleeveRemovalContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/sleeveRemovalPlaceHolder'
        });
    }

    function getPartyBExhibitValueChangeContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/partyBExhibitValueChangePlaceHolder'
        });
    }

    function getPartyBFundNameChangeContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/partyBFundNameChangePlaceHolder'
        });
    }

    function getPartyBFundNameChangePlaceHolder(id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + id + '/partyBFundNameChangePlaceHolder'
        });
    }

    function getPartyARelationsContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/partyAPlaceHolder'
        });
    }

    function getDatePinnedContent(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/datePinnedPlaceHolder'
        });
    }

    function save(params) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });
    }

    function updateLetter(params) {

        var contentUpdate = $http({
                method: 'PUT',
                url: appConfig.api_host + 'amendmentLetters/' + params.id + '/actions/edit_content',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    content: params.content
                }
            }),
            resDfrds = [contentUpdate];

        if (params.lineBreaks.partyAText) {
            resDfrds.push($http({
                method: 'POST',
                url: appConfig.api_host + 'amendmentLetters/' + params.id + '/partyAPlaceHolder',
                data: {
                    'partyAText': params.lineBreaks.partyAText
                }
            }));
        }

        if (params.lineBreaks) {
            var lineBreaks = [],
                ecc = params.lineBreaks.exhibitControlColumn;
            delete params.lineBreaks.exhibitControlColumn;
            delete params.lineBreaks.partyAText;

            Object.keys(params.lineBreaks).forEach(function (lbName) {
                var lbarr = params.lineBreaks[lbName];
                if (lbarr && lbarr.map) {
                    lineBreaks = lbarr.map(function (item, ind) {
                        return {
                            lineBreakIndex: ind + 1,
                            lineBreakText: item.lineBreakContent,
                            showHeaderText: item.showHeaderText,
                            exhibitControlColumnId: ecc
                        };
                    }) || [];
                    resDfrds.push($http({
                        method: 'POST',
                        url: appConfig.api_host + 'amendmentLetters/' + params.id + '/' + lbName + '/lineBreaks',
                        data: {
                            lineBreaks: lineBreaks
                        }
                    }));
                }
            });
        }

        return $q.all(resDfrds);
    }

    function update(params) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter ',
            headers: {
                'Content-Type': 'application/json'
            },
            data: params.data
        });
    }

    function withdrawn(params) {
        var data = {
            'userId': CredentialsService.userId(),
            'data': params.data,
            'companyId': CredentialsService.companyId()
        };

        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.id + '/withdraw',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function rejectionReason(params) {
        var payload = {};
        payload.reason = $base64.encode(encodeURIComponent(params.reason));
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/actions/rejectWithPayload',
            headers: {
                'Content-Type': 'application/json'
            },
            data: payload
        });
    }

    function editRFA(params) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + params.id + '/actions/edit',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function recall(params) {
        var data = {
            'userId': CredentialsService.userId(),
            'data': params.data,
            'companyId': CredentialsService.companyId()
        };

        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.data + '/recall',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function getHistory(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.id + '/history'
        });
    }

    function sign(params) {
        var sellside = true;
        if (CredentialsService.companyType() === 'BS') {
            sellside = false;
        }

        var data = {
            'data': {
                'signStyle': params.style,
                'contactNumber': params.contactNumber,
                'modifiedBy': CredentialsService.userId(),
                'title': params.title,
                'signText': params.signText,
                'signatureDate': params.date,
                'createdBy': CredentialsService.userId(),
                'email': params.email,
                'name': params.name,
                'userId': CredentialsService.userId(),
                'companyId': CredentialsService.companyId(),
                'companyName': params.companyName,
                'placeholdersSigned': params.placeholdersSigned,
                'sellSide': sellside,
                'signature': params.name
            }
        };

        angular.extend(data.data, params.changeDates);

        return $http({
            method: 'POST',
            url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/amendment_letter/' + params.rfaId + '/sign',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    };

    function getExhibit(params) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + params.amendmentId + '/exhibit/' + params.exhibitId
        });
    }

    //TODO: move to the another service
    function getDiffTableData(tableData) {
        var diff = [];
        tableData.rows.forEach(function (row, index) {
            if (0 === index) {
                return;
            }
            row.forEach(function (item, rowIndex) {
                if (item.name !== item.columnName) {
                    diff.push({
                        partyBId: item.columnIndex,
                        exhibitColumnId: tableData.rows[0][rowIndex].id,
                        cellValue: item.name
                    });
                }
            });
        });
        return diff;
    }

    function updateExhibit(params) {
        console.log('.998 ', params)
        var result = textEditorFilterOut(params.data);
        var data = {
            textContent: result.data.textContent,
            htmlContent: result.data.htmlContent,
            commentlog: params.commentlog,
            changelog: params.changelog,
            partyType: params.partyType
        };
        var diff = getDiffTableData(params.data.tableData);
        if (diff.length) {
            data.cellValues = diff;
        }

        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + params.amendmentId + '/exhibit/' + params.exhibitId,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        });
    }

    function updateExhibitSS(params) {
        console.log("787", params);
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + params.id.contentId + '/exhibit/' + params.id.exhibitId + '/ss',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                textContent: params.content,
                commentlog: params.comments,
                changelog: params.changelog,
                partyType: "SS"
            }
        });
    }

    function updateAmendmentLetterReview(type, request) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'amendmentLetters/' + request.id + '/' + type,
            data: {
                id: request.id
            }
        });
    };

    function resetAmendmentLetterReview(type, request, reviewId) {
        return $http({
            method: 'DELETE',
            url: appConfig.api_host + 'amendmentLetters/' + request.id + '/' + type + '/' + reviewId,
            data: {
                reviewId: reviewId,
                id: request.id
            }
        });
    }

    function processReviewCommand(type, params) {
        return params.state ?
            updateAmendmentLetterReview(type, params.request) :
            resetAmendmentLetterReview(type, params.request, params.reviewId);
    }

    function setOnboardingReview(params) {
        return processReviewCommand('onBoardingReviews', params);
    }

    function setLegalReview(params) {
        return processReviewCommand('legalReviews', params);
    }

    function getReviewInfo(type, request_id, review_id) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/' + request_id + '/' + type + 'Reviews/' + review_id
        });
    }

    function getDownloadExhibitTemplate(ids) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'batches/templates?type=exhibit-value',
            data: JSON.stringify(ids)
        });
    }

    function getDownloadExhibitTemplate(ids) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'batches/templates?type=exhibit-value',
            data: JSON.stringify(ids)
        });
    }

    function saveAmendmentContent(payload) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + payload.id + '/actions/edit_content',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                content: payload.content,
                commentlog: payload.comments,
                changelog: payload.changelog,
                partyType: "SS"
            }
        });
    };

    function getLegendItems(partyType) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'company/' + partyType + '/amendment_letter/'
        });
    }
    function deleteRfa(obj) {
        return $http({
            method: 'PUT',
            url: appConfig.api_host + 'amendmentLetters/' + obj.id + '/actions/deleteAmendment',
            data: {'reason':obj.reason}         
        });
    }
}

angular
    .module('app.services')
    .service('AmendmentLetter', amendmentLetter);