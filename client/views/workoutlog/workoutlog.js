'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/log', {
        templateUrl: 'views/workoutlog/workoutlog.html',
        controller: 'WorkoutCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });