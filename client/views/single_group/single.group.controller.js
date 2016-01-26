'use strict';

angular.module('eggercise')
  .controller('ShowGroupCtrl', ['$rootScope', '$location', '$log', '$routeParams', 'GroupService', 'Auth', 'DateService', 'SingleGroupService', 'ErrorService', function ($rootScope, $location, $log, $routeParams, GroupService, Auth, DateService, SingleGroupService, ErrorService) {
    var vm = this;
    vm.group = {};
    vm.membersArray = [];
    vm.group_id = $routeParams.id;
    vm.startDate;
    vm.endDate;
    vm.totaldays;
    vm.daysElapsed;
    vm.daysDifference;
    vm.daysDifferenceAbsolute;
    vm.owe;
    vm.winnersPot;
    vm.oweAbsolute;
    vm.authUserId;

    angular.extend(vm, {

      name: 'ShowGroupCtrl',

      //show Group
      showGroup: function (id) {
        Auth.getUserNow()
        .then(function (data){
          vm.authUserId = data._id;

          //existing showGroup logic
          GroupService.showGroup(id)
            .then(function (data) {
              vm.startDate = DateService.getFullDate(data.start);
              console.log('This is the startDate:', vm.startDate);
              vm.endDate = DateService.getFullDate(data.end);
              vm.totaldays = DateService.daysBetween(data.start, data.end);
              vm.daysElapsed = SingleGroupService.elapsedDay(data.start, data.end);
              vm.group = data;

              //Execute moneyOwed()
              vm.moneyOwed(id);

            })
            .catch(function (err) {
              ErrorService.errorToasty(err);
            });
        })
        .catch(function (error){
          ErrorService.errorToasty(error);
        });
      },

      moneyOwed: function (id) {
        GroupService.showGroup(id)
          .then(function (data) {
            var leaderAndRunnerUpArray = [];
            var potAndDaysDifference = {};

            vm.membersArray = SingleGroupService.membersValidExercises(data._members, vm.startDate, vm.endDate);
            leaderAndRunnerUpArray = SingleGroupService.assignLeader(vm.membersArray, vm.startDate, vm.endDate);
            var leader = leaderAndRunnerUpArray[0];
            var runnerUp = leaderAndRunnerUpArray[1];
            vm.winnersPot = SingleGroupService.potCalculation(vm.membersArray, leader, runnerUp, vm.group.bet);
            potAndDaysDifference = SingleGroupService.youWinOrOwe(vm.winnersPot, leader, runnerUp, vm.group.bet, vm.startDate, vm.endDate);
            vm.daysDifference = potAndDaysDifference.days;
            vm.daysDifferenceAbsolute = Math.abs(vm.daysDifference);
            vm.owe = potAndDaysDifference.money;
            vm.oweAbsolute = Math.abs(vm.owe);

            vm.group = data;
          })
          .catch(function (err) {
            ErrorService.errorToasty(err);
          });
      }
    });
  }]);
