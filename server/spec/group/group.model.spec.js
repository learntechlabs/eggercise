var mongoose = require('mongoose'),
	config = require('../../../config/environment'),
	User = require('../../../api/user/user.model'),
	Group = require('../../../api/group/group.model');

var dummy;

beforeAll(function (done) {
	mongoose.connect(config.mongo.uri);
	User.create({
		name:'ijustneedanId',
		password: 'givemeid',
		email:'id@test.com'
	}, function (error, newUser) {
		if (error) {
			done.fail(error);
		} else {
			dummy = newUser;
			done();
		}
	});
});

afterAll(function (done) {
	User.remove({_id: dummy._id}, function (error, removedUser) {
		if (error) {
			done.fail(error);
		} else {
			mongoose.disconnect(done);
			done();
		}
	});
});

describe ('Group', function() {
	it('should have a name, email and a betting price', function () {
		var group = new Group({
			name: 'testGroup',
			bet: 9000
		});
		expect(group.name).toBe('testGroup');
		expect(group.bet).toBe(9000);
	});

	it('should create a new group', function (done) {
		Group.create({
			name: 'createMe',
			bet: 9999,
			//_creator: 'imacreatorpotato',
			_creator: dummy._id,
			start: '12-03-2015',
			end: '01-31-2016'
		}, function (error, newGroup) {
			if (error) {
				done.fail(error)
			} else {
				expect(newGroup).toBeDefined();
				newGroup.remove(function (error, newGroup) {
					if (error) {
						done.fail(error);
					} else {
						done();
					}
				});
			}
		});
	});
});