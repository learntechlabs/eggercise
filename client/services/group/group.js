'use strict';

angular.module('eggercise')
  .service('GroupService', function ($rootScope, $q, $http) {
    var service = {};

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

    //show group by group id
    service.showGroup = function (id) {
      var deferred = $q.defer();
      $http.get('/api/groups/' + id)
        .success(function (showGroup) {
          deferred.resolve(showGroup);
        })
        .error(function (error) {
          deferred.reject('Error: ', error);
        });
        return deferred.promise;
    };

    //delete group by group id
    service.deleteGroup = function (id){
      var deferred = $q.defer();
      $http.post('/api/groups/delete/' + id)
        .success(function (deletedGroup){
          deferred.resolve(deletedGroup);
        })
        .error(function (error){
          deferred.reject('Error: ',  error);
          console.log('Error: ',  error);
        });
        return deferred.promise;
    };

    //update group by group id
    service.updateGroup = function (id, formData){
      var deferred = $q.defer();
      $http.post('/api/groups/update/' + id, formData)
        .success(function (updatedGroup){
          deferred.resolve(updatedGroup);
        })
        .error(function (error){
          deferred.reject('Error: ',  error);
          console.log('Error: ',  error);
        });
        return deferred.promise;
    };

    //invite members
    service.inviteMember = function (formData) {
      var deferred = $q.defer();
      $http.post('/api/invite/', formData)
        .success(function (invite) {
          deferred.resolve(invite);
        })
        .error(function (error) {
          deferred.reject('Error: ', error);
        });
        return deferred.promise;
    }


    return service;
  });
