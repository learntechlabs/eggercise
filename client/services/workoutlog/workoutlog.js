'use strict';

angular.module('eggercise')
  .service('WorkoutService', function ($rootScope, $q, $http) {
    var service = {};

    service.showWorkout = function () {
      var deferred = $q.defer();
      
      $http.get('/api/users/me')
      .success(function (user) {
        console.log('user on client service: ',user);
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
    }
    return service;
  });