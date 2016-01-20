'use strict';

var mongoose = require('mongoose'),
  config = require('../../../config/environment'),
  User = require('../../../api/user/user.model');

beforeEach(function() {
  mongoose.connect(config.mongo.uri);
});

afterEach(function(done) {
  mongoose.disconnect(done);
});

describe ('User', function() {
  it('should have a name and email', function() {
    var user = new User({name: 'test', email: 'test@test.com'});
    expect(user.name).toBe('test');
    expect(user.email).toBe('test@test.com');
  });

  it('should have an passwordHash and salt', function() {
    var user = new User({name: 'blah', email: 'test@test.com', password: 'test'});
    expect(user.passwordHash).toBeDefined();
    expect(user.salt).toBeDefined();
    expect(user.authenticate('test')).toBe(true);
  });

  it('should create a new user', function(done) {
    User.create({
      name: 'Test User',
      email: 'test@learntech.com',
      password: 'dummyPassword'
    }, function(err, newUser) {
        if (err) {
          console.log(err);
          done.fail(err);
        } else {
          expect(newUser).toBeDefined();
          newUser.remove(function(err, newUser) {
            if (err) {
              done.fail(err);
            } else {
              done();
            }
          });
        }
      });
  });
});