import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'moment';

Moment.locale('fi');

const baseURL = process.env.ENDPOINT;

const getCoordinates = async () => {
  const coordinates = [];

  async function getLocationCoordinatesPromise() {
    // eslint-disable-next-line no-undef
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    // eslint-disable-next-line no-else-return
    } else {
      return 0;
    }
  }

  const coordinatesPromise = getLocationCoordinatesPromise();

  if (coordinatesPromise instanceof Promise) {
    const position = await coordinatesPromise;

    if (!position.coords) {
      return coordinates;
    }
    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    coordinates.push(lat);
    coordinates.push(long);

    return coordinates;
  }
  return coordinates;
};

const getWeatherFromApi = async () => {
  const coordinates = await getCoordinates();

  try {
    let response;
    if (coordinates.length === 0) {
      response = await fetch(`${baseURL}/weather`);
      return response.json();
    }
    response = await fetch(`${baseURL}/weather?lat=${coordinates[0]}&long=${coordinates[1]}`);
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
};

const getForecastFromApi = async () => {
  const coordinates = await getCoordinates();

  try {
    let response;
    if (coordinates.length === 0) {
      response = await fetch(`${baseURL}/forecast`);
      return response.json();
    }
    response = await fetch(`${baseURL}/forecast?lat=${coordinates[0]}&long=${coordinates[1]}`);
    return response.json();
  } catch (error) {
    console.log(error);
  }
  return {};
};

class Forecast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      iconArray: [],
    };
  }

  async componentWillMount() {
    const forecast = await getForecastFromApi();


    if (forecast.length === 0) {
      this.setState({ iconArray: [] });
    } else {
      const iconsList = forecast.map(val => [val[0].icon, val[1], val[0].description]);

      this.setState({ iconArray: iconsList.map(val => [val[0].slice(0, -1), val[1], val[2]]) });
    }
  }

  render() {
    const iconList = this.state.iconArray;

    const listItemElements = [];

    if (iconList.length === 0) {
      const errorItem = <li key="Error" className="error">Error, the list is empty</li>;
      listItemElements.push(errorItem);
    } else {
      iconList.forEach((icon, index) => {
        // eslint-disable-next-line react/no-array-index-key
        const listItem = <li className="forecastLi" key={`ID:${index}/${icon[0]}`}><img src={`/img/${icon[0]}.svg`} alt={icon[2]} /><h3>{Moment(icon[1]).format('HH:mm, DD.MM')}</h3></li>;
        listItemElements.push(listItem);
      });
    }
    return (
      <div className="ForecastDiv">
        <h2>Weather Forecast</h2>
        <ul className="forecastList">
          {listItemElements}
        </ul>
      </div>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
    };
  }

  async componentWillMount() {
    const weather = await getWeatherFromApi();
    this.setState({ icon: weather.icon.slice(0, -1) });
  }
  handleKeyChange
  render() {
    const { icon } = this.state;

    return (
      <div className="weather">
        <h2>Current Weather</h2>
        { icon && <img src={`/img/${icon}.svg`} alt="Current Weather" /> }
      </div>
    );
  }
}
// eslint-disable-next-line react/no-multi-comp
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <div className="Main">
        <Weather />
        <Forecast />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
