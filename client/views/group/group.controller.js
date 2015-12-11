'use strict';

angular.module('eggercise')
  .controller('GroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', function ($location, $log, $routeParams,GroupService) {

    var vm = this;
    vm.formData = {};
    vm.groups =[];

    // var creatorId = $routeParams.creatorId;
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
    .catch(function (err){
      console.log('deleteGroup err:' + err);
    })
  }

  
    //delete a group
    vm.deleteGroup = function (id){
      GroupService.deleteGroup(id)
      .then(function (data){
        for(var i = 0; i < vm.groups.length; i++){
          if(vm.groups[i]._id + '' === data.group._id + ''){
            vm.groups.splice(i,1);
            break;
          }
        }
      })
      .catch(function (error){
        console.log('deleteGroup error:' + error);
      })
    }


  }]);
