(function() {
  'use strict';
  beforeEach(module('eggercise'));

  describe('GroupCtrl', function() {
    var rootScope, controller, groupService, passPromise;

    beforeEach(inject (function ($rootScope, $controller, $q) {
      rootScope = $rootScope;

      // Mock GroupService methods to return the expected data.
      // No need to call the actual GroupService. It has its own spec.
      groupService = (function() {
        return {
          showAllGroups: function() {
            if(passPromise) {
              return $q.when([{ name: 'New Group', bet : 25 }])
            } else {
              return $q.reject('showAllGroups failed');
            }
          },
          deleteGroup: function(id) {
            if(passPromise) {
              return $q.when({
                _id: '56662b84c6e3a5280b1209aa'
              });
            } else {
              return $q.reject('deleteGroup failed');
            }
          }
        };
      })();


      // Create a spy to track calls to groupService.deleteGroup
      //and pass the call to the mocked up method
      spyOn(groupService, 'showAllGroups').and.callThrough();
      spyOn(groupService, 'deleteGroup').and.callThrough();

      // Create the controller we are testing and i
      //nject the mock service we declared above
      controller = $controller('GroupCtrl', {
      });
    }));

    it('should define vm', function() {
      expect(controller).toBeDefined();
      expect(controller.groups).toBeDefined();
      expect(controller.formData).toBeDefined();
    });

    it('should show all groups', function() {
      // Test a successful call to the GroupService
      passPromise = true;

      // Explicitly call the controller actions we are testing
      controller.showAllGroups();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(groupService.showAllGroups).toHaveBeenCalled();
      // Test that the data has the correct properties and values
      expect(controller.groups).toBeDefined();
    });

    it('should delete a group', function() {
      // Test a successful call to the GroupService
      passPromise = true;
      // Explicitly call the controller actions we are testing
      controller.deleteGroup();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(groupService.deleteGroup).toHaveBeenCalled();
      // Test to make sure the controller did what was expected in an error case
      expect(controller.groups[0]).toBeDefined();
    });

    it('should not delete a group', function() {
      passPromise = false;
      
      controller.deleteGroup();
      rootScope.$digest();
      expect(groupService.deleteGroup).toHaveBeenCalled();
      expect(controller.groups.length).toEqual(0);
      expect(controller.error).toBeDefined();
    });
  });
})();
