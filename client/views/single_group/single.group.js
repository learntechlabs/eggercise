'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/group/show/:id', {
        templateUrl: 'views/single_group/singlegroup.html',
        controller: 'ShowGroupCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
