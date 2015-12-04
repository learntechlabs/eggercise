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
				console.log(error);
				done.fail(error);
			} else {
				creator = dummyUser;
				loginUser(auth, done);
				// done();
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
		var group;

		beforeEach(function (done) {
			console.log('auth',auth);
			Group.create({
				name: 'testGroup',
				email: 'testGroup@test.com',
				bet: 100,
				start:'12-01-2015',
				end:'12-31-2015',
				_creator:creator._id
			}, function (error, newGroup) {
				if (error) {
					console.log(error);
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

		// it('login', loginUser());
		
		it('should create a new group', function (done) {
			console.log(auth);
			var creatorId = creator._id;
			agent
			.post('/api/groups/create')
			.send({
				name:'testGroupCreate1',
				email: 'create@test.com',
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
					var returnedGroup = res.body.group;
					expect(returnedGroup.name).toBe('testGroupCreate1');
					Group.findOne({ _id: returnedGroup._id})
					.remove(function (error) {
						done();
					})
				}
			});
		});			

		it('should delete the group', function (done) {
			var creatorId = creator._id;
			agent
			.post('/api/groups/' + group._id)
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
							done();
						}
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
	// .expect(200)
	.end(onResponse);

	function onResponse(error, res) {
		if(error) {
			console.log(error);
			throw error;
		} else {
			auth.token = res.body.token;
			agent.saveCookies(res);
			done();
		}
	}
	
}