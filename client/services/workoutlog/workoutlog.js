'use strict';

angular.module('eggercise')
  .service('WorkoutService', ['DateService','$rootScope','$q','$http', function (DateService, $rootScope, $q, $http) {
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

    service.setlogPath = function(index, allDates) {
      var logPath;

      if(allDates[index].checked === true) {
        logPath = 'log';
      } else {
        logPath = 'unlog';
      }
      return logPath;
    }

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

    //This service is for setting user's start date as earliest start date among user's groups.
    service.loggableDays = function (groups, userStartDate){
      var earliestStartDate, logStartDate, numberOfDays;
      var todayDate = DateService.millisToDays(Date.now());
      var convertedUserStartDate = DateService.millisToDays(userStartDate);

      for(var i = 0; i < groups.length; i++) {
        earliestStartDate = DateService.millisToDays(groups[i].start);
      }

      if (earliestStartDate < convertedUserStartDate) {
        logStartDate = earliestStartDate + 1;
      } else {
        logStartDate = convertedUserStartDate + 1;
      }

      numberOfDays = todayDate - logStartDate;
      return numberOfDays;
    };

    service.convertToDays = function(exerciseArray) {
      var convertedExercises = [];

      for(var i=0; i<exerciseArray.length; i++) {
        //This is for cutting the exercise array elements (workout dates) in to a more readable format
        exerciseArray[i] = DateService.dateToMilli(exerciseArray[i].substring(0,10));
        //This converts the user's exercise array into number of days (number of days since 1970 Jan 1st, integer)
        convertedExercises[i] = DateService.millisToDays(exerciseArray[i]);
      }
      return convertedExercises;
    };

    service.readableLogDates = function(convertedArray, days) {
      var allDates = [];
      var todayDate = DateService.millisToDays(Date.now());
      var conversionConst = 1000*60*60*24;

      for(var j=days+1; j>=0; j--) {
        allDates.push({
          //todayDate - j + 1 is for checking the dates from now to firstStartDate 
          date: (new Date((todayDate - j + 1)*conversionConst)+'').substring(0,15),
          checked: (convertedArray.indexOf(todayDate - j) !== -1)
        });
      }
      return allDates.reverse();
    };

    return service;
  }]);

