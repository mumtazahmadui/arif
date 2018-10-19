(function () {
    angular.module('rfa.components').directive('quickLinks', quickLinks);

    function quickLinks($location, CredentialsService) {
        return {
            restrict: 'EA',
            scope: {
                buySide: '=',
                showCreateRfaLink: '='
            },
            templateUrl: '/scripts/components/quickLinks/quickLinks.template.html',
            controller: function ($scope, modalsService) {

                $scope.page = $location.path();

                $scope.isSelected = function (link) {
                    return location.href.indexOf(link + '?') > -1 ||
                        location.href.match(link + '$');
                };

                $scope.data = [
                    [{
                        text: 'Create Request for Amendment',
                        url: createNewRFAModal,
                        rules: {
                            side: 'BS',
                            page: [null, '/rfa/company/amendmentLetter']
                        }
                    }, {
                        text: 'View Request for Amendment',
                        url: '/rfa/company/amendmentLetter',
                        rules: {
                            side: 'BS',
                            page: ['!', '/rfa/company/amendmentLetter']
                        }
                    }, {
                        text: 'Create Letter Template',
                        url: '/rfa/company/letterTemplate/new',
                        rules: {
                            side: 'BS',
                            page: [null, null]
                        }
                    }, {
                        text: 'Letter Template Library',
                        url: '/rfa/company/letterTemplate',
                        rules: {
                            side: 'BS',
                            page: [null, null]
                        }
                    }, {
                        text: 'Create Masterlist Template',
                        url: '/rfa/company/masterlist/create',
                        rules: {
                            side: 'BS',
                            page: [null, null],
                            permission: 'ops.edit'
                        }
                    }],
                    [{
                        text: 'View Request for Amendment',
                        url: '/rfa/company/amendmentLetter',
                        rules: {
                            side: 'SS',
                            page: ['!', '/rfa/company/amendmentLetter']
                        }
                    }, {
                        text: 'Masterlists',
                        url: '/rfa/company/masterlist/library',
                        rules: {
                            side: null,
                            page: [null, null]
                        }
                    }, {
                        text: 'Create Exhibit Template',
                        url: '/rfa/company/exhibitTemplate/new',
                        rules: {
                            side: 'BS',
                            page: [null, null]
                        }
                    }, {
                        text: 'Exhibit Template Library',
                        url: '/rfa/company/exhibitTemplate',
                        rules: {
                            side: 'BS',
                            page: [null, null]
                        }
                    }, {
                        text: 'Bulk Upload RFA',
                        url: '/rfa/company/bulk-upload/files',
                        rules: {
                            side: 'BS',
                            page: [null, null],
                            permission: 'RFA-Bulk Upload'
                        }
                    }]
                ];

                $scope.linkTo = function (where) {
                    if (typeof where === 'function') {
                        where();
                    } else {
                        $location.path(where);
                    }
                    return false;
                };

                $scope.showThis = function (rules) {
                    var showByPage = false;
                    var correctSide = rules.side === null || rules.side === $scope.side;
                    var havePermission = !rules.permission || CredentialsService.hasPermission(rules.permission);

                    if (correctSide && havePermission) {
                        if (rules.page[1] === null) {
                            showByPage = true;
                        } else {
                            if (rules.page[1] === $scope.page) {
                                showByPage = true;
                            }
                            if (rules.page[0] === '!') {
                                showByPage = !showByPage;
                            }
                        }
                    }

                    return showByPage;
                };

                $scope.get = function () {
                    var data = angular.copy($scope.data);
                    $scope.side = CredentialsService.companyType();

                    angular.forEach(data, function (col, cId) {
                        angular.forEach(col, function (row, rId) {
                            if ($scope.showThis(row.rules) !== true) {
                                data[cId][rId] = undefined;
                            }
                        });
                        data[cId] = data[cId].filter(function (n) {
                            return n !== undefined;
                        });
                    });
                    return data.filter(function (n) {
                        return n.length !== 0;
                    });
                }();

                $scope.createNewRFAModal = createNewRFAModal;

                function createNewRFAModal() {

                    var modalcreateNewRFA = modalsService.open({
                        'backdrop': 'static',
                        'template': 'modal/CreateNewRFA',
                        'controller': 'CreateNewRFA',
                        'class': 'modal-rfa'
                    });

                    modalcreateNewRFA.result.then(function () {
                    }, function () {
                    });
                }
            }
        };
    }

})();
