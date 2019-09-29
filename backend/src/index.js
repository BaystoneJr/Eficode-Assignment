// eslint-disable-next-line no-unused-vars
const debug = require('debug')('weathermap');

const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '39567f136ef809df8b56b5cb4ca2930b';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (lat = '', long = '') => {
  let endpoint = '';
  if ((lat === '' && long === '') || (long === '') || (lat === '')) {
    endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  } else {
    endpoint = `${mapURI}/weather?lat=${lat}&lon=${long}&appid=${appId}&`;
  }
  const response = await fetch(endpoint);
  return response ? response.json() : {};
};
const fetchForecast = async (lat = '', long = '') => {
  let requestEndpoint = '';

  if ((lat === '' && long === '') || (long === '') || (lat === '')) {
    requestEndpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}`;
  } else {
    requestEndpoint = `${mapURI}/forecast?lat=${lat}&lon=${long}&appid=${appId}`;
  }

  const response = await fetch(requestEndpoint);
  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const lat = ctx.query.lat ? parseFloat(ctx.query.lat).toFixed(2) : '';
  const long = ctx.query.long ? parseFloat(ctx.query.long).toFixed(2) : '';

  const weatherData = await fetchWeather(lat, long);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
});
router.get('/api/forecast', async ctx => {
  const lat = ctx.query.lat ? parseFloat(ctx.query.lat).toFixed(2) : '';
  const long = ctx.query.long ? parseFloat(ctx.query.long).toFixed(2) : '';

  const forecastData = await fetchForecast(lat, long);

  ctx.type = 'application/json; charset=utf-8';

  const forecastDataList = forecastData.list;

  // eslint-disable-next-line standard/array-bracket-even-spacing
  let forecastWeatherData = forecastDataList.map(val => [val.weather[0], val.dt_txt, ]);

  let forecastDataResponse = forecastWeatherData.slice(0, 8);

  ctx.body = forecastDataResponse;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);

const testApp = app.listen(5000);

module.exports = { testApp, fetchWeather, fetchForecast, };
