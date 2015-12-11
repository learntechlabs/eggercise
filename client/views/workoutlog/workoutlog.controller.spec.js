(function() {
  'use strict';
  beforeEach(module('eggercise'));

  describe('WorkoutCtrl', function() {
    var rootScope, controller, workoutService, passPromise;

    beforeEach(inject(function ($rootScope, $controller, $q) {
      rootScope = $rootScope;
      workoutService = (function() {
        return {
          logWorkout: function() {
            if(passPromise){
              return $q.when({
                _id: '5669e40077cc88a84bbb5c13'
              });
            }else{
              return $q.reject('logging workout failed');
            }
          },

          unlogWorkout: function() {
            if(passPromise) {
              return $q.when({
                _id: '5669e40077cc88a84bbb5c13'
              });
            } else {
              return $q.reject('unlogging workout failed');
            }
          }
        };
      })();

      // Create a spy to track calls to workoutService.logWorkout and pass the call to the mocked up method
      spyOn(workoutService, 'logWorkout').and.callThrough();
      spyOn(workoutService, 'unlogWorkout').and.callThrough();      

      // Create the controller we are testing and inject the mock service we declared above
      controller = $controller('WorkoutCtrl', {
        WorkoutService: workoutService
      });
    }));

    it('should define vm', function() {
      expect(controller).toBeDefined();
      expect(controller.user).toBeDefined();
      expect(controller.formData).toBeDefined();
    });

    it('should log an exercise session', function() {
      //Test a successful call to the WorkoutService
      passPromise = true;
      // Explicitly call the controller actions we are testing
      controller.logWorkout();
      // Force the action to be executed and the promise to be resolved
      rootScope.$digest();
      // Test that the controller called the correct method on the service
      expect(workoutService.logWorkout).toHaveBeenCalled();
      // Test that the data has the correct properties and values
      expect(controller.user).toBeDefined();
    });

    it('should NOT log an exercise session', function() {
      passPromise = false;
      controller.logWorkout();
      rootScope.$digest();
      expect(workoutService.logWorkout).toHaveBeenCalled();
      expect(controller.error).toBeDefined();
    });

    it('should unlog an exercise session', function() {
      passPromise = true;
      controller.unlogWorkout();
      rootScope.$digest();
      expect(workoutService.unlogWorkout).toHaveBeenCalled();
      console.log('controller.user', controller.user);
      expect(controller.user).toBeDefined();
    });

    it('should NOT unlog an exercise session', function() {
      passPromise = false;
      controller.unlogWorkout();
      rootScope.$digest();
      expect(workoutService.unlogWorkout).toHaveBeenCalled();
      expect(controller.error).toBeDefined();
    });

  });
})();