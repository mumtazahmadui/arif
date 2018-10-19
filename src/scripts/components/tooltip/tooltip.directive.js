(function() {
    angular.module('rfa.components')
        .directive('rfaTooltip', rfaTooltipDirective);

    function rfaTooltipDirective($compile) {
        var shown;
        return {
            restrict: 'AE',
            controller: function($scope) {
                var vm = this;
                angular.extend(this, {
                    pel: null,
                    state: false,
                    hider: null,
                    container: null,
                    defineContent: function(elmContent) {
                        if (elmContent) {
                            this.container = $compile('<div></div>')($scope);
                            this.container.append(elmContent);
                            this.content = $(elmContent[0]);

                            var show = vm.show.bind(vm, true, false),
                                hide = vm.show.bind(vm, false, false);

                            this.scrollerContainer = $(this.container[0]);
                            this.container.on('mouseenter', show).on('mouseleave', hide);
                            this.pel.on('mouseenter', show).on('mouseleave', hide);
                            $scope.$evalAsync();
                        }

                    },

                    show: function(value, force) {
                        function forceHide() {
                            vm.hider = null;
                            vm.state = false;
                            if ($(document).find(vm.pel).length === 0) {
                                $(document).find('.popover').remove();
                            } else {
                                vm.pel.popover('hide');
                            }
                            if (shown === vm)
                                shown = null;
                        }

                        function setHider() {
                            //Checking if cursor is not on tooltip elements
                            if (!vm.state && !$(vm.container).is(":hover") && !$(vm.pel).is(":hover")) {
                                vm.hider = setTimeout(function () {
                                    forceHide();
                                }, 1000);
                            }
                        }

                        if (value) {
                            if (this.hider) {
                                clearTimeout(this.hider);
                                this.hider = null;
                            }

                            if (shown === this || !this.hider) {
                                setHider();
                            }

                            if (!this.state) {
                                if (shown && shown !== this)
                                    shown.show(false, true);
                                shown = this;
                                this.state = value;
                                this.pel.popover('show');
                            }
                        } else {
                            if (force) {
                                if (this.hider)
                                    clearTimeout(this.hider);
                                forceHide();
                                return;
                            }
                            if (this.hider)
                                return;
                            this.hider = setTimeout(function() {
                                forceHide();
                            }, 1000);
                        }
                    },
                    setPopoverElement: function(pel) {
                        this.pel = pel;
                        this.pel.popover({
                            trigger: 'manual',
                            container: 'body',
                            html: true,
                            content: function() {
                                return vm.scrollerContainer;
                            }
                        });
                    }
                });

            },
            link: function(scope, elem, attr, ctrl) {
                ctrl.setPopoverElement($(elem[0]));
                if (attr.rfaTooltip) {
                    scope.$watch(
                        attr.rfaTooltip,
                        function(elmContent) {
                            ctrl.defineContent(elmContent);
                        }
                    );
                } else if (attr.rfaTooltip === undefined) {
                    var elmContent = elem.html();
                    ctrl.defineContent(elmContent);
                }

            }
        };
    }
})();
