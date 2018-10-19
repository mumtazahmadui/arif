/**
 * Donut chart adaptation
 * @author IvanPanarin <ipanarin@luxoft.com>
 */

// @ngInject
function donutChart($rootScope, donutChartConfigs, CredentialsService) {

    function taskToColor(task) {
        return donutChartConfigs.colorLookup[task.id];
    }

    return {
        restrict: 'E',
        template: '',
        scope: {
            ngModel: '=',
            ngTitle: '@'
        },
        controller: function () { },
        link: function (scope, element, attr) {

            var is_SS = CredentialsService.companyType() === 'SS';

            function activate() {
                angular.element(element[0]).css({ 'display': 'inline-block' });

                if (scope.chart !== undefined) {
                    scope.chart.destroy();
                }

                scope.data = scope.ngModel.map(function (current) {
                    var item = [];
                    if (current.title.length > 13) {
                        item[0] = current.title.replace(' ', '<br/>');
                    } else {
                        item[0] = current.title;
                    }
                    item[1] = current.value;
                    return item;
                });

                var total = 0;
                angular.forEach(scope.data, function (k, i) {
                    total += k[1];
                });
                scope.title = '<span class="charts-title">Total</span><br/><span class="charts-totalvalue">'+total+'</span>';

                scope.chartOptions = {
                    credits: {
                        enabled: false
                    },
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: 0,
                        plotShadow: false,
                        marginRight: 320,
                        style: { fontFamily: '', fontSize: '' },
                        renderTo: attr.id
                    },
                    noData: {
                        position: {
                            y: 0,
                            x: -55,
                            'align': 'center',
                            'verticalAlign': 'middle'
                        }
                    },
                    colors: _.map(scope.ngModel, taskToColor),
                    title: {
                        text: scope.title,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: -35,
                        x: -155,
                        floating: true,
                        useHTML: true,
                        style: {
                            fontSize: '0.7em',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            color: '#ff1313'
                        }
                    },
                    tooltip: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false,
                                distance: -25,
                                style: {
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textShadow: '0px 1px 2px black',
                                    textTransform: 'uppercase'
                                }
                            },
                            point: {
                                events: {
                                    mouseOver: function () {
                                        var chart = this.series.chart;
                                        chart.title.attr({ text: '<span class="charts-title">' + this.name +'</span><br/><span class="charts-totalvalue">'+this.y+'</span>' });
                                    },
                                    click: function () {
                                        var status = this.name.toLowerCase().replace(' ', '').replace('<br/>', '');
                                        var chart = this.series.chart;
                                        chart.title.attr({ text: '<span class="charts-title">' + this.name +'</span><br/><span class="charts-totalvalue">'+this.y+'</span>' });
                                        $rootScope.$broadcast('remoteFilterSelect', { filters: [{ id: 'request_status', value: status }] });
                                    },
                                    legendItemClick: function () {
                                        var status = this.name.toLowerCase().replace(' ', '').replace('<br/>', '');
                                        $rootScope.$broadcast('remoteFilterSelect', { filters: [{ id: 'request_status', value: status }] });
                                        var chart = this.series.chart;
                                        chart.title.attr({ text: '<span class="charts-title">' + this.name +'</span><br/><span class="charts-totalvalue">'+this.y+'</span>' });
                                        return false;
                                        //prevent default highcharts event
                                    }
                                }
                            },
                            events: {
                                mouseOut: function () {
                                    this.chart.title.textSetter(scope.title);
                                }
                            },
                            startAngle: 0,
                            endAngle: 360,
                            center: ['50%', '50%'],
                            showInLegend: true
                        }
                    },
                    legend: {
                        useHTML: true,
                        
                        x: 0,
                        y: 0,
                        symbolWidth: 30,
                        symbolHeight: 4,
                        align: 'left',
                        itemMarginBottom: 7,
                        verticalAlign: 'bottom',
                        padding: 0,
                        itemMarginTop: 0,
                        itemWidth:60,


                        itemStyle: {
                            fontSize: '0.8em',
                            fontWeight: 'normal',
                            textTransform: 'capitalize',
                        },
                        labelFormatter: function () {
                            return '<br><span class="charts-info">' + this.name + '</span>';
                        }
                    },
                    series: [{
                        type: 'pie',
                        innerSize: '70%',
                        data: scope.data
                    }],
                    navigation: {
                        buttonOptions: {
                            enabled: false
                        }
                    }
                };

                scope.chart = new Highcharts.Chart(scope.chartOptions);
            }
            activate();

            scope.$on('doughnutUpdated', function (event, data) {
                scope.ngModel = data;
                activate();
            });
        }
    };
}

angular
    .module('app.directives')
    .directive('donutChart', donutChart);
