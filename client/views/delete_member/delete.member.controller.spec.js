(function() {
  'use strict';
  beforeEach(module('eggercise'));

  describe('DeleteMemberCtrl', function() {
    var rootScope, controller, deleteMemberService, passPromise, locationService;

    beforeEach(inject (function ($rootScope, $controller, $q, $location) {
      rootScope = $rootScope;
      locationService = $location;

      //mocking the DeleteMemberService
      deleteMemberService = (function (id) {
        return {
          deleteMember: function(id) {
            if(passPromise) {
              return $q.when({
                member: {
                  _id: '569d71819fa8beb94e1a67f0'
                }
              });
            } else {
              return $q.reject('deleteMember failed');
            }
          }
        };
      })();

      spyOn(deleteMemberService, 'deleteMember').and.callThrough();


      controller = $controller('DeleteMemberCtrl', {
        DeleteMemberService: deleteMemberService
      });

    }));

    it('should delete a member from a group', function() {
      passPromise = true;
      controller.deleteMember();
      rootScope.$digest();
      expect(deleteMemberService.deleteMember).toHaveBeenCalled();
      expect(locationService).toBeDefined();
    });

    it('should not delete a member from a group', function() {
      passPromise = false;
      controller.deleteMember();
      rootScope.$digest();
      expect(deleteMemberService.deleteMember).toHaveBeenCalled();
      expect(controller.error).toBeDefined();
    });
  });
})();
