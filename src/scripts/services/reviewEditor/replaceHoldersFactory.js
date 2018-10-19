(function() {
    angular.module('app.services')
        .factory('ReplaceHoldersFactory', [function() {
            return function() {
                var decorator = {
                    string: '<div><div>%html%</div></div>',
                    key: '%html%'
                };
                var config = null;
                var containerString = null;

                /**
                 * Set config
                 * @return {ReplaceHolders}
                 */
                this.setConfig = function() {
                    config = arguments[0];
                    return this;
                };

                /**
                 * Set containerString
                 * @return {ReplaceHolders}
                 */
                this.setContainerStr = function() {
                    containerString = arguments[0];
                    return this;
                };

                /**
                 * Create node
                 * @return {ReplaceHolders}
                 */
                this.createContainerNode = function() {
                    var htmlContent = decorator.string.replace(decorator.key, containerString);
                    return angular.element(htmlContent);
                };

                var addDirectiveToNode = function(node, directive, needSleeveInsert) {
                    node.removeClass()
                         .removeAttr('disabled')
                         .addClass(directive);
                    if(needSleeveInsert){
                        var sleeveDirective = directive.replace('party-b', 'sleeve')
                        node.after('<input class="' + sleeveDirective + '">');
                    }
                };

                /**
                 * Remove class and add class for directive
                 * @type {function(this:ReplaceHolders)}
                 */
                var removeClassAndAddDirective = function(node, item) {
                    var element,
                        needSleeveInsert = false
                    ;

                    if (item.isIndex) {
                        element = angular.element('[id^=' + item.holder + ']', node);
                        element.each(function(index, nodeItem) {
                            addDirectiveToNode($(nodeItem), item.directive);
                        });
                        return;
                    }

                    if(item.holder.indexOf('partyB') === 0) {
                        var sleeveHolderName = 'sleeve' + item.holder.substring(6);
                        //we should insert sleeve directives after partyB directives if these does not extist
                        needSleeveInsert = !node.find('#' + sleeveHolderName).length;
                    }



                    element = angular.element('#' + item.holder, node);
                    addDirectiveToNode(element, item.directive, needSleeveInsert);
                };

                /**
                 * Create node, replace holders and return html
                 * @return {string} html
                 */
                this.start = function() {
                    var containerNode = this.createContainerNode();
                    angular.forEach(config, removeClassAndAddDirective.bind(this, containerNode));
                    return containerNode.html();
                };
            };
        }]);
})();
