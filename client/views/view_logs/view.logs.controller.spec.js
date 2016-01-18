(function() {
  'use strict';
  beforeEach(module('eggercise'));

  describe('ViewLogCtrl', function() {
    var rootScope, controller, viewLogService, passPromise;

    beforeEach(inject (function ($rootScope, $controller, $q) {
      rootScope = $rootScope;

      // Mock ViewLogService methods to return the expected data.
      // No need to call the actual ViewLogService. It has its own spec.
      viewLogService = (function() {
        return {
          showLogs: function(id) {
            if(passPromise) {
              return $q.when(
                ['01-10-2016']
              );
            } else {
              return $q.reject('showLogs failed');
            }
          }
        };
      })();


      // Create a spy to track calls to viewLogService.showLogs
      //and pass the call to the mocked up method
      spyOn(viewLogService, 'showLogs').and.callThrough();

      // Create the controller we are testing and i
      //nject the mock service we declared above
      controller = $controller('ViewLogCtrl', {
        ViewLogService: viewLogService
      });
    }));

    it('should define vm', function() {
      expect(controller).toBeDefined();
      expect(controller.logs).toBeDefined();
      expect(controller.formData).toBeDefined();
    });

    it('should show all logs of member in a group', function() {
      // Test a successful call to the ViewLogService
      passPromise = true;
      // Explicitly call the controller actions we are testing
      controller.showLogs();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(viewLogService.showLogs).toHaveBeenCalled();
      // Test that the data has the correct properties and values
      expect(controller.logs).toBeDefined();
    });

    it('should not show all logs of member in a group', function() {
      passPromise = false;
      controller.showLogs();
      rootScope.$digest();
      expect(viewLogService.showLogs).toHaveBeenCalled;
      expect(controller.error).toBe('showLogs failed');


    });

  
  });
})();
