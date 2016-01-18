(function() {
  'use strict';
  beforeEach(module('eggercise'));

  describe('InviteCtrl', function() {
    var rootScope, controller, inviteService, passPromise;

    beforeEach(inject (function ($rootScope, $controller, $q) {
      rootScope = $rootScope;

      // Mock GroupService methods to return the expected data.
      // No need to call the actual GroupService. It has its own spec.
      inviteService = (function() {
        return {
          createInvite: function(formData) {
            if(passPromise) {
              return $q.when([{
                email: 'newinvite@mail.com',
                _group: '564784feda231123fabc34'
            }])
            } else {
              return $q.reject('createInvite failed');
            }
          }
        };
      })();


      // Create a spy to track calls to inviteService.createInvite
      //and pass the call to the mocked up method
      spyOn(inviteService, 'createInvite').and.callThrough();

      // Create the controller we are testing and i
      //nject the mock service we declared above
      controller = $controller('InviteCtrl', {
        InviteService: inviteService
      });
    }));

    it('should define vm', function() {
      expect(controller).toBeDefined();
      expect(controller.invites).toBeDefined();
      expect(controller.formData).toBeDefined();
    });

    it('should create an invitation', function() {
      // Test a successful call to the InviteService
      passPromise = true;
      // Explicitly call the controller actions we are testing
      controller.createInvite();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(inviteService.createInvite).toHaveBeenCalled();
      // Test that the data has the correct properties and values
      expect(controller.invites).toBeDefined();
      expect(controller.invites.length).toBe(1);



    });


  });
})();
