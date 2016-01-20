(function() {
  'use strict';

  describe('SingleGroupService', function () {
    var service, DateService, handler, singleGroupData, errorMessage, $log;

    //Configure module that contains the serivce being tested
    beforeEach(module('eggercise'));

    beforeEach(inject(function (_$log_, _SingleGroupService_, _DateService_) {
      $log = _$log_;
      service = _SingleGroupService_;
      DateService = _DateService_;
      singleGroupData = [];

      // Define an object with functions to handle success and error for our API calls
      // These functions simulate the functions written in controllers when a service is called
      handler = {
        success: function (singleGroup) {
          singleGroupData.push(singleGroup);
        },
        error: function (err) {
          errorMessage = err;
        }
      };

      // Use the Jasmine spyOn method to setup a callback using our handler mock object
      spyOn(handler, 'success').and.callThrough();
      spyOn(handler, 'error').and.callThrough();
    }));

    //***TODO: Make sure to change all these dates so that they are relative to current date (ever green)
    //The dates below are UTC format.

    //Two weeks in milliseconds
    var twoWeeks = 1209600000;

    var day1 = (new Date(new Date().getTime() - 518400000)).toISOString();
    var day2 = (new Date(new Date().getTime() - 432000000)).toISOString();
    var day3 = (new Date(new Date().getTime() - 345600000)).toISOString();
    var day4 = (new Date(new Date().getTime() - 259200000)).toISOString();
    var day5 = (new Date(new Date().getTime() - 172800000)).toISOString();

    var leaderExercises = [day1, day2, day3, day4, day5];
    var runnerUpExercises = [day1, day2, day3, day4];
    var potato3Exercises = [day1, day2, day3];
    var potato4Exercises = [day1, day2];


    var fakeMemberArray = [
      {
        name: 'runnerUpPotato', 
        exercises: runnerUpExercises, 
        validExercises: runnerUpExercises,
        email: 'runnerUp@email.com'
      },
      {
        name: 'leaderPotato', 
        exercises: leaderExercises, 
        validExercises: leaderExercises,
        email: 'leader@email.com'
      },
      {
        name: 'potato3',
        exercises: potato3Exercises,
        validExercises: potato3Exercises,
        email: 'potato3@email.com'

      },
      {
        name: 'potato4',
        exercises: potato4Exercises,
        validExercises: potato4Exercises,
        email: 'potato4@email.com'
      }
    ];

    //Test service elapsedDay() 
    it('should return number of days elapsed between two dates', function () {

      var day5 = DateService.dateToMilli(new Date()) + 432000000;
      
      //Change the date two weeks ago into milliseconds
      var groupStartDate = DateService.dateToMilli(new Date() - twoWeeks);
      //Set group end date to today (in milliseconds)
      var groupEndDate = DateService.dateToMilli(new Date());
      var numberOfDays = service.elapsedDay(groupStartDate, groupEndDate);
        
      expect(numberOfDays).toBe(14);
    });

    //Test service elapsedDay() when group start date is later than today's date
    it('should return 0 for number of days elapsed', function () {
      var todayDate = DateService.dateToMilli(new Date());
      //set group start date to 2 weeks from today
      var groupStartDate = todayDate + twoWeeks;
      //set group end date to 2 weeks from group start date
      var groupEndDate = groupStartDate + twoWeeks;
      var noDaysElapsed = service.elapsedDay(groupStartDate, groupEndDate)
    
      expect(noDaysElapsed).toBe(0);
    });

    //Test membersValidExercises()
    //when member's exercises are within startDate and endDate
    it('should add members exercises into validExercises array', function () {
      var groupStartDate = DateService.dateToMilli(new Date()) - twoWeeks;
      var groupEndDate = DateService.dateToMilli(new Date()) + twoWeeks;
      var exerciseDates = [day1, day2, day3];
      var fakeMemberArray = [{name: 'potato', exercises: exerciseDates}];

      var response = service.membersValidExercises(fakeMemberArray, groupStartDate, groupEndDate);
      expect(response[0].validExercises).toBeDefined();
    });

    //Test membersValidExercises()
    //when one of member's exercises are not within startDate and endDate
    it('should add members exercises into validExercises array', function () {
      var groupStartDate = DateService.dateToMilli(new Date()) - twoWeeks;
      var groupEndDate = DateService.dateToMilli(new Date()) + twoWeeks;
      //invalidDate is the same date as today a year ago
      var invalidDate = (new Date(new Date().getTime() - 31540000000)).toISOString();
      var exerciseDates = [invalidDate, day1, day2];
      var fakeMember = [{name: 'potato', exercises: exerciseDates}];

      var response = service.membersValidExercises(fakeMember, groupStartDate, groupEndDate);
      expect(response[0].validExercises).toBeDefined();
      expect(response[0].validExercises.length).toBe(2);
    });

    //Test assignLeader()
    //The first element of the returned array should always be the leader object.
    //The second element of the returned array should always be the runnerUp object.
    it('should assign a leader', function () {
      var groupStartDate = DateService.dateToMilli(new Date()) - twoWeeks;
      var groupEndDate = DateService.dateToMilli(new Date()) + twoWeeks;

      var response = service.assignLeader(fakeMemberArray, groupStartDate, groupEndDate);

      expect(response[0].exercises).toBe(5);
      expect(response[0].email).toBe('leader@email.com');
      expect(response[1].exercises).toBe(4);
      expect(response[1].email).toBe('runnerUp@email.com');
    });

    //Test potCalculation()
    it('should calculate the winners pot', function () {
      var groupBet = 5;
      var groupStartDate = DateService.dateToMilli(new Date()) - twoWeeks;
      var groupEndDate = DateService.dateToMilli(new Date()) + twoWeeks;
      var leaderAndRunnerUp = service.assignLeader(fakeMemberArray, groupStartDate, groupEndDate)
      var leader = leaderAndRunnerUp[0];
      var runnerUp = leaderAndRunnerUp[1];

      expect(leader.exercises).toBe(5);
      expect(leader.email).toBe('leader@email.com');

      var response = service.potCalculation(fakeMemberArray, leader, runnerUp, groupBet);
      expect(response).toBeDefined();
    });

    //Test youWinOrOwe()
    it('should calculate how much you owe the leader', function () {
      var winnersPot = 30;
      var leader = {email: 'leader@email.com', exercises: 10};
      var runnerUp = {email: 'runnerUp@email.com', exercises: 9};
      var you = {email: 'me@email.com', exercises: 8};
      var groupBet = 10;

      var response = service.youWinOrOwe(winnersPot, leader, runnerUp, groupBet);

      expect(response.money).toBeDefined();
    });
    
  })
})();