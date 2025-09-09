import React, { useEffect, useState } from "react";
import ParticlesBackground from "./components/Particles";
import Buttons from "./test.js";
import axios from "axios";
import moment from "moment/moment.js";
import "moment/min/locales";
// Material UI
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import WbCloudyIcon from "@mui/icons-material/WbCloudy";
import Button from "@mui/material/Button";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
//react-i18next
import { useTranslation } from "react-i18next";

moment.locale("ar");

// Theme
const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancelAxios = null;

// المحافظات + الإحداثيات
const cities = {
  cairo: { lat: 30.0444, lon: 31.2357, label: "cairo" },
  giza: { lat: 30.0131, lon: 31.2089, label: "Giza" },
  alex: { lat: 31.2001, lon: 29.9187, label: "Alexandria" },
  aswan: { lat: 24.0889, lon: 32.8998, label: "Aswan" },
};

function App() {
  const [dateAndTime, setDateAndTime] = useState("");
  const { t, i18n } = useTranslation();
  const [locales, setLocales] = useState("ar");
  const [selectedCity, setSelectedCity] = useState("cairo");  

  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: "",
  });

  // تبديل اللغة
  function handleLanguageClick() {
    if (locales === "en") {
      setLocales("ar");
      i18n.changeLanguage("ar");
      moment.locale("ar");
    } else {
      setLocales("en");
      i18n.changeLanguage("en");
      moment.locale("en");
    }
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
  }

  useEffect(() => {
    i18n.changeLanguage(locales);
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));

    const { lat, lon } = cities[selectedCity];

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=b25ec9f881170c6e6ed15aadd98a1b02`,
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        const responseTemp = Math.round(response.data.main.temp - 272.15);

        const min = response.data.main.temp_min;
        const max = response.data.main.temp_max;
        const description = response.data.weather[0].description;
        let responseIcon = response.data.weather[0].icon;

        setTemp({
          number: responseTemp,
          min: min,
          max: max,
          description: description,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    return () => {
      if (cancelAxios) cancelAxios();
    };
  }, [selectedCity, locales]);

  return (
    <div>
      <ParticlesBackground />
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* CONTENT CARD */}
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
           

            {/* Card */}
            <div
              dir={locales === "en" ? "ltr" : "rtl"}
              style={{
                width: "100%",
                background: "rgba(28, 52, 91, 0.36)",
                color: "white",
                borderRadius: "15px",
                padding: "10px",
                boxShadow: "0px 9px 1px rgba(0,0,0,0.5)",
              }}
            >
              {/* Content */}
               {/*   Dropdown */}
            <FormControl fullWidth style={{ marginBottom: "15px" }}
                  dir={locales === "en" ? "ltr" : "rtl"}

            
            >
 <InputLabel
  shrink
  htmlFor="city-select"
  sx={{
    color: "white",
    fontSize: "30px",
    width: "100%",
    transform: "none",    
    position: "static",     
    marginBottom: "2px",
    display: "block",
    textAlign: locales === "en" ? "left" : "right",
  }}
>
  {t("choose country")}
</InputLabel>

<Select
  id="city-select"
  value={selectedCity}
  onChange={(e) => setSelectedCity(e.target.value)}
  style={{ color: "white" }}
  sx={{
    color: "white",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    ".MuiSvgIcon-root": {
      color: "white",
      right: locales === "ar" ? "auto" : 0, // يزبط السهم
      left: locales === "ar" ? 0 : "auto",
    },
  }}
>
  {Object.keys(cities).map((cityKey) => (
    <MenuItem
      key={cityKey}
      value={cityKey}
      sx={{
        backgroundColor: "#1c345b",
        color: "white",
        "&:hover": { backgroundColor: "#2b4a77" },
        "&.Mui-selected": {
          backgroundColor: "#1c345b !important",
          color: "white",
        },
        "&.Mui-selected:hover": {
          backgroundColor: "#2b4a77 !important",
        },
      }}
    >
      {t(cities[cityKey].label)}
    </MenuItem>
  ))}
</Select>

            </FormControl>
              <div>
                {/* City & Time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "space-between",
                  }}
                  dir={locales === "en" ? "ltr" : "rtl"}
                >
                  <Typography variant="h3" style={{ marginRight: "20px" }}>
                    {t(cities[selectedCity].label)}
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: "15px" }}>
                    {dateAndTime}
                  </Typography>
                </div>

                <hr />

                {/* Degree & Description */}
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    {/* Temperature */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="h1"
                        style={{ textAlign: "right" }}
                      >
                        {temp.number}
                      </Typography>
                      <img src={temp.icon} alt="weather icon" />
                    </div>

                    {/* Weather Description */}
                    <Typography variant="h6" style={{ textAlign: "right" }}>
                      {t(temp.description)}
                    </Typography>

                    {/* Min & Max */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h5>
                        {t("Min")}: {Math.round(temp.min - 272.15)}
                      </h5>
                      <h5 style={{ margin: "0px 10px" }}>|</h5>
                      <h5>
                        {t("Max")}: {Math.round(temp.max - 272.15)}
                      </h5>
                    </div>
                  </div>

                  {/* Weather Icon */}
                  <WbCloudyIcon style={{ fontSize: "200px" }} />
                </div>
              </div>
            </div>
            {/* == Card End == */}

            {/* Translation Button */}
            <div
              style={{
                marginTop: "5px",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Button
                variant="text"
                style={{ color: "white" }}
                onClick={handleLanguageClick}
              >
                {locales === "en" ? "Arabic" : "انجليزي"}
              </Button>
            </div>
          </div>
          {/* == CONTENT CARD END == */}
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
