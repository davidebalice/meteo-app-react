import React, { useState, useEffect } from "react";
import Logo from "../asset/logoReact.png";
import OpenMeteo from "../asset/open-meteo.png";
import Result from "./Result";
import Input from "./Input";
import Select from "./Select";

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);

  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

const App = () => {
  const [data, setData] = useState({
    location: "",
    isLoading: false,
    search: false,
    displayLocation: "",
    error: "",
    weather: {},
  });

  const fetchWeather = async () => {
    if (data.location.length < 2) {
      setData((prevState) => ({
        ...prevState,
        weather: {},
      }));
    }

    try {
      setData((prevState) => ({
        ...prevState,
        isLoading: true,
      }));

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${data.location}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);

      if ((!geoData.results) && (data.location!=="")){
        setData((prevState) => ({
          ...prevState,
          error: "Location not found",
        }));
      }

      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);

      setData((prevState) => ({
        ...prevState,
        displayLocation: `${name} ${convertToFlag(country_code)}`,
      }));

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
      setData((prevState) => ({
        ...prevState,
        weather: weatherData.daily,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setData((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  const setLocation = (e) => {
    setData((prevState) => ({
      ...prevState,
      location: e.target.value,
    }));
  };

  const setSearch = (e) => {
    if (data.location) {
      setData((prevState) => ({
        ...prevState,
        search: !data.search,
        error: "",
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        error: "Insert location",
      }));
    }
  };

  const selectLocation = (e) => {
    setData((prevState) => ({
      ...prevState,
      location: e.target.value,
      search: !data.search,
      error: "",
    }));
  };

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      location: localStorage.getItem("location") || "",
    }));
  }, []);

  useEffect(() => {
    fetchWeather();
    setData((prevState) => ({
      ...prevState,
      daily: data.daily,
    }));
    localStorage.setItem("location", data.location);
  }, [data.daily, data.search]);

  return (
    <div className="dataContainer">
      <p className="logoContainer">
        <img src={Logo} className="logo" alt="react logo" />
        <img src={OpenMeteo} className="logo" alt="open meteo logo" />
      </p>
      <p>
        <h4>Meteo app developed in React</h4>
        <h4>
          This app use{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            className="link"
            rel="noreferrer"
          >
            open-meteo.com
          </a>{" "}
          api
        </h4>
      </p>
      {data.error && <h4 className="error">{data.error}</h4>}
      <h4>Insert location or select a favorite</h4>
      <p className="inputContainer">
      <Input
          location={data.location}
          onChangeLocation={setLocation}
          onSearch={setSearch}
        />
        <Select
          location={data.location}
          onChangeLocation={selectLocation}
        />
      </p>
      {data.isLoading && <p className="loader">Loading...</p>}

      {data.weather.weathercode && (
        <Result weather={data.weather} location={data.displayLocation} />
      )}
    </div>
  );
};

export default App;
