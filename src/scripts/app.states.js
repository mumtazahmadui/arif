(function(){
    'use strict';

    var dashboardLink = '/rfa/company/amendmentLetter';

    function loadData(CredentialsService) {
        return CredentialsService.get();
    }

    angular.module('app')
        .config(function($stateProvider, $urlRouterProvider){
            $stateProvider
                .state('rfa', {
                    url: '/rfa/company',
                    template: '<ui-view></ui-view>'
                })
                .state('rfa.dashboard', {
                    url: '/amendmentLetter',
                    templateUrl: '/scripts/pages/container.html',
                    controller: "ContainerController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })
                .state('rfa.letterTemplates', {
                    url: "/letterTemplate",
                    templateUrl: "/scripts/pages/letters/list/list.html",
                    title: "Letter Template Library",
                    controller: "LettersListController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: ['CredentialsService', function(CredentialsService) {
                            return CredentialsService.get();
                        }]
                    }
                })
                .state('rfa.masterlist-create', {
                    url: "/masterlist/create",
                    templateUrl: "/scripts/pages/masterlist/masterlist-create/masterlistCreate.template.html",
                    controller: "masterlistCreateController",
                    controllerAs: 'mstCreate',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })
                .state('rfa.amendmentDraft', {
                    url: "/amendmentDraft/:contentId",
                    templateUrl: "/scripts/pages/amendment-draft/amendment-draft-text-editor.html",
                    controller: "AmendmentDraftTextEditorController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })
                .state('rfa.amendmentDraftWithId', {
                    url: "/amendmentDraft/:contentId/:amendmentId",
                    templateUrl: "/scripts/pages/amendment-draft/amendment-draft-text-editor.html",
                    controller: "AmendmentDraftTextEditorController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })
                .state('rfa.exhibitTemplateItem', {
                    url: '/exhibitTemplate/:contentId',
                    templateUrl: '/scripts/pages/exhibit/exhibit-template/editor/exhibit-editor.html',
                    controller: 'exhibitTemplateEditorController',
                    controllerAs: 'exhTempEdCtrl',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: ['CredentialsService', function(CredentialsService) {
                            return CredentialsService.get();
                        }]
                    }
                })
                .state('rfa.exhibitTemplateList', {
                    url: '/exhibitTemplate',
                    templateUrl: '/scripts/pages/exhibit/exhibit-template/list/exhibit-list.html',
                    controller: 'exhibitListController',
                    controllerAs: 'exhListCtrl',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: ['CredentialsService', function(CredentialsService) {
                            return CredentialsService.get();
                        }]
                    }
                })

                .state('rfa.esign-bs', {
                    url: "/esign-bs/:amendmentId/:fileId",
                    templateUrl: "/scripts/pages/esign/esign-buyside.html",
                    controller: "RFAESignBuysideController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })
                .state('rfa.esign-ss', {
                    url: "/esign-ss/:amendmentId/:fileId",
                    templateUrl: "/scripts/pages/esign/esign-sellside.html",
                    controller: "RFAESignSellsideController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })
                .state('rfa.amendmentReview', {
                    url: "/amendmentReview/:contentId/:exhibitId",
                    templateUrl: "/scripts/pages/review/review-editor.html",
                    controller: "RFAReviewEditorController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })
                .state('rfa.bulk-upload', {
                    url: "/bulk-upload",
                    templateUrl: "/scripts/pages/bulk-upload/bulk-upload.html",
                    controller: "bulkUploadController",
                    controllerAs: 'vm',
                    reloadOnSearch: false,
                    resolve: {
                        loadData: loadData
                    }
                })

            ;
            $urlRouterProvider.when('/', dashboardLink);
            $urlRouterProvider.when('', dashboardLink);
        })
        .run(function($rootScope, $modalStack){
            $rootScope.$on('$locationChangeStart', function () {
                var openedModal = $modalStack.getTop();
                if (openedModal) {
                    $modalStack.dismiss(openedModal.key);
                }
            });
        });
})();
