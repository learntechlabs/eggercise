'use strict';

angular.module('eggercise')
  .controller('AcceptInviteCtrl', ['$scope', '$location', '$log', '$routeParams', 'InviteService', function ($scope, $location, $log, $routeParams,InviteService) {
    if ($scope.unauthorized) {
      return;
    }

    var vm = this;
    vm.inviteId = $routeParams.id;
    InviteService.acceptInvite(vm.inviteId)
    .then(function (group) {
      vm.group = group;
      $location.path('/group/show/' + vm.group._id);
    })
    .catch(function (error) {
      console.log(error);
      vm.error = error;
    });
  }]);
