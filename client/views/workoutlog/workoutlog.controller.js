'use strict';

angular.module('eggercise')
  .controller('WorkoutCtrl', ['WorkoutService', '$routeParams', '$rootScope', '$log', '$location', function (WorkoutService, $routeParams, $rootScope, $log, $location) {

    var vm = this;
    vm.user = {};
    vm.formData = {};
    vm.id = $rootScope._id;
    vm.allDates = [];
    vm.numberOfDays = 0;
    vm.checkBox = [];
    vm.allGroups = [];
    vm.firstStartDate = 99999999999999;

    angular.extend(vm, {

    //Show dates that you worked out and ones you didn't (from your join date)
    showWorkout: function () {
      WorkoutService.showWorkout()
        .then(function (data) {
          //multiplier for milliseconds to days conversion 
          var millisToDays = 1000*60*60*24;

          //user's join date in unit 'days'
          var joinDate = Math.floor(new Date(data.joinDate)/millisToDays)+1;

          //current date in unit 'days'
          var todayDate = Math.floor(Date.now()/millisToDays);

          for(var i = 0; i < data._groups.length; i++) {
            var convertedStartDate = Math.floor(new Date(data._groups[i].start)/millisToDays);
            if (convertedStartDate < vm.firstStartDate) {
              vm.firstStartDate = convertedStartDate;
            }
          }
          var logStartDate = vm.firstStartDate;
          if (joinDate < vm.firstStartDate) {
            logStartDate = joinDate;
          }
          //vm.numberOfDays is number of days between user's join date and current date
          vm.numberOfDays = todayDate - logStartDate;
          vm.user = data;
          vm.user.convertedExercises = [];

          for(var i=0; i<vm.user.exercises.length; i++) {
            //This is for cutting the exercise array elements (workout dates) in to a more readable format
            vm.user.exercises[i] = vm.user.exercises[i].substring(0,10);

            //This converts the user's exercise array into number of days (number of days since 1970 Jan 1st, integer)
            vm.user.convertedExercises[i] = Math.floor(new Date(vm.user.exercises[i]).getTime()/millisToDays);
          }

          //Build the array vm.allDates to iterate through in the future
          for(var j=vm.numberOfDays; j>=0; j--) {
              vm.allDates.push({
                //todayDate - j is for checking the dates from now to logStartDate 
                date: (new Date((todayDate - j + 1)*millisToDays)+'').substring(0,15),
                checked: (vm.user.convertedExercises.indexOf(todayDate - j) !== -1)
              });
          }
          vm.allDates.reverse();
          $location.path('/log');
        })
        .catch(function (err) {
          vm.error = err;
          $log.error('Error: ',err);
        })
      },

    //Log Toggle
    logToggle: function(index, date) {
      var logPath;

      if(vm.allDates[index].checked == true) {
        logPath = 'log';
      } else {
        logPath = 'unlog';
      }

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
