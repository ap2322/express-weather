var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');
const FormatForecast = require('../../../lib/formatForecast')

router.get('/', (request, response) => {
  // get/1. check request body comes with api_key
  const info = request.body;

  for (let requiredParameter of ['api_key']) {
    if (!info[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { api_key: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  // get/2. check api_key in users and return user
  database('users')
    .where('api_key', info['api_key'])
    .first()
    .then(user => {
      if(user) {
        return user
      } else {
        return response
          .status(401)
          .json({"message": "Unauthorized request"})
      }
    })
    .then(user => {
      // get/3. get user's favorites from db
      database('favorites')
        .select('location', 'latitude', 'longitude')
        .where('user_id', user.id)
        .distinct()
        .then(favorites =>{
          if(favorites.length > 0){
            return favorites
          } else {
            return response
              .status(404)
              .json({"error":"No favorite locations"})
          }
        })
        // get/4. Promise.all(favorites get forecast for each)
        .then(favorites => {
          console.log(favorites)
          let favForecasts = Promise.all(
            favorites.map(async (fav) => {
              let latLong = `${fav.latitude},${fav.longitude}`
              console.log(latLong)
              let forecastData = await fetchDarkSky(latLong)
              let forecast = new FormatForecast({data: forecastData, place: fav.location})

              // get/5. response.send([{location, current_weather},{location, current_weather}])
              return {location: fav.location, current_forecast: forecast.makeCurrently()}
            })
          )
          .then(favForecasts => {
            console.log(favForecasts)
            return response.send(favForecasts)
          })

        })
    })
    .catch(error => {
      response.status(500).json({error})
    })
});

router.post('/', (request, response) => {
  // 1. check request body comes with location and api_key
  const info = request.body;

  for (let requiredParameter of ['location', 'api_key']) {
    if (!info[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { location: <String>, api_key: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  // 2. check api_key in users and return user
  database('users')
    .where('api_key', info['api_key'])
    .first()
    .then(user => {
      if(user) {
        return user
      } else {
        return response
          .status(401)
          .json({"message": "Unauthorized request"})
      }
    })
    .then(user => {
      // 3. add favorite with user reference
      database('favorites').insert({location: info['location'],
                                    user_id: user.id}, 'id')
      .then(async(favorite) => {
        addLatLong(favorite, info['location'])
          .then(data => {
            if(data === undefined){
              // no latLong found
              database('favorites')
                .where({ id: favorite[0] })
                .del()
                .then(()=>{
                  return response.status(404).send("Location not found on Google Maps, please enter a different location")
                })
            } else {
              return response
              .status(200)
              .json({"message": `${info['location']} has been added to your favorites`});
            }
          })
      })
    })
  // 5. catch error handling
  .catch(error => {
    response.status(500).json({error})
  })
});

router.delete('/', (request, response) => {
  // del/1. check request body comes with location and api_key
  const info = request.body;

  for (let requiredParameter of ['location', 'api_key']) {
    if (!info[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { location: <String>, api_key: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  // del/2. check api_key in users and return user
  database('users')
    .where('api_key', info['api_key'])
    .first()
    .then(user => {
      if(user) {
        return user
      } else {
        return response
          .status(401)
          .json({"message": "Unauthorized request"})
      }
    })
    .then(user => {
      return database('favorites')
      // del/3. find user favorite by location and user_id
        .where({user_id: user.id, location: info['location'] })
        // del/4. delete found location from db
        .delete()
    })
    // del/5. return status 204 if successful
    .then(() =>{
      return response.status(204).send("Deleted")
    })
    // del/?. catch error handling
    .catch(error => {
      response.status(500).json({error})
    })
});

// 4. look up lat and long of favorite to add update row in table
async function addLatLong(fav, location) {
  let fav_id = fav[0];
  let googleInfo = await fetchGoogle(location);
  if(googleInfo.results.length > 0){
    let latLong = await googleInfo.results[0].geometry.location;
    let updated = await database('favorites')
    .where({id: fav_id})
    .update({latitude: latLong.lat, longitude: latLong.lng}, ['id', 'latitude', 'longitude'])
    return updated;
  }
}

async function fetchGoogle(loc) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${process.env.GEOCODING_API}`
  let res = await fetch(url);
  let googleInfo = await res.json();
  return googleInfo;
}

async function fetchDarkSky(latLong) {
  let url = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${latLong}?units=us`
  let res = await fetch(url);
  let darkSkyInfo = await res.json();
  return darkSkyInfo;
}

module.exports = router;
