var request = require('supertest'),
  User = require('../../api/user/user.model');

  describe ('User', function() {
    it('should have a name and email', function() {
      var user = new User({name: 'test', email: 'test@test.com'});
      expect(user.name).toBe('test');
      expect(user.email).toBe('test@test.com');
    });
  });

  describe ('User', function() {
    it('should have an passwordHash and salt', function() {
      var user = new User({name: 'blah', email: 'test@test.com', password: 'test'});
      expect(user.passwordHash).toBeDefined();
      expect(user.salt).toBeDefined();
      expect(user.authenticate('test')).toBe(true);
    });
  });
