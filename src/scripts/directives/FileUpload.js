/**
 * File Upload
 * ### Used for:
 *
 *     Global
 *
 * @author JuliusGromyko <IGromyko@luxoft.com>
 */

angular.module('app.directives').directive('fileUpload', fileUpload);

function fileUpload(FileUploader, appConfig) {
    return {
        restrict: 'E',
        templateUrl: '/views/directives/FileUpload.html',
        scope: {
            onLoad: '&'
        },
        compile: function() {
            return {
                pre: function(scope) {
                    scope.uploader = new FileUploader();
                    scope.uploader.url = appConfig.api_host + 'file';
                    scope.uploader.autoUpload = true;
                    scope.uploader.onSuccessItem = function(item) {
                        scope.onLoad = scope.onLoad();
                        scope.onLoad(item.file.name);
                    };
                    scope.uploader.onErrorItem = function() {
                    };
                }
            };
        }
    };
}
