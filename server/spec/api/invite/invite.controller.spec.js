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
        } else {
          group = newGroup;
          creator._groups.push(group)
          creator.save()
          Invite.create({
            email: 'invitee@email.com',
            _group: group._id
          }, function (error, newInvite){
            if(error){
              done.fail(error);
            }else{
              invite = newInvite;
              done();
            }
          }) 
        }
      });
    });

    afterEach(function (done) {
      Group.remove({_id: group._id}, function (error, removedGroup) {
        if (error) {
          console.log(error);
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

    it('should create a new invitation through an email address', function (done){
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
          Invite.findOne({ _id: returnedInvite._id })
          .remove(function (error) {
            done();            
          })
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
