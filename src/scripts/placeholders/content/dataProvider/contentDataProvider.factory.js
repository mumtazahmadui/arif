angular.module('app.placeholders')
    .factory('app.placeholders.contentDataProvider', [
        '$http',
        'appConfig',
    function($http, appConfig) {
        return function() {
            this.get = function(id) {
                if (!id) {
                    return null;
                }
                return $http({
                    method: 'GET',
                    url: appConfig.api_host + 'amendmentLetters/' + id+ "?fields=content"
                });
            };

            this.send = function(id, content, comments, changelog) {
                return $http({
                    method: 'PUT',
                    url: appConfig.api_host + 'amendmentLetters/' + id + '/actions/edit_content',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: {
                        content: content,
                        commentlog: comments,
                        changelog: changelog,
                        partyType: "BS"
                    }
                });
            };
        };
    }]);
