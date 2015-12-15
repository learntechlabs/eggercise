'use strict';

angular.module('eggercise')
  .service('InviteService', function ($rootScope, $q, $http) {
    var service = {};

    service.createInvite = function (formData) {
      var deferred = $q.defer();
      $http.post('/api/invites/create', formData)
        .success(function (returnedInvite) {
          console.log('returnedInvite: ', returnedInvite);
          formData = {};
          deferred.resolve(returnedInvite);
        })
        .error(function (error) {
          deferred.reject('Error: ',  error);
          console.log('error');
        });
      return deferred.promise;
    }
    return service;
  });
