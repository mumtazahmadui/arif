// @ngInject
function auditService($http, appConfig) {
    /* jshint validthis: true */
    return {
        click:click,
        multiClick:multiClick,
        getAudit:getAudit,
        rfaType:rfaType,
        getEscalate:getEscalate,
        getDeskCode:getDeskCode,
    };

    function getAudit(partyBId,deskCode) {
        return $http({
            url: appConfig.api_host + 'partyB/' + partyBId + '/getReviewHistory/'+deskCode,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function getEscalate(partyBId,deskCode) {
        return $http({
            url: appConfig.api_host + 'partyB/' + partyBId + '/getEscalateHistory/'+ deskCode,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function post(id,params, postData) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'amendmentLetters/'+ id + '/review/'+params,
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function click(grid,row,index,type,subtype,filedTyped) {
        var reviewAction,id;
        var partyBIds = [];
        var deskCode = getDeskCode(filedTyped);
        partyBIds.push(row.id);
        reviewAction  = row[filedTyped] ? true : false;
        id = grid.dataList[index].id;

        var option = {
            "partyBIds":partyBIds,
            "reviewed":reviewAction,
            "bulkAction":false
        }
        post(id,deskCode,option).then(function(res) {
        }).catch(function(error){
            console.log("Error",error);
        });
    }

    function multiClick(grid,entityGrid,index,type,subtype,filedTyped) {
        var reviewAction,id,rows
        var partyBIds = [];
        var deskCode = getDeskCode(filedTyped);
        reviewAction  = entityGrid[filedTyped] ? true : false;
        id = grid.dataList[index].id;
        rows = Object.assign({}, entityGrid);
        angular.forEach(rows, function(row) {
            if(row.id) {
                var xAxis = row[filedTyped] === undefined ? false : row[filedTyped];
                var yAxis = rows[filedTyped];
                if (xAxis !== yAxis) {
                    partyBIds.push(row.id);
                }
            }
        });

        if (partyBIds.length > 0) {
            var multiPartyBids = partyBIds;
            var option = {
                "partyBIds":multiPartyBids,
                "reviewed":reviewAction,
                "bulkAction":true
            }
           post(id,deskCode,option).then(function() {
            }).catch(function(error){
                console.log("Multi Error",error);
            });
        }
    }

    function rfaType (string) {
        if(string) {
            const x = string.split("_");
            return {
                'type' : x[0],
                'status' : x[1]
            }
        } else {
            return {};
        }
    }

    function filterDeskCode(string) {
        if(string) {
            const x = string.split("_");
            if (x[0] !== 'operations') {
                var x1 = x[0].charAt(0).toUpperCase();
            } else if (x[0] == 'operations') {
                var x1 = 'OP'
            }
            var x2 = x[1].charAt(0).toUpperCase();
            x2 = x2 == "I" ? "P" : x2;
            return x1 + '-' + x2
        } else {
            return '';
        }
    }

    function getDeskCode (string) {
        return filterDeskCode(string);
    }
}

angular
    .module('app.services')
    .service('auditService', auditService);