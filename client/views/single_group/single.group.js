'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/group/show', {
        templateUrl: 'views/single_group/singlegroup.html',
        controller: 'ShowGroupCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });