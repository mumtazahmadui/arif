describe("ExhibitValueFileUploadModalController:Controller", function() {

    var $controller,
        $scope,
        rfaFileUploadSpy,
        defer,
        instance,
        fileMock = {
            headers: function(header){
                return {
                    location: 'http://somewhere.com/download_file/143'
                }[header]
            }
        }, errorMock = {
            status: 400,
            statusText: "Unexpected error"
        };


    function createControllerInstance(){
        console.log('createControllerInstance', $controller)
        instance = $controller("ExhibitValueFileUploadModalController", {
            $scope: $scope,
            rfaFileUpload: rfaFileUploadSpy,
            data: {
                ids: [10,11,12]
            }
        });
        instance.file = {
            name: 'file-for-upload.xls'
        }
    }

    beforeEach(module("app"), module("app.bulk.exhibitValueUploadr"));


    beforeEach(inject(function(_$controller_, _$rootScope_, _$q_){
        $controller = _$controller_;
        console.log('beforeEach', $controller)
        $scope = _$rootScope_.$new();
        $scope.$close = sinon.spy();
        defer = _$q_.defer();
        rfaFileUploadSpy = {
            fileUpload: sinon.spy(function(){
                return defer.promise;
            })
        }
    }));


    xit("Check is controller load", function() {
        createControllerInstance();
        instance.upload();
        $scope.$digest();
        defer.resolve(fileMock);
        // $scope.$digest();
        expect(rfaFileUploadSpy.fileUpload.calledOnce).toBe(true);
    });

    xit("Check is controller load", function() {
        createControllerInstance();
        instance.upload();
        $scope.$digest();
        fileMock = [{
            FILE_ID: '143'
        }];
        defer.resolve(fileMock);
        // $scope.$digest();
        // expect($scope.$close.calledOnce).toBe(true);
    });

    xit("Check if file upload cause error", function() {
        createControllerInstance();
        instance.upload();
        $scope.$digest();
        defer.reject(errorMock);
        $scope.$digest();
        expect($scope.$close.calledOnce).toBe(true);
    });

    xit("Check if file upload cause error with normal status", function() {
        createControllerInstance();
        instance.upload();
        $scope.$digest();
        errorMock.status = 200;
        errorMock.statusText = 'OK';
        defer.reject(errorMock);
        $scope.$digest();
        expect(errorMock.statusText).toBe("Incorrect file format. Please upload excel workbook.");
    });



});