(function () {
    'use strict';

    angular.module('app.bulk.esign', [])
        .config(function ($stateProvider) {
            $stateProvider
                .state('rfa.bulk.esign-list', {
                    url: '/esign',
                    templateUrl: '/scripts/pages/bulk/bulk-esign/list/bulk-esign-list.html',
                    controller: 'BulkEsignListController',
                    controllerAs: 'BulkEsignListCtrl',
                    params: {
                        rfaIds: []
                    },
                    resolve: {
                        side: ['CredentialsService', function (CredentialsService) {
                            return CredentialsService.get().then(function () {
                                return CredentialsService.companyType() === 'BS' ? 'Buyside' : 'Sellside';
                            });
                        }]
                    }
                })
                .state('rfa.bulk.esign-sign', {
                    url: '/esign/sign',
                    templateUrl: '/scripts/pages/bulk/bulk-esign/sign/bulk-esign-sign.html',
                    controller: 'BulkEsignSignController',
                    controllerAs: 'vm',
                    params: {
                        rfas: {}
                    },
                    resolve: {
                        rfas: function ($stateParams) {
                            return $stateParams.rfas;
                        },
                        user: ['CredentialsService', '$q', function (CredentialsService, $q) {
                            var deferred = $q.defer();
                            CredentialsService.get().success(function (data) {
                                deferred.resolve((data && data.data) ? data.data : {});
                            });
                            return deferred.promise;
                        }]
                    }
                });
        });
})();