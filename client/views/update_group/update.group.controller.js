'use strict';

angular.module('eggercise')
  .controller('UpdateGroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', function ($location, $log, $routeParams,GroupService) {

    var vm = this;
    vm.formData = {};
    vm.group = {};
    vm.groups = [];
    vm.members = [];
    vm.memberId;
    vm.creatorName;
    vm.group_id = $routeParams.group_id;
    vm.startDatePickerIsOpen = false;
    vm.endDatePickerIsOpen = false;




    vm.valuationDatePickerOpen = function ($event, whichDate) {
      if ($event) {
          $event.preventDefault();
          $event.stopPropagation(); // This is the magic
      }
      if (whichDate === 'start') {
        this.startDatePickerIsOpen = true;
      } else if (whichDate === 'end') {
        this.endDatePickerIsOpen = true;
      }
    };

    angular.extend(vm, {
      name: 'UpdateGroupCtrl'
    });


    vm.showAdmin = function (){
      var ifAdmin = document.getElementById('ifAdmin');
        ifAdmin.innerHTML = '\u25C8 Admin: ' + vm.creatorName + ' \u25C8';
        ifAdmin.style.display = 'block';
    }

    //get update group
    vm.getGroup = function (id) {
      GroupService.showGroup(id)
        .then(function (data) {
          vm.group = data;
          console.log('vm.group._id: ', vm.group._id);
          //getting member id in group's data
          for(var i = 0; i < data._members.length; i++){
            var memberId = data._members[i]._id;
            vm.memberId = memberId;

            //if truthy that group creator matches member id shown, state that he/she is admin
            if(vm.group._creator === vm.memberId){
              vm.creatorName = data._members[i].name
              vm.showAdmin();
            }
          }

          vm.formData.start = new Date(vm.group.start);
          vm.formData.end = new Date(vm.group.end);
        })
        .catch(function (error) {
          vm.error = error;
        });
    }

    //update group
    vm.updateGroup = function (id, formData) {
      GroupService.updateGroup(id, vm.formData)
        .then(function (updatedGroup){
          vm.formData = updatedGroup;
          $location.path('/group/show/' + vm.group._id);
        })
        .catch(function(error) {
          vm.error = error;
        });
    }

    //invite member
    vm.inviteMember = function (formData) {
      GroupService.inviteMember(vm.formData)
        .then(function (invite) {
          vm.formData = invite;
          $location.path('/group')
        })
        .catch(function (error) {
          vm.error = error;
        });
    }
  }]);
