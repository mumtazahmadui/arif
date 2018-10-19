// @ngInject
function toastr(toastrConfig, $compileProvider) {
    angular.extend(toastrConfig, {
        allowHtml: true,
        closeButton: true,
        closeHtml: '<button>&times;</button>',
        containerId: 'toast-container',
        extendedTimeOut: 1000,
        target: document.createElement('DIV'),
        iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning'
        },
        maxOpened: 0,
        messageClass: 'toast-message',
        newestOnTop: false,
        onHidden: null,
        onShown: null,
        positionClass: 'toast-bottom-right',
        tapToDismiss: true,
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
}

angular
    .module('app.configs')
    .config(toastr);