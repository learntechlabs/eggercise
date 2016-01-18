'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/group/updateGroup', {
        templateUrl: 'views/update_group/update.group.html',
        controller: 'UpdateGroupCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });

  });
