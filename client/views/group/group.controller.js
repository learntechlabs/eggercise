'use strict';

angular.module('eggercise')
  .controller('GroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', function ($location, $log, $routeParams,GroupService) {
    var vm = this;
    vm.formData = {};
    vm.groups =[];
    vm.formData._creator = creatorId;

    var creatorId = $routeParams.creatorId;
    // vm.formData._creator = creatorId
    angular.extend(vm, {
      name: 'GroupCtrl'
    });

    //Show all exisiting groups in database
    vm.showAllGroups = function () {
      GroupService.showAllGroups()
      .then(function (foundGroups){
        for(var i = 0; i < foundGroups.length; i++){
          vm.groups.push(foundGroups[i]);
        }
      })
      .catch(function (error){
        console.log('showAllGroups err:' + error);
      })
    }
  }]);
