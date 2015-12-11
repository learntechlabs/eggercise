'use strict';

angular.module('eggercise')
  .service('WorkoutService', function ($rootScope, $q, $http) {
    var service = {};

    service.logWorkout = function (date) {
      var deferred = $q.defer();
      $http.post('/api/users/log/')
        .success(function (updatedWorkout) {
          deferred.resolve(updatedWorkout);
        })
        .catch(function (err) {
          deferred.reject(err.data);
        });
      return deferred.promise;
    };

    service.unlogWorkout = function (date) {
      var deferred = $q.defer();
      $http.post('/api/users/unlog/')
      .success(function (updatedWorkout) {
        deferred.resolve(updatedWorkout);
      })
      .catch(function (err) {
        deferred.reject(err.data);
      });
      return deferred.promise;
    };
    return service;
  });