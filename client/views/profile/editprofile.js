'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/editprofile', {
        templateUrl: 'views/profile/editprofile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });

  });