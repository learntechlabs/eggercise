'use strict';

//packages and modules required
var request = require('supertest'),
  app = require('../../../server'),
  agent = request.agent(app);

//model
var Group = require('../../../api/group/group.model'),
  User = require('../../../api/user/user.model');

//auth
var auth = {};

//variables
var creator;

describe('Group', function() {

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

  describe('without data', function() {

    // View all groups (when there is no data)
    it('should return no groups', function (done) {
      agent
      .get('/api/groups')
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else if (res) {
          expect(res.status).toBe(200);
          expect(res.body.length).toEqual(0);
          done();
        }
      });
    });
  });

  describe('with data (for a different logged in user)', function() {
    var group;

    // Save a different user id to the creator id for the group
    beforeEach(function (done) {
      Group.create({
        name: 'testGroup',
        email: 'testGroup@test.com',
        bet: 100,
        start:'12-01-2015',
        end:'12-31-2015',
        _creator:'5669f29f583f0b9f462f944c'
      }, function (error, newGroup) {
        if (error) {
          done.fail(error);
        } else {
          group = newGroup;
          done();
        }
      });
    });

    afterEach(function (done) {
      Group.remove({_id: group._id}, function (error, removedGroup) {
        if (error) {
          done.fail(error);
        } else {
          done();
        }
      });
    });

    // Error handling: no groups associated with logged in user
    it('should return no groups for this user', function (done) {
      agent
      .get('/api/groups')
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if(error) {
          done.fail(error);
        } else {
          expect(res.body.length).toEqual(0);
          done();
        }
      });
    });
  });

  describe('with data', function() {
    var group;

    beforeEach(function (done) {
      Group.create({
        name: 'testGroup',
        email: 'testGroup@test.com',
        bet: 100,
        start:'12-01-2015',
        end:'12-31-2015',
        _creator:creator._id

      }, function (error, newGroup) {
        if (error) {
          done.fail(error);
        } else {
          console.log(newGroup);
          group = newGroup;
          creator._groups.push(group)
          creator.save()
          User.findOne({_id: creator._id})
          .populate('_groups')
          .exec(function (error, foundUser) {
          })
          done();
        }
      });
    });

    afterEach(function (done) {
      Group.remove({_id: group._id}, function (error, removedGroup) {
        if (error) {
          done.fail(error);
        } else {
          done();
        }
      });
    });

    // View all groups (success)
    fit('should return all groups for logged in user', function (done) {
      agent
      .get('/api/groups')
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if(error) {
          done.fail(error);
        } else {
          console.log('res.body: ', res.body);
          expect(res.status).toBe(200);
          expect(res.body.length).toEqual(1);
          expect(res.body[0].name).toEqual('testGroup');
          expect(creator._groups[0]).toEqual(group._id);
          done();
        }
      });
    });

    it('should create a new group', function (done) {
      var creatorId = creator._id;
      agent
      .post('/api/groups/create')
      .send({
        name:'testGroupCreate1',
        bet: 9000,
        start:'01-01-2016',
        end: '01-31-2016',
        _creator: creatorId
      })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          var returnedGroup = res.body;
          expect(returnedGroup.name).toBe('testGroupCreate1');
          Group.findOne({ _id: returnedGroup._id})
          .remove(function (error) {
            done();
          })
        }
      });
    });

    //view single member page (positive)
    it('should show a single group', function (done) {
      var group_id = group._id;
      agent
      .get('/api/groups/' + group_id)
      .set('Authorization', 'Bearer ' + auth.token)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          expect(res.body.name).toBe('testGroup');
          done();
        }
      });
    });

    //will not show a single page (negative)
    it('should not show a single group', function (done) {
      var group_id = 'wehsdlkjflksdliur';
      agent
      .get('/api/groups/' + group_id)
      .set('Authorization', 'Bearer ' + auth.token)
      .end(function (error, res) {
        if (res) {
          expect(res.status).toBe(404);
          expect(res.body.err).toBe('not found');
          done();
        } else {
          done.fail(error);
        }
      });
    });

    //delete a group (positive)
    it('should delete the group (positive) ', function (done) {
      var creatorId = creator._id;
      agent
      .post('/api/groups/delete/' + group._id)
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          done.fail(error);
        } else {
          Group.findOne({name: 'testGroup'}, function (err, deletedGroup){
            if(err){
              done.fail.err;
            }else{
              expect(deletedGroup).toBeDefined();
              done();
            }
          })
        }
      });
    })

    //delete a group (negative)
    it('should not delete the group (negative)', function (done) {
      var creatorId = creator._id;
      var group_id = 'bull12345692owopk'
      agent
      .post('/api/groups/delete/' + group_id)
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (res) {
          expect(res.status).toBe(404);
          expect(res.body.err).toBe('deletedGroup not found');
          done();
        } else {
          done.fail(error);
        }
      });
    });



    //update an group (positive)
    it('should update an existing group(positive)', function (done){
      var creatorId = creator._id;
      agent
      .post('/api/groups/update/' + group._id)
      .send({
        name:'update',
        bet: 10,
        start:'02-01-2016',
        end: '02-31-2016',
        _creator: creatorId
      })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res){
        if(error){
          done.fail(error);
        }else {
          Group.findOne({name: 'update', _creator: creatorId}, function (error, updatedGroup){
            if(error){
              done.fail(error);
            }else{
              expect(updatedGroup).toBeDefined();
              expect(updatedGroup.name).toEqual('update');
              return done();
            }
          })
        }
      })
    });

    //update an group (negative)
    it('should not update an existing group(negative)', function (done){
      var creatorId = creator._id;
      var group_id = 'ball12345692owopk'
      agent
      .post('/api/groups/update/' + group_id)
      .send({
        name:'update',
        bet: 10,
        start:'02-01-2016',
        end: '02-31-2016',
        _creator: creatorId
      })
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res){
        if(res){
          expect(res.status).toBe(404);
          expect(res.body.err).toBe('updatedGroup not found');
          done();
        }else {
          done.fail(error);
        }
      })
    });

    //show members
    it('should return the members of a group', function (done) {
      var group_id = group._id;
      agent
      .get('/api/groups/' + group_id + '/leaderboard')
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if(error) {
          done.fail(error);
        } else {
          var foundMembers = res.body.members;
          expect(foundMembers).toBeDefined();
          expect(foundMembers.length).toBeDefined();
          done();
        }
      });
    });

    // does not show  members
    it('should not return the members of a group', function (done) {
      var group_id = '2498foiesfkjlsflaja';
      agent
      .get('/api/groups/' + group_id + '/leaderboard')
      .set('Authorization', 'Bearer ' + auth.token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (error, res) {
        if(res){
          expect(res.status).toBe(404);
          expect(res.body.err).toBe('group not found');
          done();
        }else {
          done.fail(error);
        }
      })
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
