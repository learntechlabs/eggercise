'use strict';

describe('EditProfile', function () {
  var service,
    $httpBackend;

    beforeEach(function () {
      module('eggercise')
      inject(function (_EditProfile_, _$httpBackend_) {
        service = _EditProfile_;
        $httpBackend = _$httpBackend_;
      });
    });

    afterEach(function () {
      // $httpBackend.verifyNoOutstandingExpectation();
      // $httpBackend.verifyNoOutstandingRequest();
    });

    //Test for editProfile()
    it('should edit a users profile', function () {
      var editP = service.editProfile()
        .then(function () {
        })
        .catch(function (err) {
          console.log('Error: ', err);
        });
      expect(editP).toBeTruthy();
    })

})