'use strict';

angular.module('eggercise')
  .service('WorkoutService', function ($rootScope, $q, $http) {
    var service = {};

    service.logWorkout = function (id) {
      var deferred = $q.defer();
      $http.post('/api/users/log/' + id)
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