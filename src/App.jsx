import { SearchSection } from "./components/searchSection";
import { CurrentWeather } from "./components/currentWeather";
import { HourlyWeatherItem } from "./components/HourlyWeatherItem";
import { useState, useRef } from "react";
import { weatherCodes } from "./constants";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const searchInputRef = useRef(null);

  const filterHourlyData = (data) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24hr = currentHour + 24 * 60 * 60 * 1000;

    const next24hrData = data.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24hr;
    });

    setHourlyForecasts(next24hrData); 
    console.log(next24hrData);
  };

  const getWeatheDeatils = async (API_URL) => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log(data);
      const temperature = data.current?.temp_c || "N/A";
      const description = data.current?.condition?.text || "No description available";
      const weatherIcon = Object.keys(weatherCodes).find((icon) =>
        weatherCodes[icon].includes(data.current.condition.code)
      );
      setCurrentWeather({ temperature, description, weatherIcon });
      const combinedHourlyData = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour,
      ];
      filterHourlyData(combinedHourlyData);
      searchInputRef.current.value = data.location.name;

      console.log(combinedHourlyData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setCurrentWeather({
        temperature: "N/A",
        description: "No data available",
        weatherIcon: "no-result",
      });
      setHourlyForecasts([]); // Clear hourly forecasts on error
    }
  };

  return (
    <div className="container">
      {/*search section*/}
      <SearchSection getWeatheDeatils={getWeatheDeatils} searchInputRef={searchInputRef} />
      {/*weather section*/}
      <div className="weather-section">
        <CurrentWeather currentWeather={currentWeather} />
        {/*hourly forecast*/}
        <div className="hourly-forecast">
          <ul className="weather-list">
            {hourlyForecasts.map((hourlyWeather) => (
              <HourlyWeatherItem key={hourlyWeather.time_epoch} hourlyWeather={hourlyWeather} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;


