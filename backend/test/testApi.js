const Koa = require('koa');
const router = require('koa-router')();
const cors = require('kcors');

const responses = require('./apiResponse.json');

const port = process.env.PORT || 7000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (lat = '', long = '') => {
  if ((lat === '' && long === '') || (long === '') || (lat === '')) {
    return responses.WeatherResponse;
  } else {
    return responses.WeatherCoordResponse;
  }
};

const fetchForecast = async (lat = '', long = '') => {
  if ((lat === '' && long === '') || (long === '') || (lat === '')) {
    return responses.ForecastResponse;
  } else {
    return responses.ForecastCoordResponse;
  }
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

  let weatherDataResponse = forecastWeatherData.slice(0, 8);

  ctx.body = weatherDataResponse;
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(port);

module.exports = server;
