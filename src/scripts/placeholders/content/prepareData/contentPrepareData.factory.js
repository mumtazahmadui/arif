angular.module('app.placeholders')
    .factory('app.placeholders.contentPrepareData', [
        '$base64',
    function($base64) {
        return function() {
            this.prepareGetData = function(data) {
                if (_.isEmpty(data) || !_.isString(data)) {
                    return '';
                }
                var decodeContent = decodeURIComponent($base64.decode(data));
                //we should remove all comments element from letter before view because IE9 sometimes shows is (when comment contains '[]' inside) AS-IS
                decodeContent = decodeContent.replace(/<!--.*?-->/g,'');

                decodeContent = prepareSignatures(decodeContent);

                var res = prepareDatePinned(decodeContent);

                return res;
            };

            function prepareDatePinned(content) {
                var res = {text: null, pinned: null},
                nd = $(content).find('input[id=date_pinned]');
                nd.remove();
                res.text = $(content).html();
                res.pinned = nd.length && nd || $('<input>').attr({type: 'text', id: 'date_pinned'}).addClass('place-holder disabled display-none');
                return res;

            }

            function prepareSignatures(content) {
                var tempContent = $('<div>').html(content);
                angular.forEach(tempContent.find('input.place-holder.disabled[id*=_signature]'), function(signature) {
                    $(signature).attr('unselectable', 'on');
                });
                return tempContent;
            }
        };
    }]);
