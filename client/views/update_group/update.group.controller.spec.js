(function() {
  'use strict';

  beforeEach(module('eggercise'));

  describe('UpdateGroupCtrl', function() {
    var rootScope, controller, groupService, passPromise;

    beforeEach(inject(function($rootScope, $controller, $q) {
      rootScope = $rootScope;
      // Mock GroupService methods to return the expected data.
      // No need to call the actual GroupService. It has its own spec.
      groupService = (function() {
        return {
          // The function definition must match the function being mocked up. Even if the parameter is not used in the mock.
          updateGroup: function (id, formData){
            if(passPromise){
              return $q.when({
                _id: '56662b84c6e3a5280b1209aa'
              });
            }else{
              return $q.reject('updateGroup failed');
            }
          }
        };
      })();

      // Create a spy to track calls to groupService.updateGroup and pass the call to the mocked up method
      spyOn(groupService, 'updateGroup').and.callThrough();

      // Create the controller we are testing and inject the mock service we declared above
      controller = $controller('UpdateGroupCtrl', {
        GroupService: groupService
      });
    }));

    it('should define vm', function() {
      expect(controller).toBeDefined();
      expect(controller.groups).toBeDefined();
      expect(controller.formData).toBeDefined();
    });

    it('should update a group', function() {
      // Test a successful call to the GroupService
      passPromise = true;
      // Setup the data for the form.
      controller.formData = {
        name: 'UpdateGroupCtrl Test Group',
        bet : 30,
        start: '2015-12-15T08:00:00Z',
        end: '2015-12-25T08:00:00Z',
        _creator : '565f912726c74d251d0a7b03'
      };

      // Explicitly call the controller actions we are testing
      controller.updateGroup();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(groupService.updateGroup).toHaveBeenCalled();
      // Test to make sure the controller did what was expected in an error case
      expect(controller.formData).toBeDefined();
    });


    it('should not update a group', function() {
      // Test an unsuccessful call to the GroupService
      passPromise = false;
      // Setup the data for the form.
      controller.formData = {
        name: 'UpdateGroupCtrl Test Group Fail'
      };

      // Explicitly call the controller actions we are testing
      controller.updateGroup();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(groupService.updateGroup).toHaveBeenCalled();
      // Tests to make sure the controller did what was expected in an error case
      expect(controller.error).toBe('updateGroup failed');
    });
  });

})();
