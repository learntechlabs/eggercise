'use strict';

angular.module('eggercise')
  .controller('AcceptInviteCtrl', ['$scope', '$location', '$log', '$routeParams', 'Auth', 'ErrorService', 'InviteService', 'GroupService', function ($scope, $location, $log, $routeParams, Auth, ErrorService, InviteService, GroupService) {

    var vm = this;
    vm.invite = {};
    vm.invite_id = $routeParams.invite_id;
    vm.newUser = {};
    vm.group_id;

    //get invite
    vm.getInvite = function (id) {
      InviteService.showInvite(id)
        .then(function (data) {
          vm.invite = data;
          vm.group_id = vm.invite._group._id;
          vm.newUser.group = vm.invite._group;
          vm.newUser.email = vm.invite.email;
        })
        .catch(function (error) {
          ErrorService.errorToasty(error);
        });
    }

    vm.acceptInvite = function (newUser) {
      newUser.name = vm.newUser.name;
      newUser.password = vm.newUser.password;
      Auth.signupForInvite(vm.invite_id, vm.group_id, newUser)
      .then(function (data) {
        GroupService.showGroup(vm.group_id);
      })
      .catch(function (error) {
        ErrorService.errorToasty(error);
      })
    }
}]);
