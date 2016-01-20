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
        exercises: '12-09-2015',
        joinDate: '12-01-2015'
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
    // it('should return an existing user', function (done) {
    //   agent
    //   .get('/api/users/me')
    //   .set('Authorization', 'Bearer ' + auth.token)
    //   .expect('Content-Type', /json/)
    //   .expect(200)
    //   .end(function (error, res) {
    //     if (error) {
    //       done.fail(error);
    //     } else {
    //       var returnedUser = res.body;
    //       expect(returnedUser.name).toBe('test');
    //       expect(returnedUser.created_at).toBeDefined();
    //       done();
    //     }
    //   });
    // });

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
    it('should log an exercise', function (done) {
      var newDate = new Date('12-12-2015').toString();
      agent
      .post('/api/users/log/')
      .send({
        date: newDate
      })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error,res) {
        if(error) {
          done.fail(error);
        } else {
          var returnedUser = res.body;
          var returnedConverted = new Date(res.body.exercises[1]).toString();
          expect(returnedConverted).toBe(newDate);
          done();
        }
      });
    });

    //Test for unlogging an exercise
    it('should unlog an exercise', function (done) {
      agent
      .post('/api/users/unlog/')
      .set('Authorization', 'Bearer ' + auth.token)
      .send({
        date: user.exercises[user.exercises.length-1]
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

    //test to view single member's exercise logs
    it('should be able to view the exercise logs of a memeber in a group', function (done){
      var userId = user._id;
      agent
      .get('/api/users/showLog/' + userId)
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res){
        if(error){
          done.fail(error);
        }else{
          expect(res.body.length).toEqual(1);
          expect(user.exercises).toBeDefined();
          expect(user._id).toBe(userId);
          done();
        }
      });
    });


    //test to not view single member's exercise logs
    it('should not be able to view the exercise logs of a memeber in a group', function (done){
      var userId = "invaliduserid";
      agent
      .get('/api/users/showLog/' + userId)
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res){
        if(res){
          expect(res.status).toBe(404);
          expect(res.body.err).toBe('user not found');
          done();
        }else {
          done.fail(error);
        }
      })
    });

    //test to remove a member from a group if creator of the gorup
    it('should be able to remove a member in a group as a group creator', function (done){
      var userId = user._id;
      agent
      .post('/api/users/delete/' + userId)
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .end(function (error, res){
        if(error){
          done.fail(error);
        }else{
          User.findOne({name: 'test'}, function(error, deletedUser){
            if(error){
              done.fail.error;
            }else{
              expect(deletedUser).toBeDefined();
              done();
            }
          })
        }
      });
    });


    //test to not view single member's exercise logs
    it('should not be able to remove a member in a group as a group creator', function (done){
      var userId = "wrongUseridyo";
      agent
      .post('/api/users/delete/' + userId)
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res){
        if(res){
          expect(res.status).toBe(404);
          expect(res.body.err).toBe('user not deleted');
          done();
        }else {
          done.fail(error);
        }
      })
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
