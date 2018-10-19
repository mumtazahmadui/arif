angular.module('rfa.dashboard').controller('bulkNtfToSignModalController',
    function (
        $scope,
        $rootScope,
        AmendmentLetter,
        CredentialsService,
        appConfig,
        rfaFileDownload,
        $q,
        bulkActionSubmit,
        modalsService,
        data,
        $http
    ) {

        var vm = this;
        vm.loaded = false;
        vm.users = [];
        vm.amendmentLetters = [];
        vm.RFAs = data.selectedRows.map(function(row) {
            return row.id;
        });
        vm.partyBIds = data.selectedRows.reduce(function(acc, row) {
            return acc.concat(row.partyBAdded.map(function(pB) {
                return pB.id;
            }));
        }, []);
        vm.downloadError = downloadError;
        vm.close = close;
        vm.save = save;
        vm.checkEnabled = checkEnabled;
        vm.previewEmail = previewEmail;

        vm.isESign = true;
        vm.isWSign = false;
        vm.customNotificationMessage = '';

        init().then(function (results) {
            //console.log(results)
            vm.amendmentLetters = results.amendmentLetters.data.data.rows;
            vm.notEligibCount = vm.RFAs.length - vm.amendmentLetters.length;
            vm.users = results.users.data.data;
            vm.errorLink = results.amendmentLetters.headers('error-location');
            vm.loaded = true;

            $scope.$watch(function () {
                return vm.customNotificationMessage
            }, function (newVal, oldVal) {
                if (newVal.length > 500) {
                    vm.customNotificationMessage = oldVal;
                }
            });
        }, function () {
            vm.loaded = true;
        });

        function init() {
            var user = CredentialsService.hasAnyPermissions(['bs.rfa.signatory', 'bs.rfa']) ? 'bs.rfa.signatory' : 'ss.rfa.signatory',
                requests = {
                    amendmentLetters: AmendmentLetter.getAmendmentLetters({
                        ids: vm.RFAs,
                        action: 'signatory-notification&validate'
                    }),
                    users: CredentialsService.getUsers({
                        role: user
                    })
                };
            return $q.all(requests);
        }

        function getSelectedUsers(users) {
            return _.filter(users, function (user) {
                return user.selected;
            });
        }

        function checkEnabled() {
            return getSelectedUsers(vm.users).length && vm.amendmentLetters.length;
        }

        function downloadError() {
            rfaFileDownload.downloadFile(appConfig.api_host + vm.errorLink.replace('/v1', ''));
        }

        function close() {
            $scope.$dismiss();
            $rootScope.$broadcast('bulkActionFinished');
        }

        function save() {
            vm.loaded = false;
            bulkActionSubmit.ntfToSignatories({
                action: 'signatory-notification'
            }, {
                emailRecipients: _.map(getSelectedUsers(vm.users), function (item) {
                    var copy = angular.copy(item);
                    delete copy.selected;
                    return copy;
                }),
                rfaIds: _.map(vm.amendmentLetters, function (item) {
                    return item.validRfaId;
                }),
                isESign: vm.isESign ? 1 : 0,
                isWSign: vm.isWSign ? 1 : 0,
                customNotificationMessage: vm.customNotificationMessage,
            }).$promise.then(function () {
                close();
                $('.modal-backdrop').addClass('white');
                modalsService.open({
                    template: 'dashboard/modal/bulk-actions/common/bulk-completion-saving',
                    class: 'bulk-action-send',
                    backdropClass: 'white',
                    backdrop: 'static'
                });
            }, close);
        }

        function previewEmail() {
            $http.post(appConfig.api_host + 'deskReview/signatory/previewMail', {
                message: vm.customNotificationMessage,
                amendmentIds: vm.RFAs
                    /*_.map(vm.amendmentLetters, function (item) {
                        return item.validRfaId;
                    })*/,
                partyBIds: vm.partyBIds
            }).then(function (response) {
                var myBlob = new Blob([response.data], {type: 'text/html'})
                var url = URL.createObjectURL(myBlob);
                var newWindow = window.open(url, 'newwindow');

            })
        }
    });