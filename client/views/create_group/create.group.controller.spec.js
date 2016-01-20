(function() {
  'use strict';

  beforeEach(module('eggercise'));

  describe('CreateGroupCtrl', function() {
    var rootScope, controller, groupService, passPromise;

    beforeEach(inject(function($rootScope, $controller, $q) {      
      rootScope = $rootScope;
      // Mock GroupService methods to return the expected data.
      // No need to call the actual GroupService. It has its own spec.
      groupService = (function() {
        return {
          // The function definition must match the function being mocked up. Even if the parameter is not used in the mock.
          createGroup: function(formData) {
            if (passPromise) {
              return $q.when({ 
                _id: "564784feda231123fabc34",
                name: 'Mock Group'
              });
            } else {
              return $q.reject('createGroup failed');
            }
          }
        };
      })();

      // Create a spy to track calls to groupService.createGroup and pass the call to the mocked up method
      spyOn(groupService, 'createGroup').and.callThrough();

      // Create the controller we are testing and inject the mock service we declared above
      controller = $controller('CreateGroupCtrl', {
        GroupService: groupService
      });
    }));

    it('should define vm', function() {
      expect(controller).toBeDefined();
      expect(controller.groups).toBeDefined();
      expect(controller.formData).toBeDefined();
    });

    it('should create a group', function() {
      // Test a successful call to the GroupService
      passPromise = true;
      // Setup the data for the form.
      controller.formData = {
        name: 'CreateGroupCtrl Test Group'
      };

      // Explicitly call the controller actions we are testing
      controller.createGroup();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(groupService.createGroup).toHaveBeenCalled();
      // Test to make sure the controller did what was expected in an error case
      expect(controller.groups.length).toEqual(1);
    });


    it('should not create a group', function() {
      // Test an unsuccessful call to the GroupService
      passPromise = false;
      // Setup the data for the form.
      controller.formData = {
        name: 'CreateGroupCtrl Test Group Fail'
      };

      // Explicitly call the controller actions we are testing
      controller.createGroup();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(groupService.createGroup).toHaveBeenCalled();
      // Tests to make sure the controller did what was expected in an error case
      expect(controller.groups.length).toEqual(0);
      expect(controller.error).toBeDefined();
    });
  });

})();
