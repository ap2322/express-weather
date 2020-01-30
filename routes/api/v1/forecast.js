var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');
const FormatForecast = require('../../../lib/formatForecast')

router.get('/', (request, response) => {
  // -1. Make sure api key sent in request
  const user = request.body;

  for (let requiredParameter of ['api_key']) {
    if (!user[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { api_key: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  // 0. Check api_key in body to make sure it's in db
  database('users')
    .where('api_key', user['api_key'])
    .select()
    .first()
    .then(user => {
      // authorized request
      console.log("Authorized Request");
      // check that request has parameter before async function
      let loc = request.query.location
      console.log(loc)

      if(loc === undefined){
        return response
          .status(422)
          .send({error: "Missing query parameter location"})
      } else {
        return loc;
      }
    })
    .then(async (loc) => {
      // 2. Send parameters to geocode serivce to get lat and long
      fetchGoogle(loc)
        .then(data => {
          let latLong = data.results[0].geometry.location;
          let place = data.results[0].formatted_address;
          return { latLong, place: place };
        })
        .then(async (info) => {
          // 3. Send lat and long to darksky service to get forecast
          fetchDarkSky(info.latLong)
            .then(forecastData => {
              // 4. format forecast into expected json format
              let forecast = new FormatForecast({data: forecastData, place: info.place})
              // 5. return the response.json(forecast)
              let forecastResponse = {
                location: forecast.locationInfo,
                currently: forecast.makeCurrently(),
                hourly: forecast.makeHourly(8),
                daily: forecast.makeDaily(7)
              }
              response.send(forecastResponse)
            })
        })
    })
    .catch(error => {
      response.status(500).json({error})
    })

});

async function fetchGoogle(loc) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${process.env.GEOCODING_API}`
  let res = await fetch(url);
  let googleInfo = await res.json();
  return googleInfo;
}

async function fetchDarkSky(data) {
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${data.lat},${data.lng}?units=us`
  let res = await fetch(url);
  let darkSkyInfo = await res.json();
  return darkSkyInfo;
}

module.exports = router;
