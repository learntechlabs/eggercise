'use strict';

angular.module('eggercise')
  .controller('WorkoutCtrl', WorkoutCtrl);

  WorkoutCtrl.$inject = ['WorkoutService', '$routeParams', '$rootScope', '$log', '$location']
  function WorkoutCtrl($WorkoutService, $routeParams, $rootScope, $log, $location){
  // .controller('WorkoutCtrl', ['WorkoutService', '$routeParams', '$rootScope', '$log', '$location', function (WorkoutService, $routeParams, $rootScope, $log, $location) {

    var vm = this;
    vm.user = {};
    vm.formData = {};
    vm.id = $rootScope._id;

    angular.extend(vm, {

    //Log Workout
    // logWorkout: function () {
    //   WorkoutService.logWorkout(vm.formData)
    //     .then(function (data) {
    //       vm.user = data;
    //       $location.path('/');
    //     })
    //   .catch(function (err) {
    //     vm.error = err;
    //     $log.error('Error: ', err);
    //   });
    // }
   });
  };