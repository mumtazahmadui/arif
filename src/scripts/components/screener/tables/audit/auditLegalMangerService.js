// @ngInject
function auditLegalManger($http, appConfig) {
    /* jshint validthis: true */
    return {
        getAudit:getAudit,
        clickManger:clickManger,
        clickLegal:clickLegal,
        multiClickManager:multiClickManager,
        multiClickLegal:multiClickLegal,
        getRfaLevelAudit:getRfaLevelAudit
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

    function setAudit(rfaId,deskCode, body) {
        return $http({
            method: 'POST',
            url: appConfig.api_host + 'amendmentLetters/'+ rfaId + '/review/'+deskCode,
            data: body,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    function getRfaLevelAudit(rfaId,deskCode) {
        return $http({
            method: 'GET',
            url: appConfig.api_host + 'amendmentLetters/'+ rfaId +'/getReviewHistory/'+deskCode,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


    function clickManger(grid,row,index,flag) {
        var rfaId = grid.dataList[index].id;
        var deskCode = 'BS-D2';
        var reviewed = (flag === true || flag === 1) ? true : false;
        var partyBIds = [];
        partyBIds.push(row.id);

        var body = {
            "partyBIds" : partyBIds,
            "reviewed": reviewed,
            "bulkAction": false
            }

        setAudit(rfaId,deskCode,body).then(function(res) {
        }).catch(function(error){
            console.log("Manager Error Error",error);
        })
    }

    function clickLegal(grid,row,index,flag) {
        var rfaId = grid.dataList[index].id;
        var deskCode = 'BS-D1';
        var reviewed = (flag === true || flag === 1) ? true : false;
        var partyBIds = [];
        partyBIds.push(row.id);

        var body = {
            "partyBIds" : partyBIds,
            "reviewed": reviewed,
            "bulkAction": false
            }

        setAudit(rfaId,deskCode,body).then(function(res) {
        }).catch(function(error){
            console.log("Legal Error Error",error);
        })
    }



    function multiClickManager(grid,entityGrid,index,checked) {
        var reviewed = checked;
        var deskcode = 'BS-D2'
        var rfaId = grid.dataList[index].id
        multiFlag = (checked === true || checked === 1) ? 1 : 0

        var partyBIds = [];

        rows = Object.assign({}, entityGrid);
        angular.forEach(rows, function(row) {
            if(row.id) {
                var xAxis = (row.deskStatus.deskTwoStatus === true || row.deskStatus.deskTwoStatus === 1) ? 1 : 0;
                var yAxis = multiFlag;
                if (xAxis !== yAxis) {
                    partyBIds.push(row.id);
                }
            }
        });

        if (partyBIds.length > 0 && rfaId) {
            var multiPartyBids = partyBIds;

            var body = {
                "partyBIds" : multiPartyBids,
                "reviewed": reviewed,
                "bulkAction": true
                }

            setAudit(rfaId,deskcode,body).then(function(res) {
            }).catch(function(error){
                console.log("Multi Legal/Manger Error",error);
            })

        }
    }

    function multiClickLegal(grid,entityGrid,index,checked) {
        var reviewed = checked;
        var deskcode = 'BS-D1'
        var rfaId = grid.dataList[index].id
        multiFlag = (checked === true || checked === 1) ? 1 : 0

        var partyBIds = [];

        rows = Object.assign({}, entityGrid);
        angular.forEach(rows, function(row) {
            if(row.id) {
                var xAxis = (row.deskStatus.deskOneStatus === true || row.deskStatus.deskOneStatus === 1) ? 1 : 0;
                var yAxis = multiFlag;
                if (xAxis !== yAxis) {
                    partyBIds.push(row.id);
                }
            }
        });

        if (partyBIds.length > 0 && rfaId) {
            var multiPartyBids = partyBIds;

            var body = {
                "partyBIds" : multiPartyBids,
                "reviewed": reviewed,
                "bulkAction": true
                }

            setAudit(rfaId,deskcode,body).then(function(res) {
            }).catch(function(error){
                console.log("Multi Legal/Manger Error",error);
            })

        }
    }
}

angular
    .module('app.services')
    .service('auditLegalManger', auditLegalManger);