angular.module('app.placeholders')
    .factory('validationRulesFactory',[
        'app.services.placeholdersConfig', '$modal', 'toastr',
        function(placeholdersConfig, $modal, toastr) {
            function placeholderCheckRule(placeholderId, preventModelUpdate) {
                this.placeholderId = placeholderId;
                this.ruleName = 'PlaceholderCheck' + placeholderId;
                this.preventModelUpdate = preventModelUpdate;
            }

            placeholderCheckRule.prototype.validate = function(lastContent, content) {
                var signatureRegexp = /(id="+this.placeholderId+")/g;
                var found = content.match(signatureRegexp);
                var foundLast = lastContent.match(signatureRegexp);
                var notFound = (!found && !foundLast);
                var foundEqual = (found && foundLast) && found.length === foundLast.length;
                return notFound || foundEqual;
            };

            function nonEditablesCheckRule() {
                this.ruleName = 'NonEditablesCheckRule';
                this.preventModelUpdate = true;
                this.validate = function(lastContent, content) {
                    lastContent = $('<div>').html(lastContent);
                    content = $('<div>').html(content);
                    var cCount = lastContent[0].querySelectorAll('.mceNonEditable').length;
                    var sCount = content[0].querySelectorAll('.mceNonEditable').length;
                    return cCount === sCount;
                };
            }

            function nonRemovableCheckRule() {
                this.ruleName = 'NonRemovableCheckRule';
                this.preventModelUpdate = true;
                this.validate = function(lastContent, content) {
                    lastContent = $('<div>').html(lastContent);
                    content = $('<div>').html(content);
                    var cCount = lastContent[0].querySelectorAll('.nonRemovable').length;
                    var sCount = content[0].querySelectorAll('.nonRemovable').length;
                    return cCount === sCount;
                };
            }

            function preventPasteRule() {
                this.ruleName = 'preventPasteRule';
                this.preventModelUpdate = true;
                this.validate = function(lastContent, oldContent, difference) {
                    var domDifference = $('<div>').html(difference);
                    return !domDifference[0].querySelectorAll('.mceNonEditable').length;
                };
            }

            function placeHolderCheckRule() {
                this.ruleName = 'PlaceHolderCheckRule';
                this.preventModelUpdate = true;
                this.validate = function(lastContent, content) {
                    lastContent = $('<div>').html(lastContent);
                    content = $('<div>').html(content);

                    function getPHCount(node) {
                        return ['placeholder', 'place-holder'].reduce(function(res, phname) {
                            return res + node.querySelectorAll('.' + phname).length;
                        } , 0);
                    }

                    var cCount = getPHCount(lastContent[0]);
                    var sCount = getPHCount(content[0]);
                    return cCount === sCount;
                };
            }

            var rules = [];
            for (var i in placeholdersConfig) {
                if(placeholdersConfig.hasOwnProperty(i)) {
                    rules.push(new placeholderCheckRule(placeholdersConfig[i].id, true));
                }
            }

            rules.push(new nonEditablesCheckRule());
            rules.push(new nonRemovableCheckRule());
            rules.push(new placeHolderCheckRule());
            rules.push(new preventPasteRule());

            return {
                    'rules': rules,
                    'onValidation': function(failedRules) {
                        console.log("failedRules => ", failedRules);
                        failedRules.length && toastr.error('Validation fail. You had tried to remove placeholder', 'Editing error');
                    }
                };
        }
    ]);
