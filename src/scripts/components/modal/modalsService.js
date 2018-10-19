(function () {
        angular
            .module('app.services')
            .service('modalsService', modalsService);

        function modalsService($modal) {

            if (window.self !== window.parent) {
                $("head").append('<style type="text/css" id="dynamicStyle"></style>');
            }

            var defaultController = ['data', '$scope', function (data, $scope) {
                $scope.data = data;
            }];

            function open (data) {
                setPopupPosition();
                var controller = defaultController;
                if (data.controller) {
                    controller = data.controller;
                    if (!angular.isFunction(data.controller)) {
                        controller += 'ModalController';
                    }
                }
                return $modal.open({
                    templateUrl: data.templateUrl || '/scripts/pages/' + data.template + '.html',
                    controller: controller,
                    windowClass: data.class || '',
                    controllerAs: data.controllerAs,
                    size: data.size,
                    backdrop: _.isUndefined(data.backdrop) ? true : data.backdrop,
                    backdropClass: data.backdropClass,
                    keyboard: _.isUndefined(data.keyboard) ? true : data.keyboard,
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }

            function alert (data) {
                setPopupPosition();
                return $modal.open({
                    templateUrl: '/scripts/pages/modal/AlertInfo.html',
                    controller: defaultController,
                    windowClass: data.class || '',
                    size: data.size,
                    backdrop: _.isUndefined(data.backdrop) ? true : data.backdrop,
                    backdropClass: data.backdropClass,
                    keyboard: _.isUndefined(data.keyboard) ? true : data.keyboard,
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }

            function error (data) {
                setPopupPosition();
                return $modal.open({
                    templateUrl: '/scripts/components/common-popups/error/error.template.html',
                    controller: defaultController,
                    windowClass: data.class || 'modal-rfa',
                    size: data.size,
                    backdrop: _.isUndefined(data.backdrop) ? true : data.backdrop,
                    backdropClass: data.backdropClass,
                    keyboard: _.isUndefined(data.keyboard) ? true : data.keyboard,
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }

            function openRemovePopup (params) {
                setPopupPosition();
                return open({
                    templateUrl: '/scripts/components/common-popups/remove-popup/remove.template.html',
                    controller: 'remove',
                    id: params.id,
                    name: params.name,
                    class: 'modal-rfa'
                });
            }


            function openWarningPopup (data) {
                setPopupPosition();
                return open({
                    templateUrl: '/scripts/components/common-popups/warning/warning.template.html',
                    controller: 'default',
                    class: 'modal-rfa',
                    body: data.body,
                    title: data.title,
                    successBtn: data.successBtn || 'Confirm',
                    cancelBtn: data.cancelBtn || 'Cancel',
                    hideSuccessBtn: data.hideSuccessBtn || false,
                    hideCancelBtn: data.hideCancelBtn || false,
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }

            function setPopupPosition() {
                if (window.self !== window.parent) {
                    var newStyleElement = $("head").children('#dynamicStyle');
                    newStyleElement.html('.modal-dialog{top:' + $(window.parent).scrollTop() + 'px;}');
                }
            }

            return {
                open: open,
                openRemovePopup: openRemovePopup,
                openWarningPopup: openWarningPopup,
                alert: alert,
                error: error,
                setPopupPosition: setPopupPosition
            };

        }
    })();

