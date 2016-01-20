'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/group/create', {
        templateUrl: 'views/create_group/create.group.html',
        controller: 'CreateGroupCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
