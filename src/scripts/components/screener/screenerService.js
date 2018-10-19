// @ngInject
function screenerService($rootScope, screenerConfigsFactory, $sessionStorage, CredentialsService, rfaGridSelection, appConfig, $http) {
    /* jshint validthis: true */
    return {
        get: get,
        set: set,
        update: update,
        call: call,
        data: {},
        mystatus:[],
        expandAccordion:false,
        isDashboard : true,
        $storage: $sessionStorage,
        getStatus: getStatus,
        setexpandAccordion:setexpandAccordion,
        collapseAccordion:collapseAccordion,
        getGridSearchQuery:getGridSearchQuery,
        isDashboards: isDashboards,
        gridUrlFilterFlag : true,
        onCompletedTabs: false,
    };

    function get(name) {
        var sessionId = CredentialsService.sessionId();
        if (name) {
            var extention = screenerConfigsFactory.get(name);
            angular.extend(this.data, extention);
            this.data.id = name;
            if (this.$storage.sessionId !== sessionId || typeof this.$storage.sessionId === "undefined" || typeof sessionId === "undefined") {
                this.$storage.$reset();
                this.$storage.sessionId = sessionId;
            }
        }
        return this.data;
    }

    function set(data, server) {
        this.data = data;
        this.update(server);
    }

    function update(server) {
        $rootScope.$broadcast('screenerUpdate', server);
        rfaGridSelection.updateStatus();
    }

    function call(data) {
        var isIgnoreName = ['legalStatus','managerStatus'];
        var value = 'Draft'
        var name = data.name;
        var userRole;
        if (isIgnoreName.indexOf(name) !== -1) {
            if (name == 'legalStatus') userRole = 'bs.rfa.desk1';
            if (name == 'managerStatus') userRole = 'bs.rfa.desk2';
            var isUserAllow = CredentialsService.hasPermission(userRole);
            if(!isUserAllow) return

            var id = data.params.index;
            var amendmentStatus = data.params.grid.dataList[id].amendmentStatus.displayName;
            if (amendmentStatus === value){
                $rootScope.$broadcast('screenerCall', data);
            }
        } else {
            $rootScope.$broadcast('screenerCall', data);
        }
    }
   
    function getStatus() {
        return $http({
            method: 'GET',
            url: appConfig.api_host + '/dashboard/myStatusLegend/'
        });
    }

    function setexpandAccordion(data) {
        var id = data.filters[5].id;
        var value = (data.filters[5].value && data.filters[5].value.length) ? true : false;
        if (id === 'my_status' && value) {
            this.expandAccordion = true;
        } else {
            this.expandAccordion = false;
        }
    }

    function collapseAccordion() {
        this.expandAccordion = false;
    }

    function getGridSearchQuery(){
      return {
          'action':getUrlParameter("action"),
          'filterId':getUrlParameter("filterId")
      }
    }

    function isDashboards(value) {
        this.isDashboard = value
    }

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.href);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
}

angular
    .module('app.services')
    .service('ScreenerService', screenerService);