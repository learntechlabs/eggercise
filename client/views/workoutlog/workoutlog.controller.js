'use strict';

angular.module('eggercise')
  .controller('WorkoutCtrl', ['WorkoutService', '$routeParams', '$log', '$location', function (WorkoutService, $routeParams, $log, $location) {

    var vm = this;
    vm.user = {};
    vm.formData = {};
    vm.allDates = [];
    vm.numberOfDays = 0;
    vm.firstStartDate = 99999999999999;

    angular.extend(vm, {

    //Show dates that you worked out and ones you didn't (from your join date or earliest possible date)
      showWorkout: function () {
        WorkoutService.showWorkout()
          .then(function (data) {
            var readableLogs = [];
            vm.user = data;
            //vm.numberOfDays is number of days between user's groups' earliest log date and current date
            vm.numberOfDays = WorkoutService.loggableDays(data._groups, data.joinDate);
            // vm.allDates = WorkoutService.readableDates(vm.user.exercises, vm.numberOfDays);
            readableLogs = WorkoutService.readableDates(vm.user.exercises);
            vm.allDates = WorkoutService.availableLogs(readableLogs, vm.numberOfDays);
            $location.path('/log');
          })
          .catch(function (err) {
            vm.error = err;
            $log.error('Error: ',err);
          });
      },

      //Log Toggle
      logToggle: function(index, date) {
        var logPath = WorkoutService.setlogPath(index, vm.allDates);
        WorkoutService.logToggle(logPath, date)
          .then(function (data) {
            vm.user = data;
          })
          .catch(function (err) {
            vm.error = err;
            $log.error('Error: ', err);
          })
        }
    });
  }]);
