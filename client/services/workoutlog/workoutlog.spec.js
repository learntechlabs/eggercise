(function() {
  'use strict';

  describe('WorkoutService', function() {
    var service, DateService, $httpBackend, workoutData,handler, errorMessage, $log;
    
    // Configure module that contains the service being tested
    beforeEach(module('eggercise'));

    beforeEach(inject(function (_$log_, _$httpBackend_, _WorkoutService_, _DateService_) {
      $log = _$log_;
      $httpBackend = _$httpBackend_;
      service = _WorkoutService_;
      DateService = _DateService_;
      workoutData = [];

      // Define an object with functions to handle success and error for our API calls
      // These functions simulate the functions written in controllers when a service is called
      handler = {
        success: function(workout) {
          workoutData.push(workout);
        },
        error: function (err) {
          errorMessage = err;
        }
      };

      // Use the Jasmine spyOn method to setup a callback using our handler mock object
      spyOn(handler, 'success').and.callThrough();
      spyOn(handler, 'error').and.callThrough();
    }));

    //Test service.showWorkout()
    it('should show all of users workout log', function () {
      var response = service.showWorkout()
        .then(function () {
          $log.info('Success!');
        })
        .catch(function (err) {
          $log.error('Error: ', err);
        });

      expect(response).toBeTruthy();
    });

    //Test service.setlogPath() when we want logPath = 'log'
    it('should set logPath to log', function () {
      var fakeWorkouts = [
      {date: 'Wed Jan 13 2016', checked: false}, 
      {date: 'Tue Jan 12 2016', checked: false}];
      var index = 0;

      for(var i = 0; i < fakeWorkouts.length; i++) {
        fakeWorkouts[i].checked = true;
        index = i;
      }
      var response = service.setlogPath(index, fakeWorkouts);
      expect(response).toBe('log');
    });

    //Test service.setlogPath() when we want logPath = 'unlog'
    it('should set logPath to unlog', function () {
      var fakeWorkouts = [
      {date: 'Mon Jan 11 2016', checked: true}, 
      {date: 'Tue Jan 12 2016', checked: true}];
      var index = 0;

      for(var i = 0; i < fakeWorkouts.length; i++) {
        fakeWorkouts[i].checked = false;
        index = i;
      }
      var response = service.setlogPath(index, fakeWorkouts);
      expect(response).toBe('unlog');
    });

    //Test workout logToggle() when logPath = 'log'
    it('should toggle a workout log on and off', function () {
      var logPath = 'log';
      var testDate = {date: 'Thu Jan 14 2016', logPath: logPath};

      $httpBackend.whenPOST(/api\/users\/log$/)
        .respond(function (method, url) {
          if (logPath === 'log') {
            return [200, testDate];
          } else {
            return [404, { message: 'Not Found'}];
          }
        });
      service.logToggle(logPath, testDate.date).then(handler.success, handler.error);
      $httpBackend.flush();

      //test the results
      expect(testDate.date).toBe('Thu Jan 14 2016');
      expect(testDate.logPath).toBe('log');
      expect(handler.error).not.toHaveBeenCalled();
      expect(errorMessage).toBeUndefined();
    });

    //Test convertToDays()
    //This service converts all log dates to number of days since Jan 1, 1970
    it('should convert workout log dates into number of Days', function () {
      var testExerciseArray = [
        //In order: Tuesday, Wednesdsay, Thursdsay
        '2016-01-12T08:00:00.000Z',
        '2016-01-13T08:00:00.000Z',
        '2016-01-14T08:00:00.000Z'
      ];
      var response = service.convertToDays(testExerciseArray);
      //It's expected to be Thursday because of allDates.reverse()
      expect(response[0]).toBe(16812);
      expect(response[1]).toBe(16813);
      expect(response[2]).toBe(16814);
    });
  });
})();
