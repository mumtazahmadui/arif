angular
    .module('app.services')
    .factory('TextEditorCheckerOfDifferenceService', [
        function() {
            var checkElementsPlaceholders = function(pstate, cstate) {
                var getById = function(item) {
                    var id = item.getAttribute('id');
                    if ('date_pinned' === id) {
                        return false;
                    }

                    return id;
                };

                var pIds = _.filter(pstate, getById);
                if (!pIds.length) {
                    return true;
                }

                var cIds = _.filter(cstate, getById);

                return pIds.length <= cIds.length;
            };

            var checkTablesCopy = function(pstate, cstate) {
                if (!pstate.length) {
                    return true;
                }

                var getById = function(item) {
                    return $(item).hasClass('table-content_isnot_copy');
                };
                var pIds = _.filter(pstate, getById);
                var pIdsLength = pIds.length + $(pstate).find('.table-content_isnot_copy').length;
                if (!pIdsLength) {
                    return true;
                }

                var cIds = _.filter(cstate, getById);
                var cIdsLength = cIds.length + $(cstate).find('.table-content_isnot_copy').length;
                return pIdsLength >= cIdsLength;
            };

            var checkSignatureType = function(regexp, pstate, cstate) {
                var getSignaturePlaceHolders = function(item) {
                    return regexp.test(item.getAttribute('id'));
                };
                var pIds = _.filter(pstate, getSignaturePlaceHolders);
                var cIds = _.filter(cstate, getSignaturePlaceHolders);
                return pIds.length === cIds.length;
            };

            var checkSignaturePlaceHolders = function(pstate, cstate) {
                if (!pstate.length) {
                    return true;
                }
                if (!checkSignatureType(/(bs_signature\[\d+\])/, pstate, cstate)) {
                    return false;
                }
                return checkSignatureType(/(ss_signature\[\d+\])/, pstate, cstate);
            };

            return {
                checkElementsPlaceholders: checkElementsPlaceholders,
                checkSignaturePlaceHolders: checkSignaturePlaceHolders,
                checkTablesCopy: checkTablesCopy
            };
        }]);