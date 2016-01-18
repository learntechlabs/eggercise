(function() {
  'use strict';
  beforeEach(module('eggercise'));

  describe('ShowGroupCtrl', function() {
    var rootScope, controller, groupService, passPromise;

    beforeEach(inject (function ($rootScope, $controller, $q) {
      rootScope = $rootScope;

      // Mock GroupService methods to return the expected data.
      // No need to call the actual GroupService. It has its own spec.
      groupService = (function() {
        return {
          showGroup: function(id) {
            if(passPromise) {
              return $q.when({
                _id: '56662b84c6e3a5280b1209aa'
              });
            } else {
              return $q.reject('showGroup failed');
            }
          }
        };
      })();


      // Create a spy to track calls to groupService.showGroup
      //and pass the call to the mocked up method
      spyOn(groupService, 'showGroup').and.callThrough();

      // Create the controller we are testing and i
      //nject the mock service we declared above
      controller = $controller('ShowGroupCtrl', {
        GroupService: groupService
      });
    }));

    // it('should define vm', function() {
    //   expect(controller).toBeDefined();
    //   expect(controller.group).toBeDefined();
    //   expect(controller.startdate).toBeDefined();
    //   expect(controller.enddate).toBeDefined();
    // });

    // it('should show one group', function() {
    //   // Test a successful call to the GroupService
    //   passPromise = true;
    //   // Explicitly call the controller actions we are testing
    //   controller.showGroup();
    //   // Force the action to be executed and the promise to be resolved
    //   rootScope.$digest();
    //   // Test that the controller called the correct method on the service
    //   expect(groupService.showGroup).toHaveBeenCalled();
    //   // Test that the data has the correct properties and values
    //   expect(controller.group).toBeDefined();
    //   expect(controller.startdate).toBeDefined();
    //   expect(controller.enddate).toBeDefined();
    // });

  });
})();
