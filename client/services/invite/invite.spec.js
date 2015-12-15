(function() {
  'use strict';

  describe('InviteService', function() {
    var service, $httpBackend, handler, inviteData, errorMessage;

    // Configure module that contains the controller being tested
    beforeEach(module('eggercise'));

    beforeEach(inject(function (_$httpBackend_, _InviteService_) {
      $httpBackend = _$httpBackend_;
      service = _InviteService_;
      inviteData = [];


      // Define an object with functions to handle success and error for our API calls
      // These functions simulate the functions written in controllers when a service is called
      handler = {
        success: function(invitation) {
          inviteData.push(invitation);
        },
        error: function(err) {
          errorMessage = err;
        }
      };

      // Use the Jasmine spyOn method to setup a callback using our handler mock object
      spyOn(handler, 'success').and.callThrough();
      spyOn(handler, 'error').and.callThrough();
    }));

   
    //Test for createInvite()
    it('should create a new invitation', function () {
      var createInv = service.createInvite()
        .then(function (){
          console.log('successful');
        })
        .catch(function (err){
          console.log('Error. Did not create invitation', err);
        });
        expect(createInv).toBeTruthy();
    });
  });


  })();
