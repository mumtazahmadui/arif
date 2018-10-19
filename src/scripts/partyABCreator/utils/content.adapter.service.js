(function () {
    angular.module('partyABCreator').service('ContenAdapter', ['$base64', function ($base64) {

        function ContenAdapter(content) {
            this.content = content;
            this._vc = {};
            this.htmlContent = '';
            this.SLEEVE_CONTENT_MAP = {
                'PARTYB_ADDITION_TABLE': {
                    parentId: 'partyBAddition',
                    placeholder: '<p>&#65279</p><input id="sleeveAddition" readonly class="place-holder disabled" value="< Sleeve Addition >">',
                    sleeveId: 'sleeveAddition'
                },
                'PARTYB_REMOVAL_TABLE': {
                    parentId: 'partyBRemoval',
                    placeholder: '<p>&#65279</p><input id="sleeveRemoval" readonly class="place-holder disabled" value="< Sleeve Removal >">',
                    sleeveId: 'sleeveRemoval'
                }
            };
            if (this.content !== undefined)
                this.setHTMLContent(this.content, true);
        }

        /**
         * Set html content, set or decode from base64
         * @param {Object|String} html 
         * @param {Boolean} decode 
         */
        ContenAdapter.prototype.setHTMLContent = function (html, decode) {
            if (decode !== undefined) {
                this.htmlContent = decodeURIComponent($base64.decode(html));
            } else {
                this.htmlContent = html;
            }
            this._createJQContent(this.htmlContent);

        };

        /**
         * Create Jquery object of content 
         * @param {String} html 
         */
        ContenAdapter.prototype._createJQContent = function (html) {
            this._vc = $('<div>').html(html);
        };


        /**
         * adapte content for  html, that can check in parties or adapt the existing content
         * @param {Object} parties 
         * @param {Boolean} checkSleeve 
         */
        ContenAdapter.prototype.adapteeContent = function (parties, checkSleeve) {
            var hasSleeve = checkSleeve;
            if (parties !== undefined && checkSleeve === true) {
                angular.forEach(parties, function (row) {
                    if (row.is_sleeve !== undefined)
                        hasSleeve = true;
                });
            }
            if (hasSleeve === undefined || hasSleeve === true)
                angular.forEach(this.SLEEVE_CONTENT_MAP, function (val) {
                    var selfElement = this._vc.find('#' + val.sleeveId),
                        parentElement = this._vc.find('#' + val.parentId);
                    if (!selfElement.length && parentElement.length) {
                        this[val.sleeveId](parentElement, val.placeholder);
                    }
                }, this);
        };

        ContenAdapter.prototype.sleeveAddition = function (parentElement, placeholder) {
            parentElement.after(placeholder);
        };

        ContenAdapter.prototype.sleeveRemoval = function (parentElement, placeholder) {
            parentElement.after(placeholder);
        };

        ContenAdapter.prototype.modificationPlaceholder = function () {

        };

        /**
         * get base64 of content 
         * @returns {String}
         */
        ContenAdapter.prototype.getBase64Content = function () {
            return $base64.encode(encodeURIComponent(this._vc[0].outerHTML));
        };

        /**
         * get Jquery object of content 
         * @returns {Object}
         */
        ContenAdapter.prototype.getJQContent = function () {
            return this._vc;
        };

        return ContenAdapter;
    }]);

}());