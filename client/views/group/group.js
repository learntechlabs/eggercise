'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/group', {
        templateUrl: 'views/group/group.html',
        controller: 'GroupCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
