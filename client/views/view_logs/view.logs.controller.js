'use strict';

angular.module('eggercise')
  .controller('ViewLogCtrl', ['$location', '$log', '$routeParams', 'ViewLogService', 'GroupService', function ($location, $log, $routeParams, ViewLogService, GroupService) {
    var vm = this;
    vm.formData = {};
    vm.logs = [];
    vm.dates = {};
    var userId = $routeParams.userId;

    
    angular.extend(vm, {
      name: 'ViewLogCtrl'
    });

    //Show all exisiting exercise logs of a member in a group
    vm.showLogs = function () {
      ViewLogService.showLogs(userId)
      .then(function (foundLogs){
        if(foundLogs.length === 0){
          vm.notification();  
        }
        else{ 
          for(var i = 0; i < foundLogs.length; i++){
            var oneLog = foundLogs[i];
            var readableDate = ("" + new Date(oneLog));
            var dateString = JSON.stringify(readableDate).substr(1,16);

            vm.logs.push(dateString);
          }
        }
      })
      .catch(function (error){
        vm.error = error;
      });
    }


    vm.notification = function (){
      var noLogs = document.getElementById('noLogs');
        noLogs.innerHTML = 'No exercise logs found at the moment \u2639 .';
        noLogs.style.display = 'block';
    }

  }]);