(function() {
    angular.module('rfa.exhibit-template-editor').factory('ExhibitTemplate',
        function($http,
                 appConfig,
                 CredentialsService,
                 $q,
                 exhibitAdapter,
                 saveEditorStream,
                 modalsService,
                 rfaExibitTemplateService,
                 masterAgreementService,
                 $location) {
       return {
           get: get,
           save: save
       };

        function get(params) {
            var defer = $q.defer();

            $http({
                method: 'GET',
                cache: false,
                url: appConfig.api_host + 'company/' + CredentialsService.companyId() + '/exhibit_template/' + params.templateId
            }).success(function(data) {
                var editorData = exhibitAdapter(data);
                defer.resolve(editorData);
            }).error(defer.reject);

            return defer.promise;
        }

        function inputNameStep(data) {
            if (data.data.name) {
                var dfr = $q.defer();
                dfr.resolve(data);
                return dfr.promise;
            }

            return modalsService.open({
                template: 'exhibit/exhibit-template/modal/ExhibitSave',
                controller: 'ExhibitSave',
                data: data,
                backdrop: false,
                title: 'Save Exhibit Template as',
                class: 'modal-rfa'
            }).result;
        }

        function saveStep(data) {
            var defer = $q.defer();
            var method = (data.data.id === undefined) ? 'post' : 'put';
            rfaExibitTemplateService[method](data).success(function(response) {
                if ((response.message !== 'Success') || (
                    response.data !== undefined &&
                    response.data.errorCode !== undefined
                    )) {
                    defer.reject(response);
                } else {
                    data.data = response.data;
                    defer.resolve(data);
                }
            }).error(function(error) {
                defer.reject(error);
            });
            return defer.promise;
        }

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

        function exhibitSaveConfirmStep(data) {
            return modalsService.alert({
                title: 'Exhibit Template Saved',
                class: 'modal-rfa',
                body: data.data.name
            }).result;
        }

        function redirectStep() {
            var defer = $q.defer();
            $location.path('/rfa/company/exhibitTemplate/');
            defer.resolve(null);
            return defer.promise;
        }

        function showErrorStep(data, message) {
            var body = data.data ?
                data.data.message
                : message || data.message;
            return modalsService.alert({
                class: 'modal-rfa',
                title: 'Error',
                body:  body
            }).result;
        }

        function save(data) {
            var defer = $q.defer();
            var dontRedirect = arguments[1];
            var isNotShowError = ['backdrop click', 'cancel'];

            new saveEditorStream(data)
                .pipe(inputNameStep)
                .pipe(saveStep)
                .pipe(linkMasterAgreementStep, true)
                .pipe(exhibitSaveConfirmStep)
                .pipe(!dontRedirect ? redirectStep : false)
                .execute(function(err) {
                    if (-1 === isNotShowError.indexOf(err) && err) {
                        showErrorStep(
                            err, 'Exhibit Template already exist with this name. Please choose a different name.'
                        );
                        defer.reject(err);
                    } else {
                        defer.resolve();
                    }
                });
            return defer.promise;
        }
    });
})();
