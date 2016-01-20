'use strict';

angular.module('eggercise')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/invites/accept/:id', {
        //You must use " " instead of an empty string "" because Angular uses an if (template) check before firing the controller, and an empty string evaluates to false.
        template: ' ',
        controller: 'AcceptInviteCtrl',
        controllerAs: 'vm'
      });
  });