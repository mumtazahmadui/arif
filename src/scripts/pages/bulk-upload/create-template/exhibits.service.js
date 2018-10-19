(function () {
    angular.module('app.bulk.upload')
        .factory('exhibitService', exhibitService);

    function exhibitService(modalsService) {
        var exhibits = [];

        var defaultExhibit = {
            fieldIdentifier: 'Exhibit Column ',
            fieldLabel: '',
            aliasLabel: '',
            entityIdentifier: null,
            isRequired: 0
        };

        return {
            exhibits: exhibits,
            defaultExhibit: defaultExhibit,
            removeExhibit: removeExhibit,
            addExhibit: addExhibit,
            setExhibits: setExhibits,
            setDuplicateExhibits: setDuplicateExhibits
        };

        function setExhibits(params) {
            exhibits.splice(0);
            if (params && params.length > 0) {
                angular.forEach(params, function (row) {
                    exhibits.push(row);
                });
            } else {
                addExhibit();
            }
        }


        function removeExhibit(exhibit) {
            var index = exhibits.indexOf(exhibit);
            if (index > -1) {
                if (isFilled(exhibits[index])) {
                    modalsService.openWarningPopup({
                        body: 'Unsaved information will be lost. Please confirm.',
                        title: 'Warning'
                    }).result.then(function () {
                        remove(index);
                    }, angular.noop);
                } else {
                    remove(index);
                }
            }
        }

        function addExhibit() {
            var newExhibit = angular.copy(defaultExhibit);
            newExhibit.fieldIdentifier += (exhibits.length + 1);
            exhibits.push(newExhibit);
        }

        function isFilled(row) {
            return !!(row.fieldLabel.length || row.aliasLabel.length);
        }

        function remove(index) {
            exhibits.splice(index, 1);
            exhibits.forEach(function(item, i) {
                item.fieldIdentifier = 'Exhibit Column ' + (i + 1);
            });
        }

        function setDuplicateExhibits(uploadTemplateForm) {
            var isDuplicate = false,
                hashExhibit = {},
                hashExhibitAlias = {};
            exhibits.forEach(function (row, key) {
                var id = 'exhibit' + (key + 1),
                    aliasId = id + 'alias',
                    label = row.fieldLabel,
                    alias = row.aliasLabel;
                uploadTemplateForm[id].$setValidity('isDuplicate', true);
                uploadTemplateForm[aliasId].$setValidity('isDuplicate', true);
                if (hashExhibit[label] || hashExhibitAlias[label]) {
                    isDuplicate = true;
                    uploadTemplateForm[id].$setValidity('isDuplicate', false);
                }
                if (hashExhibit[alias] || hashExhibitAlias[alias]) {
                    isDuplicate = true;
                    uploadTemplateForm[aliasId].$setValidity('isDuplicate', false);
                }
                hashExhibit[label] = true;
                if (alias) {
                    hashExhibitAlias[alias] = true;
                }
            });
            return isDuplicate;
        }
    }
})();