'use strict';

var Group = require('../../../api/group/group.model');

	describe('Group', function(){

		it('should have a name', function() {
			var group = new Group();
			group.name = 'groupName';
			expect(group.name).toBe('groupName');
		});

		it('should have a bet', function() {
			var group = new Group();
			group.bet = 9000;
			expect(group.bet).toBe(9000);
		});

		it('should return empty member', function() {
			var group = new Group();
			expect(group._member).toBeUndefined();
		});
})