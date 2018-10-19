(function() {
    angular.module('rfa.exhibits-linked').factory('ExhibitsLinked', function(AmendmentLetter, $stateParams, $q, exhibitsLinkedAdapter) {
       return {
           get: get,
           save: save
       };

        function get() {
            var originRequest = AmendmentLetter.get({
                id: $stateParams.contentId,
                exhibitId: $stateParams.exhibitId
            });

            return $q.all([originRequest]).then(function(dt) {
                var originData = dt[0].data;
                if (!originData) {
                    return null;
                }
                var content = dt[0].data.exhibitTextContent;
                return {
                    name: '',
                    editorData: exhibitsLinkedAdapter(originData, content),
                    exhibitHTMLContent: dt[0].data.exhibitHTMLContent
                };
            });
        }

        function save(data) {
            return AmendmentLetter.updateExhibit(data);
        }
    });
})();
