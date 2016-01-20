'use strict';

angular.module('eggercise')
  .service('ViewLogService', function ($rootScope, $q, $http) {
    var service = {};

    //show exercise logs of a member
    service.showLogs = function (id){
      var deferred = $q.defer();
     $http.get('/api/users/showLog/' + id)
        .success(function (foundLogs) {
          deferred.resolve(foundLogs);
        })
        .error(function (error) {
          console.log(error);
          deferred.reject('Error: ', error);
        });
        return deferred.promise;
    };
    return service;
  });
