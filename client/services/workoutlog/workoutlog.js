'use strict';

angular.module('eggercise')
  .service('WorkoutService', function ($rootScope, $q, $http) {
    var service = {};

    service.showWorkout = function () {
      var deferred = $q.defer();
      
      $http.get('/api/users/me')
      .success(function (user) {
        deferred.resolve(user);
      })
      .error(function (error) {
        deferred.reject(err.data);
      });
      return deferred.promise;
    };
    
    service.logToggle = function (logPath, date) {
      var deferred = $q.defer();
      var convertedDate = new Date(date);

      $http.post('/api/users/' + logPath, {date: convertedDate})
      .success(function (updatedWorkout) {
        deferred.resolve(updatedWorkout);
      })
      .catch(function (err) {
        deferred.reject(err.data);
      });
      return deferred.promise;
    };

    service.millisToDays = function (date) {
      //multiplier for milliseconds to days conversion 
      var conversionConst = 1000*60*60*24;

      //user's join date in milliseconds
      var dateToMilli = new Date(date)

      //user's join date in milliseconds to number of days
      var convertedDate = Math.floor(dateToMilli/conversionConst);

      return convertedDate;

    };

    /*This service is for setting user's start date as earliest
    start date among user's groups.
    */
    service.setStartDate = function (groups, userStartDate){
      for(var i = 0; i < groups.length; i++) {
        var convertedStartDate = service.millisToDays(groups[i].start);
        if (convertedStartDate < userStartDate) {
          userStartDate = convertedStartDate + 1;
        }
      }
      return userStartDate;
    };

    service.numberOfDays = function (todayDate, joinDate, userStartDate){
      if(joinDate < userStartDate) {
        userStartDate = joinDate;
      }
      return todayDate - userStartDate;
    };

    //days = vm.numberOfDays
    //exerciseArray = vm.user.exercises;
    service.readableDates = function(exerciseArray, days, todayDate) {
      var conversionConst = 1000*60*60*24;
      var convertedExercises = [];
      var allDates = [];

      for(var i=0; i<exerciseArray.length; i++) {
        //This is for cutting the exercise array elements (workout dates) in to a more readable format
        exerciseArray[i] = exerciseArray.substring(0,10);

        //This converts the user's exercise array into number of days (number of days since 1970 Jan 1st, integer)
        convertedExercises[i] = service.millisToDays(exerciseArray[i].getTime());
      }

      for(var j=days+1; j>0; j--) {
        allDates.push({
          //todayDate - j + 1 is for checking the dates from now to firstStartDate 
          date: (new Date((todayDate - j + 1)*conversionConst)+'').substring(0,15),
          checked: (convertedExercises.indexOf(todayDate - j) !== -1)
        });
      }
      return allDates.reverse();
    }

    return service;
  });

// service.setStartDate = function (groups, userStartDate){
//   for(var i = 0; i < groups.length; i++) {
//     var convertedStartDate = DateService.millisToDays(groups[i].start);
//     if (convertedStartDate < userStartDate) {
//       userStartDate = convertedStartDate + 1;
//     }
//   }
//   return userStartDate;
// };

// service.numberOfDays = function (joinDate, userStartDate){
//   var joinDate = DateService.millisToDays(joinDate);
//   var todayDate = DateService.millisToDays(Date.now());
//   if(joinDate < userStartDate) {
//     userStartDate = joinDate;
//   }
//   return todayDate - userStartDate;
// };
