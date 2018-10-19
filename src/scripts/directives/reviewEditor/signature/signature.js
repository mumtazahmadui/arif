(function() {

    angular.module('app.directives')
        .directive('signature', [
        'signatureReviewEditor',
        function(SignatureReviewEditor) {
            return {
                restrict: 'C',
                replace: true,
                scope: {
                    value: '@',
                    index: '@'
                },
                templateUrl: '/views/directives/reviewEditor/signature.html',
                link: function($scope, element) {
                    $scope.$parent.loaded = false;

                    var index = $scope.index;

                    var getType = function() {
                        var id = element.attr('id');
                        return id.substr(0, 2).toUpperCase();
                    };

                    var render = function(data) {
                        if (!data.images || !data.images.length) {
                            if (getType() === 'BS') {
                                element.empty();
                                element.addClass('empty');
                            }
                            return;
                        }

                        $scope.value = '';

                        var DEFAULT_IMAGE_TYPE = 'data:image/gif;base64';
                        var imageType = (data.imageType || DEFAULT_IMAGE_TYPE) + ',';

                        var length = data.images.length;
                        var images = document.createDocumentFragment();
                        data.images.forEach(function(imgData, index) {
                            var img = document.createElement('IMG');
                            img.setAttribute('src', imageType + imgData);
                            images.appendChild(img);
                            if (index !== length - 1) {
                                images.appendChild(document.createElement('BR'));
                            }
                        });
                        element.empty();
                        element.append(images);
                    };

                    SignatureReviewEditor.getData({
                        type: getType(),
                        placeHolderId: index,
                        queueService: $scope.$parent.queueService,
                        amendmentLetterId: $scope.$parent.amendmentId,
                        onStart: function() {
                        }
                    }).then(render);
                }
            };
        }]);
})();
