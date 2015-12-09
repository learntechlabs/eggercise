'use strict';

angular.module('eggercise')
  .service('GroupService', function ($rootScope, $q, $http) {
    var service = {};
    var tempId = '56662b84c6e3a5280b1209aa';

    service.showAllGroups = function () {
      var deferred = $q.defer();
      //Create a new group by calling the api route for create group
      $http.get('api/groups/')
        .success(function (returnedGroups) {
          deferred.resolve(returnedGroups);
        })
        .error(function (error) {
          deferred.reject('Error: ',  error);
          console.log('error');
        });
      return deferred.promise;
    }

    service.createGroup = function (formData) {
      var deferred = $q.defer();
      //Create a new group by calling the api route for create group
      $http.post('api/groups/create/', formData)
        .success(function (data) {
          formData = {};
          deferred.resolve(data);
        })
        .error(function (error) {
          deferred.reject('Error: ',  error);
          console.log('error');
        });
      return deferred.promise;
      //body requires name, email, bet, start, end, _creator
      //should return 200
      //TODO: should return new group created with the attributes.
    }

    //delete group by group id
    service.deleteGroup = function (id){
      var deferred = $q.defer();
      console.log('id: ', id);

      // return $http.post('/api/groups/delete/' + id)
      $http.post('/api/groups/delete/' + tempId)
        .success(function (deletedGroup){
          console.log('deletedGroup: ', deletedGroup);
          deferred.resolve(deletedGroup);
        })
        .error(function (error){
          deferred.reject('Error: ',  error);
          console.log('Error: ',  error);
        });
        return deferred.promise;
    };


    return service;
  });
