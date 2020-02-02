var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');


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
    .select()
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
              console.log(favorite[0], info['location'])
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


    // Returns [ { id: 42, title: "The Hitchhiker's Guide to the Galaxy" } ]

  // 5. .catch error handling

});

// 4. look up lat and long of favorite to add update row in table
async function addLatLong(fav, location) {
  let fav_id = fav[0];
  let googleInfo = await fetchGoogle(location);
  let latLong = await googleInfo.results[0].geometry.location;
  let updated = await database('favorites')
    .where({id: fav_id})
    .update({latitude: latLong.lat, longitude: latLong.lng}, ['id', 'latitude', 'longitude'])
  console.log(updated);
  return updated;
}

async function fetchGoogle(loc) {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${process.env.GEOCODING_API}`
  let res = await fetch(url);
  let googleInfo = await res.json();
  return googleInfo;
}

module.exports = router;
