'use strict';

angular.module('eggercise')
  .controller('InviteCtrl', ['$location', '$log', '$routeParams', '$window', 'InviteService', 'toasty', 'GroupService', function ($location, $log, $routeParams, $window, InviteService, toasty, GroupService) {

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
          msg: data + ' has already been invited. Please select a different email address',
          theme: 'material'
        })
      } else {
        GroupService.showGroup(data._group)
        .then(function (group) {
          toasty[message]({
            title: 'Invited!',
            msg: 'You have sucessfully invited ' + vm.formData.email + " to " + group.name,
            theme: "material"
          });
        })
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
        vm.flashMessage('error', vm.formData.email)
      })
    }
  }]);
