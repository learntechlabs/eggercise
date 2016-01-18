'use strict';

angular.module('eggercise')
  .controller('UpdateGroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', function ($location, $log, $routeParams,GroupService) {

    var vm = this;
    vm.formData = {};
    vm.group = {};
    vm.groups = [];
    vm.group_id = $routeParams.group_id;


    vm.startDatePickerIsOpen = false;
    vm.endDatePickerIsOpen = false;

    vm.valuationDatePickerOpen = function ($event, whichDate) {
      if ($event) {
          $event.preventDefault();
          $event.stopPropagation(); // This is the magic
      }
      if(whichDate === 'start'){
        this.startDatePickerIsOpen = true;
      }else if(whichDate === 'end'){
        this.endDatePickerIsOpen = true;
      }

      };





    angular.extend(vm, {

      name: 'UpdateGroupCtrl'

    });

    //get update group
    vm.getGroup = function (id) {
      GroupService.showGroup(id)
        .then(function (data) {
          vm.group = data;
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
          $location.path('/group')
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
