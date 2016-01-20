'use strict';

angular.module('eggercise')
  .controller('DeleteMemberCtrl', ['$location', '$log', '$routeParams', 'DeleteMemberService', function ($location, $log, $routeParams, DeleteMemberService) {

    var vm = this;

    angular.extend(vm, {
      name: 'DeleteMemberCtrl'
    });


    //delete a group
    vm.deleteMember = function (id){
      DeleteMemberService.deleteMember(id)
      .then(function (data){
        $location.path('/group')
      })
      .catch(function (error){
        vm.error = error;
      })
    }
  }]);