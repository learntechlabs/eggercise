(function() {
  'use strict';
  beforeEach(module('eggercise'));

  describe('DeleteGroupCtrl', function() {
    var rootScope, controller, groupService, passPromise, locationService;

    beforeEach(inject (function ($rootScope, $controller, $q, $location) {
      rootScope = $rootScope;
      locationService = $location;

      // Mock GroupService methods to return the expected data.
      // No need to call the actual GroupService. It has its own spec.
      groupService = (function (id) {
        return {
          deleteGroup: function(id) {
            if(passPromise) {
              return $q.when({
                group: {
                  _id: '56662b84c6e3a5280b1209aa'
                }
              });
            } else {
              return $q.reject('deleteGroup failed');
            }
          }
        };
      })();


      // Create a spy to track calls to groupService.deleteGroup
      //and pass the call to the mocked up method
      spyOn(groupService, 'deleteGroup').and.callThrough();

      // Create the controller we are testing and i
      //nject the mock service we declared above
      controller = $controller('DeleteGroupCtrl', {
        GroupService: groupService
      });
    }));

    it('should delete a group', function() {
      rootScope.unauthorized =false; 
      // Test a successful call to the GroupService
      passPromise = true;
      // Explicitly call the controller actions we are testing
      controller.deleteGroup();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(groupService.deleteGroup).toHaveBeenCalled();
      // Test to make sure the controller did what was expected in an error case
      expect(locationService).toBeDefined();
    });

    it('should not delete a group', function() {
      passPromise = false;

      controller.deleteGroup();
      rootScope.$digest();
      expect(groupService.deleteGroup).toHaveBeenCalled();
      expect(controller.error).toBeDefined();
    });
  });
})();
