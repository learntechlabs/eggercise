'use strict';

angular.module('eggercise')
  .service('InviteService', function ($rootScope, $q, $http) {
    var service = {};

    service.createInvite = function (formData) {
      var deferred = $q.defer();
      $http.post('/api/invites/create', formData)
        .success(function (returnedInvite) {
          formData = {};
          deferred.resolve(returnedInvite);
        })
        .error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }

    service.acceptInvite = function (id) {
      var deferred = $q.defer();
      $http.get('/api/invites/accept/' + id)
        .success(function (showGroup) {
          deferred.resolve(showGroup);
        })
        .error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }
    return service;
  });
