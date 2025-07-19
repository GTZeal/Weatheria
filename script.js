//script can only run after the DOM is fully loaded - preventing errors
window.addEventListener("DOMContentLoaded", () => {
  //Variable storing current city of API request.
  let selectedCity = localStorage.getItem("lastCity") || "Atlanta";

  function isCelsius() {
    return localStorage.getItem("useFahrenheit") !== "true";
  }

  function isKilometers() {
    return localStorage.getItem("useMiles") !== "true";
  }

  function formatTemp(valueC, valueF) {
    return isCelsius() ? `${Math.round(valueC)}°C` : `${Math.round(valueF)}°F`;
  }

  function formatWind(kph, mph) {
    return isKilometers() ? `${Math.round(kph)} kph` : `${Math.round(mph)} mph`;
  }

  function formatVisibility(km, mi) {
    return isKilometers() ? `${km} km` : `${mi} mi`;
  }

  function formatDailyTemp(day) {
    const max = isCelsius() ? day.maxtemp_c : day.maxtemp_f;
    const min = isCelsius() ? day.mintemp_c : day.mintemp_f;
    return `${Math.round(max)}/${Math.round(min)}`;
  }

  //custom icons mapping to override the default weather icons
  const weatherIconMap = {
    1000: { day: "wi-day-sunny", night: "wi-night-clear" },
    1003: { day: "wi-day-cloudy", night: "wi-night-alt-cloudy" },
    1006: { day: "wi-cloud", night: "wi-cloud" },
    1009: { day: "wi-cloudy", night: "wi-cloudy" },
    1030: { day: "wi-day-fog", night: "wi-night-fog" },
    1063: { day: "wi-day-showers", night: "wi-night-alt-showers" },
    1066: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1069: { day: "wi-day-sleet", night: "wi-night-alt-sleet" },
    1072: { day: "wi-day-rain-mix", night: "wi-night-alt-rain-mix" },
    1087: { day: "wi-day-thunderstorm", night: "wi-night-alt-thunderstorm" },
    1114: { day: "wi-snow-wind", night: "wi-snow-wind" },
    1117: { day: "wi-snow-wind", night: "wi-snow-wind" },
    1135: { day: "wi-day-fog", night: "wi-night-fog" },
    1147: { day: "wi-day-fog", night: "wi-night-fog" },
    1150: { day: "wi-day-sprinkle", night: "wi-night-alt-sprinkle" },
    1153: { day: "wi-day-sprinkle", night: "wi-night-alt-sprinkle" },
    1168: { day: "wi-day-rain-mix", night: "wi-night-alt-rain-mix" },
    1171: { day: "wi-day-rain-mix", night: "wi-night-alt-rain-mix" },
    1180: { day: "wi-day-showers", night: "wi-night-alt-showers" },
    1183: { day: "wi-day-showers", night: "wi-night-alt-showers" },
    1186: { day: "wi-day-rain", night: "wi-night-alt-rain" },
    1189: { day: "wi-day-rain", night: "wi-night-alt-rain" },
    1192: { day: "wi-day-rain", night: "wi-night-alt-rain" },
    1195: { day: "wi-day-rain", night: "wi-night-alt-rain" },
    1198: { day: "wi-day-rain-mix", night: "wi-night-alt-rain-mix" },
    1201: { day: "wi-day-rain-mix", night: "wi-night-alt-rain-mix" },
    1204: { day: "wi-day-sleet", night: "wi-night-alt-sleet" },
    1207: { day: "wi-day-sleet", night: "wi-night-alt-sleet" },
    1210: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1213: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1216: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1219: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1222: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1225: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1237: { day: "wi-day-hail", night: "wi-night-alt-hail" },
    1240: { day: "wi-day-showers", night: "wi-night-alt-showers" },
    1243: { day: "wi-day-rain", night: "wi-night-alt-rain" },
    1246: { day: "wi-day-rain", night: "wi-night-alt-rain" },
    1249: { day: "wi-day-sleet", night: "wi-night-alt-sleet" },
    1252: { day: "wi-day-sleet", night: "wi-night-alt-sleet" },
    1255: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1258: { day: "wi-day-snow", night: "wi-night-alt-snow" },
    1261: { day: "wi-day-hail", night: "wi-night-alt-hail" },
    1264: { day: "wi-day-hail", night: "wi-night-alt-hail" },
    1273: { day: "wi-day-storm-showers", night: "wi-night-alt-storm-showers" },
    1276: { day: "wi-thunderstorm", night: "wi-thunderstorm" },
    1279: {
      day: "wi-day-snow-thunderstorm",
      night: "wi-night-alt-snow-thunderstorm",
    },
    1282: {
      day: "wi-day-snow-thunderstorm",
      night: "wi-night-alt-snow-thunderstorm",
    },
  };

  //icons for moonphases
  const moonPhaseIconMap = {
    "New Moon": "wi-moon-new",
    "Waxing Crescent": "wi-moon-waxing-crescent-3",
    "First Quarter": "wi-moon-first-quarter",
    "Waxing Gibbous": "wi-moon-waxing-gibbous-3",
    "Full Moon": "wi-moon-full",
    "Waning Gibbous": "wi-moon-waning-gibbous-3",
    "Last Quarter": "wi-moon-third-quarter",
    "Waning Crescent": "wi-moon-waning-crescent-3",
  };

  //UNIQUE APIKEY FOR IDENTIFICATION
  const myKey = ["8217f228c7654d2686c221756252806"];
  fetchWeatherData(selectedCity);
  // On load: apply saved settings to sliders
  window.addEventListener("DOMContentLoaded", () => {
    const useFahrenheit = localStorage.getItem("useFahrenheit") === "true";
    const useMiles = localStorage.getItem("useMiles") === "true";

    if (useFahrenheit)
      document.querySelector(".slider1")?.classList.add("active");
    if (useMiles) document.querySelector(".slider2")?.classList.add("active");

    fetchWeatherData(selectedCity); // fetch once settings applied
  });

  //city search function
  function citySearch() {
    let popup = document.getElementById("cityPopup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "cityPopup";
      popup.innerHTML = `<div class="popup-content">
    <button id="closePopup" class="close-btn">&times;</button>
    <h2>Search for a City</h2>
    <div class="input-group">
      <input type="text" id="cityInput" placeholder="Enter city name or zipcode..." />
      <button id="searchBtn">Search</button>
    </div>
    </div>`;
      document.body.appendChild(popup);

      //search button
      popup.querySelector("#searchBtn").addEventListener("click", function () {
        selectedCity = popup.querySelector("#cityInput").value;
        localStorage.setItem("lastCity", selectedCity);
        fetchWeatherData(selectedCity);
      });
      //close popup
      popup.querySelector("#closePopup").addEventListener("click", function () {
        popup.style.display = "none";
      });
      // Close on outside click
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          popup.style.display = "none";
        }
      });
    }
    popup.style.display = "flex";
  }

  document
    .getElementById("citySearch")
    .addEventListener("click", function (event) {
      event.preventDefault();
      citySearch();
    });

  //incomplete map function
  function mapSearch() {
    let popup = document.getElementById("mapOverlay");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "mapOverlay";
      popup.className = "popup-overlay";
      popup.innerHTML = `
      <div class="map-content">
        <button class="close-btn" id="mapCloseBtn">&times;</button>
        <h2>Coming Soon...</h2>
      </div>
    `;
      document.body.appendChild(popup);
      // Close on X
      document.getElementById("mapCloseBtn").addEventListener("click", () => {
        popup.style.display = "none";
      });
      // Close on outside click
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          popup.style.display = "none";
        }
      });
    }
    popup.style.display = "flex";
  }

  document
    .getElementById("mapSearch")
    .addEventListener("click", function (event) {
      event.preventDefault();
      mapSearch();
    });

  //settings panel
  function settingsPopup() {
    let popup = document.getElementById("settingsPopup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "settingsPopup";
      popup.innerHTML = `
      <div class="settings-panel">
        <button class="close-btn" onclick="document.getElementById('settingsPopup').style.display='none'">&times;</button>
        <div class="settings-grid">

          <div class="settings-row">
            <label for="setting1">°C / °F :</label>
            <div class="slider1">
              <div class="circle"></div>
            </div>
          </div>

          <div class="settings-row">
            <label for="setting2">km / mi:</label>
            <div class="slider2">
              <div class="circle"></div>
            </div>
          </div>
        </div>
      </div>
    `;
      document.body.appendChild(popup);
      // Toggle 1 slider
      popup.querySelector(".slider1").addEventListener("click", function () {
        this.classList.toggle("active");
        localStorage.setItem(
          "useFahrenheit",
          this.classList.contains("active")
        );
        fetchWeatherData(selectedCity); // refresh data
      });
      // Toggle 2 slider
      popup.querySelector(".slider2").addEventListener("click", function () {
        this.classList.toggle("active");
        localStorage.setItem("useMiles", this.classList.contains("active"));
        fetchWeatherData(selectedCity); // refresh data
      });
      const fahrenheitSaved = localStorage.getItem("useFahrenheit") === "true";
      const milesSaved = localStorage.getItem("useMiles") === "true";

      if (fahrenheitSaved)
        popup.querySelector(".slider1").classList.add("active");
      if (milesSaved) popup.querySelector(".slider2").classList.add("active");
      // Close on outside click
      popup.addEventListener("click", (e) => {
        if (e.target === popup) {
          popup.style.display = "none";
        }
      });
    }
    popup.style.display = "flex";
  }

  // Trigger button (bind this to your settings icon)
  document
    .getElementById("openSettings")
    .addEventListener("click", function (e) {
      e.preventDefault();
      settingsPopup();
    });

  function fetchWeatherData(selectedCity) {
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${myKey}&q=${selectedCity}&days=3&aqi=yes`;
    // promise to fetch weather data from the API
    fetch(apiUrl)
      // checking if the response is ok, if not throw an error
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      // processing the JSON data received from the API
      // current weather data ---------------------------------------------------------------------------------
      .then((data) => {
        const localTime = data.location.localtime; // e.g. "2025-07-02 02:14"
        const timeZone = data.location.tz_id;

        const localDate = new Date(localTime.replace(" ", "T"));

        // Correct day in local timezone
        let dayName = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          timeZone,
        }).format(localDate);

        const formattedDate = new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          timeZone,
        }).format(localDate);

        // Output day and date
        document.getElementById("day").textContent = dayName;
        document.getElementById("date").textContent = formattedDate;

        // Output location
        document.getElementById("location").textContent =
          data.location.name + ", " + data.location.country;

        if (data.location.country === "United States of America") {
          document.getElementById("location").textContent =
            data.location.name + ", " + data.location.region;
        }

        // Output weather info
        document.getElementById("condition").textContent =
          data.current.condition.text;

        document.getElementById("temp").textContent = formatTemp(
          data.current.temp_c,
          data.current.temp_f
        );

        // Weather icon logic
        const code = data.current.condition.code;
        const isDay = data.current.is_day === 1;
        let iconClass = weatherIconMap[code] || "wi-na";
        if (typeof iconClass === "object") {
          iconClass = isDay ? iconClass.day : iconClass.night;
        }

        //------------------------------------------------------------------------------------------------------
        //hourlyForecast implementation
        document.getElementById("weatherIcon").className = `wi ${iconClass}`;

        const hourlyList = document.getElementById("hourlyList");
        hourlyList.innerHTML = "";

        const hoursToShow = [3, 6, 9, 12, 15, 18];
        const now = new Date();
        const hourlyForecast = data.forecast.forecastday[0].hour;

        hoursToShow.forEach((offset) => {
          const targetHour = new Date(
            now.getTime() + offset * 60 * 60 * 1000
          ).getHours();

          const hourData = hourlyForecast.find(
            (hour) => new Date(hour.time).getHours() === targetHour
          );

          if (hourData) {
            const time = new Date(hourData.time).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            });
            const temp = isCelsius()
              ? Math.round(hourData.temp_c)
              : Math.round(hourData.temp_f);
            const unit = isCelsius() ? "°C" : "°F";
            const hourCode = hourData.condition.code;
            const isDay = hourData.is_day === 1;

            let iconClass = weatherIconMap[hourCode] || "wi-na";
            if (typeof iconClass === "object") {
              iconClass = isDay ? iconClass.day : iconClass.night;
            }

            const li = document.createElement("li");
            li.className = "hourBlock";
            li.innerHTML = `
            <span class="hour">${time}</span>
            <i class="wi ${iconClass}"></i>
            <span class="temp">${temp}${unit}</span>
            `;
            hourlyList.appendChild(li);
          }
        });
        //WEATHER CONDITIONS WIDGET
        // FEELS LIKE
        document.getElementById("feelsLike").textContent = formatTemp(
          data.current.feelslike_c,
          data.current.feelslike_f
        );
        // Air Quality - US EPA Index
        const epaIndex = data.current.air_quality["us-epa-index"];
        const epaMeaning =
          [
            "Good",
            "Moderate",
            "Unhealthy for Sensitive Groups",
            "Unhealthy",
            "Very Unhealthy",
            "Hazardous",
          ][epaIndex - 1] || "Unknown";
        document.getElementById("airQuality").textContent = epaMeaning;
        // WIND SPEEDS
        document.getElementById("windSpeed").textContent = formatWind(
          data.current.wind_kph,
          data.current.wind_mph
        );
        //HUMIDITY
        document.getElementById("humidity").textContent =
          data.current.humidity + "%";
        //CHANCE OF RAIN
        const chanceOfRain =
          data.forecast.forecastday[0].day.daily_chance_of_rain;
        document.getElementById("rainChance").textContent = chanceOfRain + "%";
        //VISIBILITY
        document.getElementById("visibility").textContent = formatVisibility(
          data.current.vis_km,
          data.current.vis_miles
        );
        //UV-INDEX
        document.getElementById("uvCaption").textContent = data.current.uv;

        //DAY ONE(TODAY)

        let dayNum = data.forecast.forecastday[0];
        let dayCond = dayNum.day.condition.code;

        // Use local date to label as "TODAY"
        let dayName1 = "TODAY";

        iconClass = weatherIconMap[dayCond] || "wi-na";

        document.getElementById("d1Temp").textContent = formatDailyTemp(
          data.forecast.forecastday[0].day
        );
        document.getElementById("d1Cond").className = `wi ${iconClass.day}`;
        document.getElementById("currDay1").textContent = dayName1;

        // DAY TWO
        dayNum = data.forecast.forecastday[1];
        maxTemp = dayNum.day.maxtemp_c;
        minTemp = dayNum.day.mintemp_c;
        dayCond = dayNum.day.condition.code;

        let tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        let dayName2 = tomorrowDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase();

        iconClass = weatherIconMap[dayCond] || "wi-na";

        document.getElementById("d2Temp").textContent = formatDailyTemp(
          data.forecast.forecastday[1].day
        );
        document.getElementById("d2Cond").className = `wi ${iconClass.day}`;
        document.getElementById("currDay2").textContent = dayName2;

        //DAY THREE
        dayNum = data.forecast.forecastday[2];
        maxTemp = dayNum.day.maxtemp_c;
        minTemp = dayNum.day.mintemp_c;
        dayCond = dayNum.day.condition.code;

        let dayAfterDate = new Date();
        dayAfterDate.setDate(dayAfterDate.getDate() + 2);
        let dayName3 = dayAfterDate
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase();

        iconClass = weatherIconMap[dayCond] || "wi-na";

        document.getElementById("d3Temp").textContent = formatDailyTemp(
          data.forecast.forecastday[2].day
        );
        document.getElementById("d3Cond").className = `wi ${iconClass.day}`;
        document.getElementById("currDay3").textContent = dayName3;

        const dateStr = localDate.toISOString().split("T")[0];

        fetch(
          `https://api.weatherapi.com/v1/astronomy.json?key=${myKey}&q=${selectedCity}&dt=${dateStr}`
        )
          .then((astroResponse) => {
            if (!astroResponse.ok)
              throw new Error("Failed to fetch astronomy data");
            return astroResponse.json();
          })
          .then((astroData) => {
            const astro = astroData.astronomy.astro;
            document.getElementById("srCaption").textContent = astro.sunrise;
            document.getElementById("ssCaption").textContent = astro.sunset;

            document.getElementById("mrCaption").textContent = astro.moonrise;
            document.getElementById("msCaption").textContent = astro.moonset;

            const moonPhase = data.forecast.forecastday[0].astro.moon_phase;
            document.getElementById("mpCaption").textContent = moonPhase;

            const moonIconClass = moonPhaseIconMap[moonPhase] || "wi-moon-new";
            document.getElementById(
              "moonIcon"
            ).className = `wi ${moonIconClass}`;
          })
          .catch((err) => console.error("Astronomy fetch failed: ", err));
      });
  }
});
