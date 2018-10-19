angular.module('partyABCreator').factory('partyABCreator',[
    '$modal',
    'modalsService',
    function(
        $modal,
        modalsService
    ){

        function openModal(data){
            modalsService.setPopupPosition();
            var partyABModal = $modal.open({
                'templateUrl': "/views/partyABCreator/partyABCreator.html",
                'controller': "partyABCreator.ctrl",
                controllerAs:"pab",
                windowClass: 'modal-rfa',
                resolve: {
                    data: function() {
                        return data;
                    }
                },
                'backdrop': 'static'
            });
            return partyABModal.result;
        }
    return {
        openModal:openModal
    };
}]);