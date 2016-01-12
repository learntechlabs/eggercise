'use strict';

angular.module('eggercise')
  .controller('ShowGroupCtrl', ['$location', '$log', '$routeParams', 'GroupService', 'Auth', function ($location, $log, $routeParams, GroupService, Auth) {
    var vm = this;

      vm.group = {};
      vm.startdate = {};
      vm.enddate = {};
      vm.totaldays = {};
      vm.elapsedday = {};
      vm.group_id = $routeParams.id;
      vm.members = [];
      vm.exercises = [];
      vm.sdate_ms;
      vm.edate_ms;
      vm.youOwe;
      vm.daysBehind;
      vm.daysAhead;
      vm.pot;

      angular.extend(vm, {

        name: 'ShowGroupCtrl',

        //show Group
        showGroup: function (id) {
          GroupService.showGroup(id)
            .then(function (data) {
              var sdate = new Date(data.start);
              vm.startdate = ((sdate.getMonth() + 1) + "/" + sdate.getDate());
              var edate = new Date(data.end);
              vm.enddate = ((edate.getMonth() + 1) + "/" + edate.getDate());
              Date.daysBetween = function (sdate, edate) {
                var one_day = 1000 * 60 * 60 * 24;
                vm.sdate_ms = sdate.getTime();
                vm.edate_ms = edate.getTime();
                var difference_ms = vm.edate_ms - vm.sdate_ms;
                return Math.round(difference_ms/one_day);
              }
              var tdate = new Date();
              vm.totaldays = Date.daysBetween(sdate, edate);
              if(tdate < sdate) {
                vm.elapsedday = 0;
              } else {
                vm.elapsedday = Date.daysBetween(sdate, tdate);
              }
              vm.group = data;

              for (var i = 0; i < data._members.length; i++) {
                vm.members.push(data._members[i]);
                for (var j = 0; j < data._members[i].exercises.length; j++) {
                  if (data._members[i].exercises[j] === 0) {
                    j++;
                  }
                  vm.exercises.push(data._members[i].exercises[j]);
                }
              }

              vm.moneyOwed(id);

            })
            .catch(function (err) {
              vm.error = err;
              $log.error('Error: ', err);
            });
        },

        moneyOwed: function (id) {
          var user = Auth.getUser();
          var daysDifference;

          GroupService.showGroup(id)
            .then(function (data) {
              data.you = user;
              data.leader = {email: 'leader@test.com', exercises: 0};
              data.runnerUp = {email: 'runnerUp@test.com', exercises: 0};

              for (var i = 0; i < data._members.length; i++) {
                data._members[i].validExercises = [];
                for(var j = 0; j < data._members[i].exercises.length; j++) {
                  //each member's separate log entries changed into milliseconds unit
                  var logInMilli = new Date(data._members[i].exercises[j]).getTime();

                  //if log is in between start and end date of the group, push to array
                  if((logInMilli >= vm.sdate_ms) && (logInMilli <= vm.edate_ms)) {
                    data._members[i].validExercises.push(data._members[i].exercises[j]);
                  }
                }
                //if user has the most exercises, his/her email is set as the group's leader's email
                //the leader's number of exercises is also in this object
                if(data._members[i].validExercises.length > data.leader.exercises) {
                  //put old leader in runnerup
                  data.runnerUp.email = data.leader.email;
                  data.runnerUp.exercises = data.leader.exercises;

                  //assign new leader
                  data.leader.email = data._members[i].email;
                  data.leader.exercises = data._members[i].validExercises.length;
                } else if(data._members[i].validExercises.length > data.runnerUp.exercises) {
                  data.runnerUp.email = data._members[i].email;
                  data.runnerUp.exercises = data._members[i].validExercises.length;                  
                }

              }

              var winnersPot = 0;
              var winnersIndex = 0;

              for (var i = 0; i < data._members.length; i++) {
                //Comparing each user to the leader of the group
                if(data._members[i].email == data.leader.email) {
                  data._members[i].daysDifference = data.leader.exercises - data.runnerUp.exercises;
                  data._members[i].daysAhead = Math.abs(data._members[i].daysDifference);
                  winnersIndex = i;
                } else {
                  data._members[i].daysDifference = data.leader.exercises - data._members[i].exercises.length;
                  data._members[i].daysBehind = Math.abs(data._members[i].daysDifference);
                  data._members[i].memberOwes = Math.abs(data._members[i].daysDifference*vm.group.bet);
                  winnersPot = winnersPot + data._members[i].memberOwes;
                }
              }
              
              data._members[winnersIndex].memberOwes = winnersPot;

              //Comparing current user to the leader of the group
              if(data.you.email == data.leader.email) {
                daysDifference = data.leader.exercises - data.runnerUp.exercises;
                vm.daysAhead = Math.abs(daysDifference);
                vm.youOwe = winnersPot;
              } else {
                  daysDifference = data.leader.exercises - user.exercises.length;
                  vm.daysBehind = Math.abs(daysDifference);
                  vm.youOwe = Math.abs(daysDifference*vm.group.bet);
              }

              vm.group = data;

            })
            .catch(function (err) {
              vm.error = err;
              $log.error('Error: ', err);
            });
        }
      });
  }]);