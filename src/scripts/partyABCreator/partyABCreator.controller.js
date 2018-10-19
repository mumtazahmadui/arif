angular.module('partyABCreator',[
    'partyABCreator.utils'
]);

angular.module('partyABCreator').controller('partyABCreator.ctrl',[
    '$scope',
    'data',
    'partyABCreator.config',
    'partyABCreator.utils.stepScenario',
    'partyABCreator.validationSelection',
    '$modalInstance',
    'modalsService',
    'ScreenerService',
    'DoughnutService',
    function(
     $scope,
     data,
     partyABCreatorConfig,
     stepScenario,
     validationSelection,
     $modalInstance,
     modalsService,
     ScreenerService,
     DoughnutService
    ){


        var vm = this,
            inputData = validationSelection.transformIn(data);

        var firstStep = stepScenario.create(partyABCreatorConfig[inputData.flow], inputData).start(inputData);
        $scope.stepTilte = null;

        var currentStep = firstStep;
        onStepChange();



        $scope.$on('step.back',onStepBack);
        $scope.$on('step.next',onStepNext);
        $scope.$on('step.finish',onStepFinish);



        function onStepBack(event,data){
            if(data && data.stepName){
                var fields = currentStep.getFields();
                while(fields.name !== data.stepName && currentStep.getPrev()){
                    currentStep = currentStep.back();
                    fields = currentStep.getFields();
                }
            }
            else{
                if(currentStep.getPrev()){
                    currentStep = currentStep.back();
                }
                else{
                    $modalInstance.dismiss("cancel");
                }

            }
            onStepChange();
        }

        function onStepNext(event,data){
            if (currentStep.getNext() || currentStep.getState() < 2) {
                currentStep = currentStep.forward(data.data);
                onStepChange();
            }
            else{
                ScreenerService.update('RFA');
                DoughnutService.update();
                $modalInstance.close(data.data);

            }

        }

        function onStepFinish(event,data){
            ScreenerService.update('RFA');
            DoughnutService.update();
            $modalInstance.close(data ? data.data : 'cancel');
        }

        function onStepChange(){
            vm.stepData = currentStep.getFields();
            $scope.stepTilte = vm.stepData.title
            vm.inputData = currentStep.getData();
            vm.routes = getRoutes(firstStep);
        }

        /**
         *
         * @param firstStep
         * @returns {*}
         */
        function getRoutes(firstStep) {
            var routes = arguments[1] || [];
            var fields = firstStep.getFields();
            routes.push({
                label: fields.name,
                state: fields.state
            });
            if (firstStep.hasNext()) {
                return getRoutes(firstStep.getNext(),routes);
            }
            return routes;
        }
    }
]);