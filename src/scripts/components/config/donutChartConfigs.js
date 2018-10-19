(function() {

    var config = {
        colorLookup: {
            completed: '#8dc63f',
            partiallyCompleted: '#009697',
            recalled: '#00b5f1',
            received: '#F7941d',
            rejected: '#58595b',
            submitted: '#00552b',
            draft: '#00598C',
            deleted:'#9C27B0'

        }
    };

    angular
        .module('app.configs')
        .constant('donutChartConfigs', config);
})();

