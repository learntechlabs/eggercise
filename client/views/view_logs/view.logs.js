'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/viewLog/:userId', {
        templateUrl: 'views/view_logs/viewlogs.html',
        controller: 'ViewLogCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/group'
      });
  });
