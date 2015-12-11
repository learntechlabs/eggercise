'use strict';

//packages and modules required
var request = require('supertest'),
  app = require('../../../server'),
  agent = request.agent(app);

//model
var User = require('../../../api/user/user.model');

//auth
var auth = {};

//variables
var user;

describe('User', function() {
  describe('with data', function() {
    beforeEach(function (done) {
      User.create({
        name: 'test',
        email: 'test@test.com',
        password: 'testing',
        exercises: '12-09-2015'
      }, function (error, newUser) {
        if (error) {
          done.fail(error);
        } else {
          user = newUser;
          loginUser(auth, done);
        }
      });
    });

    afterEach(function (done) {
      User.remove({name: 'test'}, function (error, removeUser) {
        if (error) {
          done.fail(error);
        } else {
          done();
        }
      });
    });
    //Test for showing an existing user
    it('should return an existing user', function (done) {
      agent
      .get('/api/users/me')
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          var returnUser = res.body;
          expect(returnUser.name).toBe('test');
          done();
        }
      });
    });

    //Test for creating a new user
    it('should create a new user', function (done) {
      request(app)
      .post('/api/users/')
      .send({
        name: 'testers',
        email: 'testers@testers.com',
        password: 'testers'
      })
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          var returnedUser = res.body;
          expect(returnedUser.user.name).toBe('testers');
          User.findOne({_id: returnedUser.user._id})
          .remove(function (error) {
            done();
          })
        }
      });
    });

    //Test for updating an existing user
    it('should modify an existing user', function (done) {
      agent
      .get('/api/users/me')
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          agent
          .post('/api/users/updateProfile')
          .set('Authorization', 'Bearer ' + auth.token)
          .send({
            email: 'changed2@changed.com',
            password: 'newpass'
          })
          .end(function (error, res) {
            if (error) {
              done.fail(error);
            } else {
              var postUser = res.body;
              expect(postUser.email).toBe('changed2@changed.com');
              done();
            }
          });
        }
      });
    });

    //Test for logging an exercise
    //TODO: Possible negative case is user trying to log workout
    //before the date they joined the group. Test this case.
    it('should log an exercise', function (done) {
      var rawDate = '12-12-2015';
      agent
      .post('/api/users/log/' + user._id)
      .send({
        exercises: rawDate
      })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error,res) {
        if(error) {
          done.fail(error);
        } else {
          var convertedDate = new Date(rawDate);
          var returnedUser = res.body;
          var returnedConverted = new Date(res.body.exercises[1]);
          expect(returnedConverted+'').toBe(convertedDate+'');
          done();
        }
      });
    });

    //Test for unlogging an exercise
    it('should unlog an exercise', function (done) {
      agent
      .post('/api/users/unlog/' + user._id)
      .set('Authorization', 'Bearer ' + auth.token)
      .send({
        exercises: user.exercises[user.exercises.length-1]
      })
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          var returnedUser = res.body;
          expect(returnedUser.exercises.length).toBe(0);
          done();
        }
      });
    });
  });
});

function loginUser(auth, done) {
  agent
  .post('/auth/local/')
  .send({
    email: 'test@test.com',
    password: 'testing'
  })
  .end(onResponse);
  function onResponse(error, res) {
    if (error) {
      throw error;
      done.fail(error);
    } else {
      auth.token = res.body.token;
      agent.saveCookies(res);
      done();
    }
  };
}