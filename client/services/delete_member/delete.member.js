'use strict';

angular.module('eggercise')
  .service('DeleteMemberService', function ($rootScope, $q, $http) {
    var service = {};

    //delete user by user id
    service.deleteMember = function (id){
      var deferred = $q.defer();
      $http.post('/api/users/delete/' + id)
        .success(function (deletedMember){
          deferred.resolve(deletedMember);
        })
        .error(function (error){
          deferred.reject('Error: ',  error);
        });
        return deferred.promise;
    };
    return service;
  });
