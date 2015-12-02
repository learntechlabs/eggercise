var request = require('supertest'),
  Invite = require('../../api/invite/invite.model'),
  User = require('../../api/user/user.model'),
  Group = require('../../api/group/group.model');

  describe ('Invite', function() {
    it('should have an email', function() {
      var invite = new Invite({email: 'test@test.com'});
      expect(invite.email).toBe('test@test.com');
    });
  });

  describe ('Invite', function() {
    it('should have an user id and a group id', function() {
      var invite = new Invite({User: User._id, Group: Group._id});
      expect(invite.User).toBe(User._id);
      expect(invite.Group).toBe(Group._id);
    });
  });
