'use strict';

//packages and modules required
var request = require('supertest'),
  app = require('../../../server'),
  agent = request.agent(app);

//model
var Invite = require('../../../api/invite/invite.model'),
  Group = require('../../../api/group/group.model'),
  User = require('../../../api/user/user.model');

//auth
var auth = {};

//variables
var creator;
var group;
var invite;
var invitedUser;

describe('Invite', function() {

  beforeAll(function (done) {
    User.create({
      name: 'loginDummy',
      password: 'dummypw',
      email: 'dummy@test.com'
    }, function (error, dummyUser) {
      if(error) {
        done.fail(error);
      } else {
        creator = dummyUser;
        loginUser(auth, done);
      }
    });
  });

  afterAll(function (done) {
    User.remove({_id: creator._id}, function (error, removedCreator) {
      if (error) {
        done.fail(error);
      } else {
        done();
      }
    });
  });

  describe('with data', function() {

    beforeEach(function (done) {
      Group.create({
        name: 'testGroup',
        bet: 100,
        start:'12-01-2015',
        end:'12-31-2015',
        _creator: creator._id,
        _members: creator._id

      }, function (error, newGroup) {
        if (error) {
          console.log(error);
          done.fail(error);
        } else {
          group = newGroup;
          creator._groups.push(group);
          creator.save();
          Invite.create({
            email: 'invitee@email.com',
            _group: group._id
          }, function (error, newInvite){
            if(error){
              done.fail(error);
            }else{
              invite = newInvite;
              User.create({
                name:'invitedUser',
                password: 'invited',
                email:'invitee@email.com'
              }, function (error, newMember) {
                if (error) {
                  done.fail(error);
                } else {
                  invitedUser = newMember;
                  done();
                }
              })
            }
          })
        }
      });
    });

    afterEach(function (done) {
      Group.remove({_id: group._id}, function (error, removedGroup) {
        if (error) {
          console.log(error);
          done.fail(error);
        } else {
          Invite.remove({_id: invite._id, _group: group._id}, function (error, removedInvite){
            if(error){
              done.fail(error);
            }else{
              done();
            }
          })
        }
      });
    });

    //create an invitation(positive)
    fit('should create a new invitation through an email address', function (done){
    agent
      .post('/api/invites/create')
      .send({
        email: 'inviteemail@gmail.com',
        _group: group._id
      })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if(error){
          done.fail(error);
        } else {
          var returnedInvite = res.body;
          expect(returnedInvite).toBeDefined();
          expect(returnedInvite.email).toBe('inviteemail@gmail.com');
          expect(returnedInvite._group).toBe((group._id).toJSON());
          expect(returnedInvite.sent_at).toBeDefined();
          Invite.findOne({ _id: returnedInvite._id })
          .remove(function (error) {
            done();
          })
        }
      });
    });

    //doesn't create an invitation(negative)
    it('should not create a new invitation through an email address', function (done){
    agent
      .post('/api/invites/create')
      .send({
        _group: group._id
      })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(422)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          done();
        }
      });
    });

    //doesn't create an invitation(negative)
    // DO NOT know how to mock a service with a callback.
    // Will come back to this later
    // it('should not send a new invitation', function (done){
    //   spyOn(EmailService, 'send').and.respond(function() {

    //   });

    // agent
    //   .post('/api/invites/create')
    //   .send({
    //     email: 'invitee2@mail.com',
    //     _group: group._id
    //   })
    //   .set('Authorization', 'Bearer ' + auth.token)
    //   .expect('Content-Type', /json/)
    //   .expect(422)
    //   .end(function (error, res) {
    //     if (error) {
    //       done.fail(error);
    //     } else {
    //       console.log('this is the res in the if: ', res.body);
    //       expect(res.body.err).toBe('Did not create the invite');
    //       done();
    //     }
    //   });
    // });

    //Test for returning an existing invitation successfully
    it('should have invitee accept invitation', function (done) {
      agent
      .get('/api/invites/accept/'+invite._id)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if(error){
          done.fail(error);
        } else {
          expect(res.body.email).toBe(invitedUser.email);
          done();
        }
      });
    });
  });
});


function loginUser (auth, done) {
  agent
  .post('/auth/local/')
  .send({
    email: 'dummy@test.com',
    password: 'dummypw'
  })
  .expect(200)
  .end(onResponse);

  function onResponse(error, res) {
    if(error) {
      throw error;
    } else {
      auth.token = res.body.token;
      agent.saveCookies(res);
      done();
    }
  }
}
