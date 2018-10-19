// @ngInject
(function(){
    angular.module('app.bulk.esign')
        .controller('BulkEsignSignController', BulkEsignSignController);
    function BulkEsignSignController($scope, $q, $location, $modal, user, rfas, BulkEsignService, modalsService, appConfig) {
        var vm = this;
        if (!rfas || !rfas.length) {
            $location.path('/rfa/company/amendmentLetter');
        }
        angular.extend($scope, {
            showTermsOfUse: showTermsOfUse,
            rfas: rfas,
            loaded: true,
            userPermission: user.permissions,
            showPreview: showPreview,
            loadSign: loadSign,
            saveChanges: saveChanges
        });
        angular.extend(vm, {
            setAccepted: setAccepted,
            data: {
                esignStyle: '1',
                changeDates: {},
                originName: user.fullName || '',
                name: '',
                title: user.title,
                phone: user.phone,
                mail: user.email
            },
            signatoryStyle: '',
            signaturesPH: [],
            changeDate: changeDate,
            imagetStack: [],
            setEsignDate: setEsignDate,
            companyName: user.companyName
        });
        $scope.$watch('vm.accepted', function() {
            if (!vm.accepted) {
                return;
            }
            vm.data.date = new Date();
        });
        function showTermsOfUse() {
            modalsService.open({
                template: 'esign/modal/TermsOfUse',
                controller: 'TermsOfUse',
                class: 'terms-of-use'
            });
        }
        function changeDate(item) {
            vm.data.changeDates[item + 'Date'] = new Date();
        }
        function setAccepted(value) {
            this.accepted  = value;
            if (value) {
                vm.data.name = vm.data.originName;
                vm.changeDate('accept');
                $scope.previewVisible = true;
                loadSign(1);
            } else {
                $location.path('/rfa/company/amendmentLetter');
            }
        }
        function loadSign(id) {
            if ($scope.previewVisible) {
                vm.signatoryStyle = 'sign-style-' + id;
                vm.data.esignStyle = id;
                $scope.esignImage = appConfig.api_host +
                         'signature/image?certifierName=' + encodeURIComponent(vm.data.name) +
                         '&signatureStyle=' + vm.data.esignStyle +
                         '&title=' + encodeURIComponent(vm.data.title || '') +
                         '&emailId=' + (vm.data.mail || '') +
                         '&signatureStamp=' + encodeURIComponent(vm.data.signText || '')
                ;
                if (vm.imagetStack.indexOf($scope.esignImage) === -1) {
                    vm.imagetStack.push($scope.esignImage);
                }
            }
        }
        function setEsignDate(childScope) {
            childScope.eSignForm.date.$pristine = false;
            vm.changeDate('calendar');
        }
        function showPreview() {
            $scope.previewVisible = true;
            loadSign(1);
        }
        function saveChanges() {
            var signatureData = {
                signStyle: vm.data.esignStyle,
                contactNumber: vm.data.phone,
                title: vm.data.title,
                email: vm.data.mail,
                name: vm.data.name,
                signatureDate: new Date(),
                signature: vm.data.name,
                acceptDate: vm.data.changeDates.acceptDate,
                calendarDate: vm.data.changeDates.calendarDate,
                titleDate: vm.data.changeDates.titleDate
            };

            $scope.loaded = false;
            BulkEsignService.sign(rfas, signatureData, user)
                .then(function() {
                    modalsService.setPopupPosition();
                    return $modal.open({
                        templateUrl: '/scripts/pages/dashboard/modal/bulk-actions/common/bulk-completion-saving.html',
                        class: 'bulk-action-send small-popup modal-rfa',
                        backdropClass: 'white',
                        backdrop: 'static'
                    }).result.then($q.when, $q.when);
                }, function() {
                    $scope.loaded = true;
                    return $q.reject();
                })
                .then(function(){
                    $scope.loaded = true;
                    $location.path('/rfa/company/amendmentLetter');
                });
        }
    }
})();