'use strict';

angular.module('eggercise')
  .controller('InviteCtrl', ['$location', '$log', '$routeParams', 'InviteService', function ($location, $log, $routeParams, InviteService) {

    var vm = this;
    vm.formData = {};
    vm.invites =[];

    angular.extend(vm, {
      name: 'InviteCtrl'
    });

    //Show all exisiting groups in database
    vm.createInvite = function () {
      vm.formData._group = $routeParams.group_id;
      InviteService.createInvite(vm.formData)
      .then(function (foundInvites){
        vm.invites.push(foundInvites);
        $location.path('/group/updateGroup/');

        setTimeout(notification, 1000);
        console.log("vm.invites: ",vm.invites);
        console.log(foundInvites);
      })
      .catch(function (error){
        console.log('createInvites error:' + error);
      })


      function notification () {
        var sentInvite = document.getElementById('sentInvite');
        sentInvite.innerHTML = 'You have successfully sent an invite to: ' + vm.formData.email;
        sentInvite.style.display = 'block';

        setTimeout(function (){
          var sentInvite = document.getElementById('sentInvite');
          sentInvite.style.display = 'none';
          sentInvite.innerHTML = '';
        }, 3000);
      }
    }

  }]);
