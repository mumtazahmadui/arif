angular.module('app.services').factory('exhibitTemplateSaver', [
    'modalsService',
    'rfaExibitTemplateService',
    'masterAgreementService',
    'saveEditorStream',
    '$q',
    '$location',
    function(
        modalsService,
        rfaExibitTemplateService,
        masterAgreementService,
        SaveEditorStream,
        $q
    ) {

        function linkMasterAgreementStep(data, checkEmpty) {
            var defer = $q.defer();
            if (!data.data.showExhibitLink) {
                defer.resolve(data);
            } else {
                masterAgreementService.put({})
                    .then(function(response) {
                        if (checkEmpty && !response.data.data.length) {
                            defer.resolve(data);
                        } else {
                            modalsService.open({
                                template: 'exhibit/exhibit-template/modal/ExhibitMasterAgreement',
                                controller: 'ExhibitMasterAgreement',
                                class: 'modal-rfa',
                                items: response.data.data
                            }).result.then(function(masterAgreement) {
                                rfaExibitTemplateService
                                .linkMasterAgreement(data.data.id, masterAgreement.id)
                                    .success(function() {
                                        defer.resolve(data);
                                    }).error(function(error) {
                                        defer.reject(error || 'Server error');
                                    });
                            }, function(error) {
                                defer.reject(error || 'Cancel');
                            });

                        }
                    });
            }

            return defer.promise;
        }

        return {
            linkMasterAgreementStep: linkMasterAgreementStep
        };
    }

]);
