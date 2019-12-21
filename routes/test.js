var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./app');
  });

  //Route Tests
  it('responds to / with JSON', function (done) {
    request(server)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(200, {text: "Hello World"}, done)
  });
  it('404 everything else', function (done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
