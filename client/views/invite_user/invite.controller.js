'use strict';

angular.module('eggercise')
  .controller('InviteCtrl', ['$location', '$log', '$routeParams', '$window', 'InviteService', 'toasty', 'GroupService', 'ErrorService', function ($location, $log, $routeParams, $window, InviteService, toasty, GroupService, ErrorService) {

    var vm = this;
    vm.formData = {};
    vm.invites = [];

    angular.extend(vm, {
      name: 'InviteCtrl'
    });

    vm.flashMessage = function(message, data) {
      if (message === 'error') {
        toasty[message]({
          title: 'Failure',
          msg: vm.formData.name + ' at ' + vm.formData.email + ' has already been invited to this group. Please select a different email address',
          theme: 'material'
        })
      } else {
        if (data._group !== null) {
          GroupService.showGroup(data._group)
          .then(function (group) {
            toasty[message]({
              title: 'Invited!',
              msg: 'You have sucessfully invited ' + data.email + " to " + group.name,
              theme: "material"
            });
          })
        }
      }
    }

    //Show all exisiting groups in database
    vm.createInvite = function () {
      vm.formData._group = $routeParams.id;
      InviteService.createInvite(vm.formData)
      .then(function (foundInvite){
        vm.invites.push(foundInvite);
        vm.flashMessage('success', foundInvite);
      })
      .catch(function (error){
        vm.flashMessage('error', vm.formData);
        vm.formData = {};
      });
    }
  }]);
