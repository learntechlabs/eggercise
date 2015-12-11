'use strict';

angular.module('eggercise')
  .controller('UpdateGroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', function ($location, $log, $routeParams,GroupService) {

    var vm = this;
    vm.formData = {};
    vm.groups =[];

    // var creatorId = $routeParams.creatorId;
    // vm.formData._creator = creatorId

    angular.extend(vm, {

      name: 'UpdateGroupCtrl'

    });

  
    //update group
    vm.updateGroup = function (id) {
      GroupService.updateGroup(id)
        .then(function (updatedGroup){
          vm.groups.push(updatedGroup);
        })
        .catch(function(error) {
          vm.error = error;
          console.log('updatedGroup Error: ',  error);
        });
    }


  }]);
