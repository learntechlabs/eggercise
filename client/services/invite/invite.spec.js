(function() {
  'use strict';

  describe('InviteService', function() {
    var service, $httpBackend, handler, inviteData, errorMessage;

    var id = '56705595cfa2396ab020bfd4';
    var newInvite = {
      _id: id,
      email: 'testlogging@test.com',
      _group: '566f8f6697c28b4e971c6a50'
    };

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
    it('should let a group creator create an invite', function () {

      $httpBackend.whenPOST(/create/)
        .respond (respondToHttp);

      // setup the service to use the success and error handler functions we defined in the beforeEach block.
      service.createInvite().then(handler.success, handler.error);
      $httpBackend.flush();

      // tests the results
      expect(handler.success).toHaveBeenCalled();
      expect(handler.error).not.toHaveBeenCalled();
      expect(errorMessage).toBeUndefined();
    });

    //Test for createInvite() Fail
    it('should NOT let a group creator create an invite', function () {
      id = 'wrongId';
      $httpBackend.whenPOST(/create/)
        .respond (respondToHttp);

      service.createInvite().then(handler.success, handler.error);
      $httpBackend.flush();

      //test the results
      expect(handler.error).toHaveBeenCalled();
      expect(handler.success).not.toHaveBeenCalled();
      expect(errorMessage).toBeDefined();
    });

    //Test for createInvite()
    it('should return a successful promise for invitation', function () {
      var createInv = service.createInvite()
        .then(function (){
          console.log('successful');
        })
        .catch(function (err){
          console.log('Error. Did not create invitation', err);
        });
        expect(createInv).toBeTruthy();
    });

    function respondToHttp(method, url, params) {
      var inviteId = id;
      if (inviteId === newInvite._id) {
        return [200, newInvite];
      } else {
        return[404, { message: 'Not Found'}];
      }
    }

  });
})();
