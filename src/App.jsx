
import { useState } from 'react'
import './App.css'

function getWeatherDescription(code){
  if (code === 0) return`Sunny ☀️`
  if (code === 1) return `Mainly clear🌤️`
  if (code === 2) return `Partly cloudy🌥️`
  if (code === 3) return `Cloudy🌨️`
  if (code >=51 && code <=67) return `Rainy🌧️`
  if (code >=71 && code <=77) return `Snowy❄️`
  if (code >=80 && code <=82) return `Rain showers🌦️`
  if (code >=95) return `Thunderstorm⛈️`
  return `weather conditions unavailable`
  }


function App(){
  const currentDate = new Date()
  const [city, setCity]= useState("")
  const [weather, setWeather]= useState(null)
  const [loading, setLoading]= useState(false)
  const [error,setError]= useState("")

  const searchWeather = async() => {
    if (!city.trim()){
      setError('Please enter a city')
      return
    }
    setLoading(true)
    setError('')
    setWeather(null)

    try{
      const locationResponse = await fetch(
       `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
           
      )

      const locationData = await locationResponse.json()
      
      if (!locationData.results?.length){
        setError('City not found')
        return
      }

      const {latitude, longitude, name} = locationData.results[0]

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,rain,weather_code,precipitation&timezone=auto`
      )
      const weatherData = await weatherResponse.json()

      setWeather({
        city:name,
        ...weatherData.current,
     }) 
  
  
    }catch (err) {
      setError(err.message)
    }finally { 
      setLoading(false)
    }
  }


  return(
    <div className="weather-app">
      <h1>Weather App</h1>
      <p>Discover the weather around you</p>
      <p>
        {currentDate.toLocaleDateString('en-KE',{
          weekday:`long`,
          day:`numeric`,
          month:`long`,
          year:`numeric`
        })}</p>
    
    
    <div className='search-section'>
        <input type="text" placeholder='Enter city name...'
          value={city}
          onChange={(e) => setCity(e.target.value)} 
          onKeyDown={(e) =>e.key === 'Enter' && searchWeather()}
          />
        <button onClick={searchWeather}>Search</button>
        <button onClick={searchWeather}>Refresh Weather🔄️</button>
      </div>
      
    
        {loading && <p>Loading weather...</p>}
        {error && <p>{error}</p>}

        {weather && (
          <div className='weather-card'>
            <h2>{weather.city}</h2>
            <h1>{weather.temperature_2m}°C</h1>
            <p>Feels like:{weather.apparent_temperature}°C</p>
            <p>Humidity: {weather.relative_humidity_2m}%</p>
            <p>wind speed:{weather.wind_speed_10m}km/h</p>

            <h2>{weather.city}</h2>
            <h1>{weather.temperature_2m}°C</h1>
            <p>{getWeatherDescription(weather.weather_code)}</p>
            <p>🌡️ Temperature:{weather.temperature_2m}°C</p>
            <p>💧 Humidity:{weather.relative_humidity_2m}%</p>
            <p>💨 Wind:{weather.wind_speed_10m}km/h</p>
          </div>
        )}
        </div>
      )
       }

export default App
