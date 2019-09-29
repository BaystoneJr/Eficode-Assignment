const chai = require('chai');
const chaiHttp = require('chai-http');
const testApi = require('./testApi');
const responses = require('./apiResponse.json');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

const weatherResponse = responses.WeatherResponse;
const forecastResponse = responses.ForecastResponse;
const weatherCoordResponse = responses.WeatherCoordResponse;
const forecastCoordResponse = responses.ForecastCoordResponse;

chai.use(chaiHttp);

// eslint-disable-next-line no-undef
describe('API tests', () => {
  // eslint-disable-next-line no-undef
  it('Should return current weather of default city(Helsinki)', (done) => {
    chai.request(testApi)
        .get('/api/weather')
        // eslint-disable-next-line handle-callback-err
        .end((err, res) => {
          res.should.have.status(200);
          // eslint-disable-next-line no-unused-expressions
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('icon');
          res.body.should.have.property('description');
          res.body.should.have.property('id');
          res.body.should.have.property('main');
          res.body.icon.should.equal(weatherResponse.weather[0].icon);
          res.body.description.should.equal(weatherResponse.weather[0].description);
          done();
        });
  });
  // eslint-disable-next-line no-undef
  it('Should return forecast of the default city', (done) => {
    chai.request(testApi)
      .get('/api/forecast')
      // eslint-disable-next-line handle-callback-err
      .end((err, res) => {
        res.should.have.status(200);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.an('array');
        res.body.length.should.equal(8);
        res.body[0][0].should.be.a('object');
        res.body[0][0].should.have.property('icon');
        for (let index = 0; index < res.body.length; index++) {
          res.body[index][0].icon.should.equal(forecastResponse.list[index].weather[0].icon);
          res.body[index][1].should.equal(forecastResponse.list[index].dt_txt);
        }
        done();
      });
  });
  it('Should return current weather of coordinates given', (done) => {
    chai.request(testApi)
        .get('/api/weather?lat=60&long=24')
        // eslint-disable-next-line handle-callback-err
        .end((err, res) => {
          res.should.have.status(200);
          // eslint-disable-next-line no-unused-expressions
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('icon');
          res.body.should.have.property('description');
          res.body.should.have.property('id');
          res.body.should.have.property('main');
          res.body.icon.should.equal(weatherCoordResponse.weather[0].icon);
          res.body.description.should.equal(weatherCoordResponse.weather[0].description);
          done();
        });
  });
  it('Should return forecast of the coordinates', (done) => {
    chai.request(testApi)
      .get('/api/forecast?lat=60&long=24')
      // eslint-disable-next-line handle-callback-err
      .end((err, res) => {
        res.should.have.status(200);
        // eslint-disable-next-line no-unused-expressions
        res.should.be.json;
        res.body.should.be.an('array');
        res.body.length.should.equal(8);
        res.body[0][0].should.be.a('object');
        res.body[0][0].should.have.property('icon');
        for (let index = 0; index < res.body.length; index++) {
          res.body[index][0].icon.should.equal(forecastCoordResponse.list[index].weather[0].icon);
          res.body[index][1].should.equal(forecastCoordResponse.list[index].dt_txt);
        }
        done();
      });
  });
});
