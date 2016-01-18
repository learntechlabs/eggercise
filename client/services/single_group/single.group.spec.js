(function() {
  'use strict';

  describe('SingleGroupService', function () {
    var service, handler, singleGroupData, errorMessage, $log;

    //Configure module that contains the serivce being tested
    beforeEach(module('eggercise'));

    beforeEach(inject(function (_$log_, _SingleGroupService_) {
      $log = _$log_;
      service = _SingleGroupService_;
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

    //Test service elapsedDay() 
    // it('should return number of days elapsed between two dates', function () {
    //   var groupStartDate = new Date('01-01-2016');
    //   var groupEndDate = new Date('01-04-2016');
    //   var numberOfDays = service.elapsedDay(groupStartDate, groupEndDate)
    //     .then(function () {
    //       $log.info('Success!');
    //     })
    //     .catch(function (err) {
    //       $log.error('Error: ', err);
    //     });
    //   expect(numberOfDays).toBe(3);
    // });

    //Test service elapsedDay() when group start date is later than today's date
    // it('should return 0 for number of days elapsed', function () {
    //   var todayDate = new Date();
    //   var groupStartDate = new Date('12-31-2016');
    //   var groupEndDate = new Date('01-31-2017');
    //   var noDaysElapsed = service.elapsedDay(groupStartDate, groupEndDate)
    //     .then(function () {
    //       $log.info('Success!');
    //     })
    //     .catch(function (err) {
    //       $log.error('Error: ', err);
    //     });
    //     expect(noDaysElapsed).toBe(0);
    // });

  })
})();