(function() {
  'use strict';

  describe('ViewLogService', function() {
    var service, $httpBackend, handler, logData, errorMessage;

    var id = '56943db0cd71d5031ad3e194';
    var dummyDate1 = '01-10-2016';
    var dummyUser = {
      _id: id,
      exercises: [dummyDate1]
    };


    // Configure module that contains the controller being tested
    beforeEach(module('eggercise'));

    beforeEach(inject(function (_$httpBackend_, _ViewLogService_) {
      $httpBackend = _$httpBackend_;
      service = _ViewLogService_;
      logData = [];


      // Define an object with functions to handle success and error for our API calls
      // These functions simulate the functions written in controllers when a service is called
      handler = {
        success: function(logs) {
          logData.push(logs);
        },
        error: function(err) {
          errorMessage = err;
        }
      };

      // Use the Jasmine spyOn method to setup a callback using our handler mock object
      spyOn(handler, 'success').and.callThrough();
      spyOn(handler, 'error').and.callThrough();
    }));

    //test to view single member's exercise logs
    it('should view single member exercise logs', function(){
      var response = service.showLogs()
        .then(function (){
          console.log('success!!');
        })
        .catch(function (err){
          console.log('error!', err);
        });

        expect(response).toBeTruthy();
    });



  });
})();
