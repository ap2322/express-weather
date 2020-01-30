var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);
const fetch = require('node-fetch');

router.get('/', (request, response) => {
  // -1. Make sure api key sent in request
  const user = request.body;
  // can also use request.body.api_key to get just the key

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
    })
    .then(googleData => {
      let loc = request.query
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${process.env.GEOCODING_API}`)
       .then(res => res.json())
       .then(json => response.send(json))
       .catch(err => console.log(`Error: ${err}`))
    })
    .catch(error => {
      response.status(500).json({error})
    })

  // 1. get parameters from request
  let searchLocation = request.query
  // 2. Send parameters to geocode serivce to get lat and long
  // 3. Send lat and long to darksky service to get forecast
  // 4. format forecast into expected json format
  // 5. return the response.json(forecast)

  // database('papers').select()
  //   .then((papers) => {
  //     response.status(200).json(papers);
  //   })
  //   .catch((error) => {
  //     response.status(500).json({ error });
  //   });
});

module.exports = router;
