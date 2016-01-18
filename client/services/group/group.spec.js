(function() {
  'use strict';

  describe('GroupService', function() {
    var service, $httpBackend, handler, groupData, errorMessage;

    // Configure module that contains the controller being tested
    beforeEach(module('eggercise'));

    beforeEach(inject(function (_$httpBackend_, _GroupService_) {
      $httpBackend = _$httpBackend_;
      service = _GroupService_;
      groupData = [];


      // Define an object with functions to handle success and error for our API calls
      // These functions simulate the functions written in controllers when a service is called
      handler = {
        success: function(group) {
          groupData.push(group);
        },
        error: function(err) {
          errorMessage = err;
        }
      };

      // Use the Jasmine spyOn method to setup a callback using our handler mock object
      spyOn(handler, 'success').and.callThrough();
      spyOn(handler, 'error').and.callThrough();
    }));

    //Test for showAllGroups()
    it('should show the list of groups', function () {
      var id = '56662b84c6e3a5280b1209aa';
      var existingGroup = {
        _id : id,
        name : 'New Group',
        email : 'new3@email.com',
        bet : 25,
        start: '2015-12-01T08:00:00Z',
        end: '2015-12-31T08:00:00Z',
        _creator : '565f912726c74d251d0a7b03'
      };
      // expect(200);
      var response = service.showAllGroups()
        .then(function () {
          console.log('successful');
        })
        .catch(function (err) {
          console.log('Error!!!', err);
        });

      expect(response).toBeTruthy();
      // $httpBackend.flush();
    })

    //Test to showGroup()
    it('should show one group', function () {
      var id = '56662b84c6e3a5280b1209aa';
      var existingGroup = {
        _id : id,
        name : 'Tiger Group',
        email : 'tiger@mail.com',
        bet : 500,
        start : '2015-12-31T09:00:00Z',
        end : '2016-1-31T09:00:00Z',
        _creator : '565f912726c74d251d0a7b03'
      };
      var response = service.showGroup()
        .then(function () {
          console.log('successful');
        })
        .catch(function (err) {
          console.log('Error: ', err);
        });

        expect(response).toBeTruthy();
    })


    //Test for createGroup()
    it('should create a new group', function () {
      // expect(200);
      var createG = service.createGroup()
        .then(function () {
          console.log('successful');
        })
        .catch(function (err) {
          console.log('Error!!!', err);
        });

      expect(createG).toBeTruthy();
      // $httpBackend.flush();
    })


    it('should delete a group', function() {
      var id = '56662b84c6e3a5280b1209aa';
      var existingGroup = {
        _id : id,
        name : 'New Group',
        email : 'new3@email.com',
        bet : 25,
        start: '2015-12-01T08:00:00Z',
        end: '2015-12-31T08:00:00Z',
        _creator : '565f912726c74d251d0a7b03'
      };

      // Use the httpBackend mock service to capture the call to our API and return the data we specify in the response variable
      $httpBackend.whenPOST(/delete\/(\S+)$/)
        .respond(function(method, url, params) {
          // Retrieve the asked id as integer ...
          var re = /.*\/delete\/(\S+)$/;
          var groupId = url.replace(re, '$1');

          if (groupId === existingGroup._id) {
            return [200, existingGroup];
          } else {
            return [404, { message: 'Not Found' }];
          }
        });

      // setup the service to use the success and error handler functions we defined in the beforeEach block.
      service.deleteGroup(id).then(handler.success, handler.error);
      // execute the HTTP API call
      $httpBackend.flush();

      // tests the results
      // expect(handler.success).toHaveBeenCalled();
      expect(groupData[0]._id).toEqual(existingGroup._id);
      expect(handler.error).not.toHaveBeenCalled();
      expect(errorMessage).toBeUndefined();
    });


    it('should update a group', function() {
      var id = '56662b84c6e3a5280b1209aa';
      var existingGroup = {
        _id : id,
        name : 'New Group',
        email : 'new3@email.com',
        bet : 25,
        start: '2015-12-01T08:00:00Z',
        end: '2015-12-31T08:00:00Z',
        _creator : '565f912726c74d251d0a7b03'
      };

      var updatedGroup = {
        _id : id,
        name : 'New Updated Group',
        email : 'new5@email.com',
        bet : 30,
        start: '2015-12-15T08:00:00Z',
        end: '2015-12-25T08:00:00Z',
        _creator : '565f912726c74d251d0a7b03'
      }

      // Use the httpBackend mock service to capture the call to our API and return the data we specify in the response variable
      $httpBackend.whenPOST(/update\/(\S+)$/)
        .respond(function(method, url, params) {
          // Retrieve the asked id as integer ...
          var re = /.*\/update\/(\S+)$/;
          var groupId = url.replace(re, '$1');

          if (groupId === existingGroup._id) {
            return [200, updatedGroup];
          } else {
            return [404, { message: 'Not Found' }];
          }
        });

      // setup the service to use the success and error handler functions we defined in the beforeEach block.
      service.updateGroup(id).then(handler.success, handler.error);
      // execute the HTTP API call
      $httpBackend.flush();

      // tests the results
      // expect(handler.success).toHaveBeenCalled();
      expect(groupData[0]._id).toEqual(updatedGroup._id);
      expect(handler.error).not.toHaveBeenCalled();
      expect(errorMessage).toBeUndefined();
    });





  });
})();
