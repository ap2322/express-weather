var express = require('express');
var router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


router.get('/', (request, response) => {
  // 0. Check api_key in body to make sure it's in db
  key = request.body
  response.send(key)
  // 1. get parameters from request
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
