'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm'
      });
  });
