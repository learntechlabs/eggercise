'use strict';

angular.module('eggercise')
  .controller('ShowGroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', function ($location, $log, $routeParams, GroupService) {
    var vm = this;

      vm.groups = [];

      angular.extend(vm, {

        name: 'ShowGroupCtrl',

        showGroup: function (id) {
          GroupService.showGroup(id)
            .then(function (data) {
              $location.path('/group/showgroup');
            })
            .catch(function (err) {
              vm.error = err;
              $log.error('Error: ', err);
            });
        }
      });
  }])