angular.module('app.placeholders')
    .factory('app.placeholders.contentFactory', [
        '$q',
        'app.placeholders.contentDataProvider',
        'app.placeholders.contentPrepareData',
        '$base64',
        function($q, ContentDataProvider, ContentPrepareData, $base64) {
            return function() {
                var contentDataProvider = new ContentDataProvider();
                var contentPrepareData = new ContentPrepareData();

                this.getContentData = function(params) {
                    return $q.when(contentDataProvider.get(params.id), function(data) {
                        var content = contentPrepareData.prepareGetData(data.data.content);

                        return {
                            undecodedContent: data.data.content,
                            content: content.text,
                            datePinned: content.pinned,
                            saveData: function() {
                                this.content  = this.datePinned[0].outerHTML + this.content;
                                var codeContent = $base64.encode(encodeURIComponent(this.content));
                                contentDataProvider.send(params.id, codeContent, this.comments, this.changelog);
                            }
                        };
                    });
                };
            };
        }]);

