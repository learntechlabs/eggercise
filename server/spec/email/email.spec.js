var request = require('supertest'),
  EmailService = require('../../email/email.service'),
  User = require('../../api/user/user.model'),
  app  = require('../../server');

describe('Email service', function() {

  it('should send an email to the invitee', function (done) {
   EmailService.send('dechenxx@gmail.com', 'You are awesome', 'You are awesomer', function (err, json){
      if(err){
        done.fail(err);
      }else{
        expect(json).toBeDefined();
        expect(json.message).toBeDefined();
        expect(json.message).toBe('success');
        done();
      }
    });
  })

  it('should not send an email to the invitee', function (done) {
   EmailService.send(null, 'subject here', 'You are awesomer', function (err, json){
      if(err){
        console.log('err: ', err);
        expect(err).toBe('Email must be provided')
        done();
      }else{
        done.fail(err);
      }
    });
  })

});
