angular.module('partyABCreator').controller('exhibitSelection.ctrl',[
    '$scope',
    'AmendmentLetter',
    'rfaExibitTemplateService',
    'entityService',
    'CredentialsService',
    function(
        $scope,
        AmendmentLetter,
        rfaExibitTemplateService,
        entityService,
        CredentialsService
    ) {
        var vm = this,
            extendedData = $scope.inputData;

        this.back = function() {
            $scope.$emit('step.back',{data: $scope.inputData});
        };
        this.loaded = false;
        this.next = function() {
            $scope.$emit('step.next',{data: $scope.inputData});
        };

        this.exhibitTemplatesSelected = function() {
            return extendedData.savedRFA.filter(function(i) {
                    return i.exhibitTemplateId > 0;
                }).length > 0;
        };

        function cleanExhibit(data) {
            delete data.exhibit.name;
            delete data.exhibit.companyId;
            delete data.exhibit.id;
            delete data.exhibit.createdDate;
            delete data.exhibit.modifiedDate;
            delete data.exhibit.createdBy;
            delete data.exhibit.modifiedBy;
            delete data.exhibit.createdByString;
            delete data.exhibit.modifiedByString;
            delete data.exhibit.deleted;
            
            data.exhibit.columns = data.exhibit.columns.map(function(item) {
                return {
                    'columnIndex': item.columnIndex,
                    'columnName': item.columnName,
                    'columnStyle': item.columnStyle,
                    'cells': []
                };
            });
        }

        function getExhibitRowHtml(data, selectPartyB, extendedData ) {
            var tHtml = '<tr>';
            data.exhibit.columns = data.exhibit.columns.each(function(item) {
                tHtml += '<td class=\'' + item.columnStyle + '\'>' + item.columnName + '</td>';
            });
            tHtml += '</tr>';

            for (var b = 0; b < selectPartyB.length; b++) {
                tHtml += '<tr>';
                tHtml += '<td>' + extendedData.selectPartyB[b].entity.trueLegalName + '</td>';
                tHtml += '<td>' + extendedData.selectPartyB[b].entity.clientIdentifier + '</td>';
                tHtml += '<td>' + extendedData.selectPartyB[b].entity.lei + '</td>';

                for (var c = 3; c < data.exhibit.columns.length; c++) {
                    tHtml += '<td></td>';
                }
                tHtml += '</tr>';
            }
            return hHtml;
        }

        this.save = function() {
            vm.loaded = true;

            var sdata = {
                'userId': CredentialsService.userId(),
                'data': angular.copy(extendedData.savedRFA),
                'companyId': CredentialsService.companyId()
            };
            for (var i = 0; i < sdata.data.length; i++) {
                sdata.data[i].modifiedBy = CredentialsService.userId();
                if (sdata.data[i].exhibit === undefined) {
                    continue;
                }
                cleanExhibit(sdata.data[i]);
                sdata.data[i].exhibit.htmlContent = $base64.encode(encodeURIComponent('<table><tbody>' + getExhibitRowHtml(sdata.data[i], vm.selectPartyB, extendedData) + '</tbody></table>'));
            };

            AmendmentLetter.update({
                'data': sdata
            })
                .success(function() {
                    vm.next();
                    vm.loaded = false;

                }).error(function() {
                    vm.loaded = false;
                });
        };

    }]);