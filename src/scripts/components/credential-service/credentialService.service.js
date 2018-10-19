(function () {
    angular
        .module('app.services')
        .service('CredentialsService', credentialsService);

    function credentialsService($http, appConfig, $q, $window) {
        var vm = this;
        vm.data = {};
        vm.loaded = false;
        vm.loading = false;

        get();

        return {
            get: get,
            getUsers: getUsers,
            userId: userId,
            userName: userName,
            companyId: companyId,
            companyType: companyType,
            sessionId: sessionId,
            hasPermission: hasPermission,
            hasAnyPermissions: hasAnyPermissions,
            auditUser:auditUser,
            getUserSpecific:getUserSpecific,
            getUserNotification:getUserNotification,
            getEscalation:getEscalation
        };

        function get() {
            var setUserData = function (data) {
                vm.data = data;
                vm.loaded = true;
                vm.loading = false;
                window.user_id = data.data.userId;
                window.usercompany_id = data.data.companyId;
                window.companyName = data.data.companyName;
                window.userName = data.data.userName;
                window.phone = data.data.phone;
                window.email = data.data.email;
                window.title = data.data.title;
                window.companyType = data.data.companyType;
                window.permissions = data.data.permissions;

                if (typeof data.data.loginTime === 'string') {
                    var loginTime = data.data.loginTime.split(' ');
                    var first = loginTime.splice(0, 3).join('_');
                    var second = loginTime[0].split(':').join('_');
                    window.sessionId = first + '_' + second;
                }
            };

            if (!vm.loaded && !vm.loading) {
                vm.loading = true;
                vm.request = $http({
                    method: 'GET',
                    url: appConfig.api_host + 'user'
                })
                    .success(function (data) {
                        if (typeof data.data === 'object') {
                            setUserData(data);
                            vm.loaded = true;
                        } else {
                            $window.location.href = '/ms-webapp-rfa/login';
                        }
                    })
                    .error(function () {
                        $window.location.href = '/ms-webapp-rfa/login';
                    });
                return vm.request;
            } else if (vm.loading) {
                return vm.request;
            } else {
                var decoration = $q.when(vm.data);
                decoration.error = function (reasonCallback) {
                    reasonCallback('error');
                };
                decoration.success = function (successCallback) {
                    successCallback(vm.data);
                };
                return decoration;
            }
        }

        function userId() {
            return window.user_id;
        }

        function sessionId() {
            return window.sessionId;
        }

        function companyId() {
            return window.usercompany_id;
        }

        function companyType() {
            return window.companyType;
        }

        function userName() {
            return window.userName;
        }

        function getUsers() {
            var search = arguments[0] || {};
            search.role = search.role || 'ss.rfa.signatory';
            return $http({
                method: 'GET',
                url: appConfig.api_host + 'notification/users' + '?' + $.param(search),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        }

        function hasPermission(permission) {
            if (typeof permission === 'object') {
                for (var i = 0; i < permission.length; i++) {
                    if (window.permissions.indexOf(permission[i]) < 0) {
                        return false;
                    }
                }
                return true;
            } else {
                return window.permissions.indexOf(permission) >= 0;
            }
        }
        function hasAnyPermissions(permission) {
            if(Array.isArray(permission)) {
                return permission.some(function (perm) {
                    return window.permissions.indexOf(perm) > -1;
                });
            } else {
                return hasPermission(permission);
            }
        }

        function auditUser(type) {
            switch(type) {
                case "onboarding":
                    return "ss.rfa.onboarding"
                case "kyc":
                    return "ss.rfa.kyc"
                case "tax":
                    return "ss.rfa.tax"
                case "credit":
                    return "ss.rfa.credit"
                case "legal":
                    return "ss.rfa.legal"
                case "operation":
                    return "ss.rfa.operations"
                case "operations":
                    return "ss.rfa.operations"
                case "manager":
                    return "ss.rfa.manager"
                case "desk1":
                    return "bs.rfa.desk1"
                case "desk2":
                    return "bs.rfa.desk2"
                default:
                   return "default"
            }
        }

        function getUserSpecific(type) {
            var role = auditUser(type);
            return $http({
                method: 'GET',
                url: appConfig.api_host + 'notification/users?role=' + role,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        function getUserNotification(type) {
            var role = auditUser(type);
            return $http({
                method: 'GET',
                url: appConfig.api_host + 'notification/companyOtherUsers?role=' + role,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        function getEscalation() {
            return $http({
                method: 'GET',
                url: appConfig.api_host + 'escalation/companyOtherUsers',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

})();