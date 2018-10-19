(function(){
    'use strict';

    angular.module('app.bulk.exhibitValueUpload')
        .controller('ExhibitValueFileUploadModalController', [
            '$scope',
            'rfaFileUpload',
            'data',
            ExhibitValueFileUploadModalController
        ])
    ;

    function ExhibitValueFileUploadModalController($scope, rfaFileUpload, modalParams) {
        var vm = this,
            ids = modalParams.ids.join(),
            upload = function() {
                vm.loaded = false;

                function makeFinalUpload(){
                    vm.loaded = false;
                    rfaFileUpload.fileUpload(vm.file, 'batches/templates', {
                        rfaIdList: ids,
                        type: 'exhibit-value'
                    }).then(function(data){
                        var decodedString;

                        if (data.data) {
                            decodedString = String.fromCharCode.apply(null, new Uint8Array(data.data));
                        }

                        if (decodedString) {
                            var resp = JSON.parse(decodedString);
                            vm.errorOccurred = true;
                            vm.errorMsg = resp.data.message;
                            vm.loaded = true;
                        } else if(data.errorCode) {
                            vm.errorOccurred = true;
                            vm.errorMsg = data.msg;
                            vm.loaded = true;
                        } else {
                            vm.loaded = true;
                            var fileId = data.headers && data.headers("location") || data[0].fileId,
                                matcher = /\/download_file\/(.*)/,
                                errorFileId = data.headers && data.headers("error-location") || (data[0] && data[0].errorFileId),
                                mtch = fileId.match(matcher),
                                result = {}
                            ;

                            if(errorFileId && errorFileId !== 'null') {
                                var errMtch = errorFileId.match(matcher);
                                if(errMtch) {
                                    errorFileId = errMtch[1];
                                }

                                angular.extend(result, {
                                    errorMessage: "Exhibit value upload failed. Please review Error Report for details.<br>Note exhibit can only be edited in Exhibit Template Library.",
                                    errorFileId: errorFileId
                                });
                            }
                            if(mtch) {
                                fileId = mtch[1];
                            }

                            angular.extend(result, {
                                fileId: fileId,
                                fileName: vm.file.name
                            });
                            $scope.$close(result);

                        }
                        }, function(data) {
                            //when error
                            vm.loaded = true;
                            if(data.status === 200 && data.statusText === 'OK') data.statusText = "Incorrect file format. Please upload excel workbook.";
                            $scope.$close({
                                errorMessage: data.statusText
                            });
                        }
                    );                    
                }
                makeFinalUpload();



            }
        ;
        vm.upload = upload;
        vm.loaded = true;


    }
})();
