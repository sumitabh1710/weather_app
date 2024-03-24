// src/components/Weather.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import sunCloudRain from "../Assets/Sun_cloud_rain.svg";
import sunCloud from "../Assets/Sun_cloud.svg";

const Weather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currWeatherData, setCurrWeatherData] = useState({});
  const [city, setCity] = useState("");
  const dayArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currDate = new Date(Date.now());

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.tomorrow.io/v4/weather/forecast?location=${latitude},${longitude}&apikey=C8VQw94R3nMZsTdDUx8PxOrCtblHn62Y`
        );
        setWeatherData(response.data.timelines.daily);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (latitude != 0 && longitude != 0) {
      fetchWeatherData();
    }
  }, [city, latitude, longitude]);

  useEffect(() => {
    if (weatherData) {
      console.log(weatherData);
      const todayWeatherData = weatherData.filter((each) => {
        const eachDate = new Date(each.time);
        if (
          currDate.toISOString().slice(0, 10) ==
          eachDate.toISOString().slice(0, 10)
        ) {
          return true;
        } else {
          return false;
        }
      });
      setCurrWeatherData(todayWeatherData[0]?.values);
    }
  }, [weatherData]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          setError(
            "Geolocation error occurred. Please enter your location manually."
          );
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setError(
        "Geolocation is not supported by your browser. Please enter your location manually."
      );
      console.error("Geolocation is not supported.");
    }
  };

  handleGeolocation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "40px",
      }}
    >
      <div>
        <h2
          style={{
            marginTop: "20px",
            marginBottom: "0px",
            color: "#001026",
            fontFamily: "cursive",
            fontSize: "24px",
          }}
        >
          Weather App
        </h2>
      </div>
      <img src={sunCloudRain}></img>
      <div
        style={{
          backgroundColor: "#4899E3",
          width: "90%",
          height: "300px",
          borderRadius: "40px",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h2
          style={{
            color: "white",
            fontFamily: "monospace",
            fontSize: "50px",
            marginBottom: "10px",
          }}
        >
          {currWeatherData?.temperatureAvg}°
        </h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <p
            style={{
              color: "white",
              fontFamily: "monospace",
              fontSize: "20px",
              marginTop: "0px",
            }}
          >
            Max: {currWeatherData?.temperatureMax}°
          </p>
          <p
            style={{
              color: "white",
              fontFamily: "monospace",
              fontSize: "20px",
              marginTop: "0px",
              marginLeft: "20px",
            }}
          >
            Min: {currWeatherData?.temperatureMin}°
          </p>
        </div>
        <p
          style={{
            color: "white",
            fontFamily: "monospace",
            fontSize: "20px",
            marginTop: "0px",
          }}
        >
          Humidity: {currWeatherData?.humidityAvg}
        </p>
      </div>
      <div
        style={{
          backgroundColor: "#4899E3",
          width: "80%",
          minHeight: "200px",
          borderRadius: "40px",
          padding: "20px",
        }}
      >
        {weatherData.map((each) => {
          const date = new Date(each.time);

          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <p
                style={{
                  color: "white",
                  fontFamily: "monospace",
                  fontSize: "20px",
                  marginTop: "0px",
                }}
              >
                {dayArray[date.getDay()]}
              </p>
              <p
                style={{
                  color: "white",
                  fontFamily: "monospace",
                  fontSize: "20px",
                  marginTop: "0px",
                }}
              >
                {each?.values?.temperatureAvg}°
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Weather;
