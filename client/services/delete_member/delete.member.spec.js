(function() {
  'use strict';

  describe('DeleteMemberService', function() {
    var service, $httpBackend, handler, memberData, errorMessage;

    beforeEach(module('eggercise'));

    beforeEach(inject(function (_$httpBackend_, _DeleteMemberService_) {
      $httpBackend = _$httpBackend_;
      service = _DeleteMemberService_;
      memberData = [];


      handler = {
        success: function(member) {
          memberData.push(member);
        },
        error: function(err) {
          errorMessage = err;
        }
      };

      spyOn(handler, 'success').and.callThrough();
      spyOn(handler, 'error').and.callThrough();
    }));

    

    it('should delete a member', function() {
      var id = '569d71819fa8beb94e1a67f0';
      var existingUser = {
        _id :  id,
        name : 'test',
        email : 'test@test.com',
        passwordHash : 'password'
      }

      $httpBackend.whenPOST(/delete\/(\S+)$/)
        .respond(function(method, url, params) {
          // Retrieve the asked id as integer ...
          var re = /.*\/delete\/(\S+)$/;
          var userId = url.replace(re, '$1');

          if (userId === existingUser._id) {
            return [200, existingUser];
          } else {
            return [404, { message: 'Not Found' }];
          }
        });

      service.deleteMember(id).then(handler.success, handler.error);
      $httpBackend.flush();


      expect(memberData[0]._id).toEqual(existingUser._id);
      expect(handler.error).not.toHaveBeenCalled();
      expect(errorMessage).toBeUndefined();
    });
  });
})();
