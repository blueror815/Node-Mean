(function() {
    'use strict';

    angular
        .module('app.home')
        .config(appRoutes);
    appRoutes.$inject = ['$stateProvider', 'RouteHelpersProvider'];

    function appRoutes($stateProvider, helper) {

        $stateProvider
            .state('app.home', {
                url: '/home',
                templateUrl: 'modules/home/views/home.client.view.html',
                resolve: helper.resolveFor('flot-chart', 'flot-chart-plugins', 'weather-icons', 'morris', 'chartjs', 'angularFileUpload', 'filestyle')
            });
    }
})();