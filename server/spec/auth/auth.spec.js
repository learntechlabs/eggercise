var request = require('supertest'),
  Auth = require('../../auth/auth.service'),
  User = require('../../api/user/user.model'),
  app  = require('../../server');

describe('Auth', function() {

  it('should authenticate the user', function (done) {
    request(app).post('/auth/local')
    .send({
      email:'test@test.com',
      password: 'test'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res){
      expect(err).toBeNull();
      expect(res.body).toBeDefined();
      done();
    })
  });

  it('should not authenticate the user', function (done) {
    request(app).post('/auth/local')
    .send({
      email: 'test@test2.com',
      password: 'wrong'
    })      
    .expect('Content-Type', /json/)
    .expect(404)
    .end(function(err, res){
      expect(err).toBeDefined();
      done();
    });  
  });

});