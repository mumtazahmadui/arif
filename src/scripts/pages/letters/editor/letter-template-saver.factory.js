angular.module('rfa.letters.editor').factory('letterTemplateSaver', [
    'modalsService',
    'LetterTemplate',
    'saveEditorStream',
    '$q',
    '$state',
    function(modalsService,
        LetterTemplate,
        SaveEditorStream,
        $q,
        $state
    ) {

        function inputNameStep(data) {
            if (data.name) {
                var def = $q.defer();
                def.resolve(data);
                return def.promise;
            }

            return modalsService.open({
                'template': 'letters/modal/letter-template-save',
                'controller': 'LetterTemplateSave',
                'data': data,
                backdrop: false,
                'title': 'Save Letter Template as',
                'class': 'modal-rfa'
            }).result;
        }

        function showErrorStep(data, message) {
            var body = data.data ?
                data.data.message : message || data.message;
            return modalsService.alert({
                'class': 'modal-rfa',
                'title': 'Error',
                'body': body
            }).result;
        }

        function letterSaveConfirmStep(data) {
            return modalsService.alert({
                'title': 'Letter Template Saved',
                'class': 'modal-rfa',
                body: data.data.name
            }).result;
        }

        function redirectStep() {
            var defer = $q.defer();
            $state.go('rfa.letterTemplates');
            defer.resolve(null);
            return defer.promise;
        }

        function saveStep(data) {
            var defer = $q.defer();
            var method = (data.id === undefined) ? 'post' : 'put';
            LetterTemplate[method](data).success(function(response) {
                if ((response.message !== 'Success') ||
                    (response.data !== undefined && response.data.errorCode !== undefined)) {
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

        function save(data) {
            var defer = $q.defer();
            var dontRedirect = arguments[1];
            var isNotShowError = ['backdrop click', 'cancel'];
            var stream = new SaveEditorStream(data);
            stream.clean();

            stream.getQueue().push(function(done) {
                done(null, data);
            });

            stream
                .pipe(inputNameStep)
                .pipe(saveStep)
                .pipe(letterSaveConfirmStep)
                .pipe(!dontRedirect ? redirectStep : false)
                .execute(function(err) {
                    if (-1 === isNotShowError.indexOf(err) && err) {
                        showErrorStep(
                            err, 'Letter Template already exist with this name. Please choose a different name.'
                        );
                        defer.reject(err);
                    } else {
                        defer.resolve();
                    }
                });
            return defer.promise;
        }

        return {
            save: save
        };
    }
]);
