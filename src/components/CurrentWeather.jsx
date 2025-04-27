import React from 'react'

export const CurrentWeather = ({currentWeather}) => {
  return (
    <div className="current-weather">
          <img src={`icons/${currentWeather?.weatherIcon||"no-result"}.svg`} className="weather-icon" />
          <h2 className="temperature">{currentWeather.temperature}<span>ºC</span></h2>
          <p className="description">{currentWeather.description}</p>
        </div>
  )
}
