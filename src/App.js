import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import numeral from 'numeral'
import InfoBox from "./InfoBox";
import Table from "./Table";
import LineGraph from "./LineGraph";
import Map from "./Map";
import { sortData, prettyPrintStat } from "./utils";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [country, setInputCountry] = useState("worldwide");
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCountries, setMapCountries] = useState([]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCenter, setMapCenter] = useState([ 26.8206, 30.8025 ]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data)
          setCountries(countries);
          setTableData(sortedData);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const countryChangeHandler = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapZoom(4);
        setMapCenter([data.countryInfo?.lat, data.countryInfo?.long]);
      })
  };

  return (
    <div className='app'>
      <div className='app-left'>
        <div className='header'>
          <h1>COVID-19 Tracker</h1>
          <FormControl className='dropdown'>
            <Select
              variant='outlined'
              value={country}
              onChange={countryChangeHandler}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country, index) => (
                <MenuItem key={index} value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='app-stats'>
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            title='Coronavirus cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
            isRed
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
            isRed
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className='app-right'>
        <CardContent>
          <div className='app-info'>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3> Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
