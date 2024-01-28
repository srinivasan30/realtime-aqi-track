import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [userActivities, setUserActivities] = useState({
    car: false,
    ac: false,
    bike: false,
    electricity: 0,
    meat: 0,
  });

  const [reductionEfforts, setReductionEfforts] = useState({
    trees: 0,
    earthHour: 0,
    ledLights: false,
  });

  const [carbonFootprint, setCarbonFootprint] = useState({
    total: 0,
    offset: 0,
  });

  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);

  const API_KEY = 'ccb5ec682a14a1af5168635a3ebeacdc73f2bbb3';
  const city = 'Chennai';

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    const fetchAqiData = async () => {
      try {
        const response = await axios.get(
          `https://api.waqi.info/feed/${city}/?token=${API_KEY}`
        );
        setAqiData(response.data.data);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
      }
    };

    fetchWeatherData();
    fetchAqiData();
  }, [city]);

  const handleActivityChange = (activity) => {
    setUserActivities((prevActivities) => ({
      ...prevActivities,
      [activity]: !prevActivities[activity],
    }));
  };

  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setUserActivities((prevActivities) => ({
      ...prevActivities,
      [key]: value,
    }));
  };

  const calculateCarbonFootprint = () => {
    const carbonEmitted =
      (userActivities.car ? 2 : 0) +
      (userActivities.ac ? 5.8 : 0) +
      (userActivities.bike ? 0.33 : 0) +
      userActivities.electricity * 15 +
      userActivities.meat * 15;

    setCarbonFootprint((prevFootprint) => ({
      ...prevFootprint,
      total: carbonEmitted,
      offset: carbonEmitted * 0.5,
    }));
  };

  const applyReductionEfforts = () => {
    const reduction =
      reductionEfforts.trees * 0.058 +
      reductionEfforts.earthHour * 1.6 +
      (reductionEfforts.ledLights ? 0.5 : 0);

    setCarbonFootprint((prevFootprint) => ({
      ...prevFootprint,
      offset: Math.max(0, prevFootprint.offset - reduction),
    }));
  };

  return (
    <div className="App">
      <header>
        <h1>Real Time AQI ML Driven with API End Points and Carbon Footprint Tracker</h1>
      </header>

      <section className="user-info">
        <h2>
          Welcome, <span id="username">User</span>!
        </h2>
        <p>
          Current Carbon Footprint:{' '}
          <span id="carbon">{carbonFootprint.total.toFixed(2)}</span> kgCO2
        </p>
        <p>
          Offset Contributions:{' '}
          <span id="offset">{carbonFootprint.offset.toFixed(2)}</span> kgCO2
        </p>
      </section>
	  
	  <section className="weather-aqi">
        <h2>Weather and AQI Data</h2>
        {weatherData && (
          <div>
            <h3>Weather in {city}</h3>
            <p>Temperature: {weatherData.main.temp} °C</p>
            <p>Humidity: {weatherData.main.humidity} %</p>
            <p>Weather: {weatherData.weather[0].description}</p>
          </div>
        )}

        {aqiData && (
  <div>
    <h3>Air Quality Index (AQI) in {city}</h3>
    {Object.entries(aqiData.iaqi).map(([pollutant, value]) => (
      <p key={pollutant}>
        {pollutant}: {value?.v}
      </p>
    ))}
  </div>
)}




      </section>

      <section className="daily-activities">
        <h2>Monitor Daily Activities</h2>
        <form>
          <label>
            <input
              type="checkbox"
              checked={userActivities.car}
              onChange={() => handleActivityChange('car')}
            />
            Do you drive a car?
          </label>

          <label>
            <input
              type="checkbox"
              checked={userActivities.ac}
              onChange={() => handleActivityChange('ac')}
            />
            Do you use air conditioner?
          </label>

          <label>
            <input
              type="checkbox"
              checked={userActivities.bike}
              onChange={() => handleActivityChange('bike')}
            />
            Do you ride bikes?
          </label>

          <label>
            Electricity consumption per day (kWh):
            <input
              type="number"
              value={userActivities.electricity}
              onChange={(e) => handleInputChange(e, 'electricity')}
            />
          </label>

          <label>
            Consumptions of meat per day (kg):
            <input
              type="number"
              value={userActivities.meat}
              onChange={(e) => handleInputChange(e, 'meat')}
            />
          </label>

          <button type="button" onClick={calculateCarbonFootprint}>
            Calculate Carbon Footprint
          </button>
        </form>
      </section>

      <section className="reduce-footprint">
        <h2>Reduce Carbon Footprint: Efforts</h2>
        <form>
          <label>
            Do you grow plants & trees? If yes, how many?
            <input
              type="number"
              value={reductionEfforts.trees}
              onChange={(e) =>
                setReductionEfforts((prevEfforts) => ({
                  ...prevEfforts,
                  trees: parseInt(e.target.value) || 0,
                }))
              }
            />
          </label>

          <label>
            Do you participate in Earth Hour? If yes, how many hours?
            <input
              type="number"
              value={reductionEfforts.earthHour}
              onChange={(e) =>
                setReductionEfforts((prevEfforts) => ({
                  ...prevEfforts,
                  earthHour: parseInt(e.target.value) || 0,
                }))
              }
            />
          </label>

          <label>
            Do you use LED lights?
            <input
              type="checkbox"
              checked={reductionEfforts.ledLights}
              onChange={() =>
                setReductionEfforts((prevEfforts) => ({
                  ...prevEfforts,
                  ledLights: !prevEfforts.ledLights,
                }))
              }
            />
          </label>

          <button type="button" onClick={applyReductionEfforts}>
            Apply Reduction Efforts
          </button>
        </form>
      </section>

      
    </div>
  );
}

export default App;
