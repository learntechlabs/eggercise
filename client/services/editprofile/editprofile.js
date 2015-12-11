'use strict';

angular.module('eggercise')
  .service('EditProfile', function ($rootScope, $cookieStore, $q, $http) {
    var service = {};

    service.editProfile = function (formData) {
      var deferred = $q.defer();
      $http.post('/api/users/updateProfile', formData)
        .success(function (data) {
          formData = {};
          deferred.resolve(data);
        })
        .catch(function (err) {
          deferred.reject(err.data);
        });
      return deferred.promise;
    };
    return service;
  });