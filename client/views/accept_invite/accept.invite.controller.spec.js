// (function() {
//   'use strict';
//   beforeEach(module('eggercise'));

//   describe('AcceptInviteCtrl Success', function() {
//     var rootScope, controller, inviteService, passPromise;

//     beforeEach(inject (function ($rootScope, $routeParams, $controller, $q) {
//       rootScope = $rootScope;
//       $routeParams.id = '1';

//       // Mock GroupService methods to return the expected data.
//       // No need to call the actual GroupService. It has its own spec.
//       inviteService = (function() {
//         return {
//           acceptInvite: function(id) {
//             if(passPromise) {
//               return $q.when({
//                 _id: '564784feda231123fabc34'
//             });
//             } else {
//               return $q.reject('acceptInvite failed');
//             }
//           }
//         };
//       })();


//       // Create a spy to track calls to acceptInviteService.createInvite
//       //and pass the call to the mocked up method
//       spyOn(inviteService, 'acceptInvite').and.callThrough();
//       // Test a successful call to the InviteService
//       passPromise = true;
//       // Create the controller we are testing and i
//       //nject the mock service we declared above
//       controller = $controller('AcceptInviteCtrl', {
//         InviteService: inviteService
//       });
//     }));

//     it('should accept an invitation', function() {
//       // Controller should be defined because it was executed in before each
//       expect(controller).toBeDefined();
//       // Force the action to be executed and the promise to be resolved
//       rootScope.$digest();
//       // Test that the controller called the correct method on the service
//       expect(inviteService.acceptInvite).toHaveBeenCalled();
//       // Test that the data has the correct properties and values
//       expect(controller.error).toBeUndefined();
//       expect(controller.group).toBeDefined();
//     });
//   });

//   describe('AcceptInviteCtrl Failure', function() {
//     var rootScope, controller, inviteService, passPromise;

//     beforeEach(inject (function ($rootScope, $routeParams, $controller, $q) {
//       rootScope = $rootScope;
//       $routeParams.id = '1';

//       // Mock GroupService methods to return the expected data.
//       // No need to call the actual GroupService. It has its own spec.
//       inviteService = (function() {
//         return {
//           acceptInvite: function(id) {
//             if(passPromise) {
//               return $q.when({
//                 _id: '564784feda231123fabc34'
//             });
//             } else {
//               return $q.reject('acceptInvite failed');
//             }
//           }
//         };
//       })();


//       // Create a spy to track calls to acceptInviteService.createInvite
//       //and pass the call to the mocked up method
//       spyOn(inviteService, 'acceptInvite').and.callThrough();
//       // Test a failed call to the InviteService
//       passPromise = false;
//       // Create the controller we are testing and i
//       //nject the mock service we declared above
//       controller = $controller('AcceptInviteCtrl', {
//         InviteService: inviteService
//       });
//     }));

//     it('should not accept an invitation', function() {
//       // Controller should be defined because it was executed in before each
//       expect(controller).toBeDefined();
//       // Force the action to be executed and the promise to be resolved
//       rootScope.$digest();
//       // Test that the controller called the correct method on the service
//       expect(inviteService.acceptInvite).toHaveBeenCalled();
//       // Test that the data has the correct properties and values
//       expect(controller.error).toBeDefined();
//       expect(controller.group).toBeUndefined();
//     });


//   });
// })();
