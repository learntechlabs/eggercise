'use strict';

angular.module('eggercise')
  .controller('WorkoutCtrl', ['WorkoutService', '$routeParams', '$rootScope', '$log', '$location', function (WorkoutService, $routeParams, $rootScope, $log, $location) {

    var vm = this;
    vm.user = {};
    vm.formData = {};
    vm.id = $rootScope._id;

    angular.extend(vm, {

    //Log Workout
    logWorkout: function () {
      WorkoutService.logWorkout(vm.formData.date)
        .then(function (data) {
          vm.user = data;
          $location.path('/');
        })
        .catch(function (err) {
          vm.error = err;
          $log.error('Error: ', err);
        })
    },

    //Unlog Workout
    unlogWorkout: function() {
      WorkoutService.unlogWorkout(vm.formData.date)
        .then(function (data) {
          vm.user = data;
          $location.path('/');
        })
        .catch(function (err) {
          vm.error = err;
          $log.error('Error: ', err);
        })
    }

   });
  }]);